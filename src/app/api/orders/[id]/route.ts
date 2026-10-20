import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/orders/[id] — fetch a single order (owner or admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { slug: true } },
          variant: { select: { size: true, color: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Only the order owner or an admin can view
  const isOwner = order.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return NextResponse.json(order);
}

// PATCH /api/orders/[id] — update status
// Admin: any status change
// Owner: can only cancel PENDING or CONFIRMED orders
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const isAdmin = session.user.role === "ADMIN";

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const isOwner = order.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Non-admins can only request cancellation on cancellable orders
    if (!isAdmin) {
      if (body.status !== "CANCELLED") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      const cancellable = ["PENDING", "CONFIRMED"];
      if (!cancellable.includes(order.status)) {
        return NextResponse.json(
          { error: "This order can no longer be cancelled." },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(isAdmin && body.paymentStatus && { paymentStatus: body.paymentStatus }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
