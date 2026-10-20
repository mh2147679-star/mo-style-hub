import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, shippingAddress, subtotal, shippingCost, total } =
      await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // ── 1. Pre-validate stock (same logic as orders POST) ────────────────────
    const variantIds: string[] = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        stock: true,
        size: true,
        color: true,
        product: { select: { name: true } },
      },
    });

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found for "${item.name}".` },
          { status: 400 }
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `"${variant.product.name}" (${variant.size} / ${variant.color}) only has ${variant.stock} unit${variant.stock === 1 ? "" : "s"} left.`,
          },
          { status: 409 }
        );
      }
    }

    // ── 2. Build Stripe line items ────────────────────────────────────────────
    const lineItems: import("stripe").Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: `${item.size} / ${item.color}`,
            ...(item.image ? { images: [item.image] } : {}),
          },
          // Stripe expects amounts in cents
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(Number(shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    // ── 3. Create Stripe Checkout Session ─────────────────────────────────────
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: shippingAddress.email,
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
      metadata: {
        userId: session.user.id,
        // Encode cart + address as JSON strings (Stripe metadata values are strings)
        items: JSON.stringify(
          items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image ?? "",
            size: i.size ?? "",
            color: i.color ?? "",
          }))
        ),
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: String(subtotal),
        shippingCost: String(shippingCost),
        total: String(total),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error("[checkout-session]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
