import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

// GET /api/orders — current user's orders
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, variant: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST /api/orders — create order (non-Stripe path)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { items, shippingAddress, subtotal, shippingCost, total } = await req.json();

    // ── 1. Validate stock for every item before touching the DB ──────────────
    const variantIds: string[] = items.map((i: any) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, stock: true, size: true, color: true, product: { select: { name: true } } },
    });

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found for item "${item.name}".` },
          { status: 400 }
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `"${variant.product.name}" (${variant.size} / ${variant.color}) only has ${variant.stock} unit${variant.stock === 1 ? "" : "s"} left. You requested ${item.quantity}.`,
          },
          { status: 409 }
        );
      }
    }

    // ── 2. Create order + decrement stock atomically ──────────────────────────
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          subtotal,
          shippingCost,
          total,
          shippingAddress,
          items: {
            create: items.map((item: any) => ({
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

    // ── 3. Send order confirmation email ─────────────────────────────────────
    await sendOrderConfirmation({
      orderNumber: order.orderNumber,
      orderId: order.id,
      customerName: session.user.name ?? shippingAddress.firstName ?? "Customer",
      customerEmail: shippingAddress.email ?? session.user.email ?? "",
      items: items.map((i: any) => ({
        name: i.name,
        size: i.size ?? "",
        color: i.color ?? "",
        quantity: i.quantity,
        price: Number(i.price),
        image: i.image,
      })),
      subtotal,
      shippingCost,
      total,
      shippingAddress,
    });

    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
