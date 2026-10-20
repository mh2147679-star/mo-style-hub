import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import Stripe from "stripe";

// IMPORTANT: tell Next.js not to parse the body — Stripe needs the raw bytes
// to verify the webhook signature.
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // ── 1. Verify signature ───────────────────────────────────────────────────
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ── 2. Handle checkout.session.completed ─────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only process paid sessions
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    // Guard against duplicate webhook deliveries
    const existing = await prisma.order.findFirst({
      where: { stripeSessionId: session.id },
    });
    if (existing) {
      console.log("[webhook] Order already exists for session", session.id);
      return NextResponse.json({ received: true });
    }

    // Parse metadata stored during checkout-session creation
    const meta = session.metadata ?? {};
    const userId: string = meta.userId;
    const items: Array<{
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
      name: string;
      image: string;
      size: string;
      color: string;
    }> = JSON.parse(meta.items ?? "[]");
    const shippingAddress = JSON.parse(meta.shippingAddress ?? "{}");
    const subtotal = parseFloat(meta.subtotal ?? "0");
    const shippingCost = parseFloat(meta.shippingCost ?? "0");
    const total = parseFloat(meta.total ?? "0");

    if (!userId || !items.length) {
      console.error("[webhook] Missing metadata on session", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      const order = await prisma.$transaction(async (tx) => {
        // Decrement stock
        for (const item of items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Create order marked as PAID
        return tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            subtotal,
            shippingCost,
            total,
            shippingAddress,
            status: "CONFIRMED",
            paymentStatus: "PAID",
            paymentMethod: "card",
            stripeSessionId: session.id,
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                image: item.image,
              })),
            },
          },
        });
      });

      console.log("[webhook] Order created for session", session.id);

      // ── Send confirmation email (outside the transaction) ──────────────────
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      if (user?.email) {
        await sendOrderConfirmation({
          orderNumber: order.orderNumber,
          orderId: order.id,
          customerName: user.name ?? shippingAddress.firstName ?? "Customer",
          customerEmail: user.email,
          items: items.map((i) => ({
            name: i.name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            price: Number(i.price),
            image: i.image,
          })),
          subtotal,
          shippingCost,
          total,
          shippingAddress,
        });
      }
    } catch (err: any) {
      console.error("[webhook] Failed to create order:", err.message);
      // Return 500 so Stripe retries the webhook
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
