import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/orders/by-session?sessionId=cs_xxx
// Used by the success page to poll for the order created by the webhook
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const stripeSessionId = searchParams.get("sessionId");

  if (!stripeSessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      stripeSessionId,
      userId: session.user.id, // ensure users can only see their own orders
    },
    select: { id: true, orderNumber: true, status: true },
  });

  if (!order) {
    // 404 — the webhook hasn't fired yet; the success page will retry
    return NextResponse.json({ error: "Order not found yet" }, { status: 404 });
  }

  return NextResponse.json(order);
}
