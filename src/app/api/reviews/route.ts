import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/reviews — submit a review for a product
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, rating, comment } = await req.json();

    // ── Validate input ────────────────────────────────────────────────────────
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "productId is required." }, { status: 400 });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    // ── Verify product exists ─────────────────────────────────────────────────
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // ── Only buyers with a delivered order can review ─────────────────────────
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: "DELIVERED",
        },
      },
    });
    if (!hasPurchased) {
      return NextResponse.json(
        { error: "You can only review products from a delivered order." },
        { status: 403 }
      );
    }

    // ── Upsert — one review per user per product (schema has unique constraint) ─
    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        rating,
        comment: comment?.trim() || null,
      },
      create: {
        userId: session.user.id,
        productId,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
