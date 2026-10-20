import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/wishlist — return current user's wishlist product IDs
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true, variants: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

// POST /api/wishlist — add a product to wishlist
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  // upsert prevents duplicates without an error
  const item = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: session.user.id, productId },
    },
    update: {},
    create: { userId: session.user.id, productId },
  });

  return NextResponse.json(item, { status: 201 });
}

// DELETE /api/wishlist — remove a product from wishlist
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  return NextResponse.json({ success: true });
}
