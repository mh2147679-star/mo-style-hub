import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateProductBody } from "@/lib/validateProduct";

// GET /api/products/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: true, reviews: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT /api/products/[id] — admin only
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // ── Validate ──────────────────────────────────────────────────────────────
  const errors = validateProductBody(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0], errors }, { status: 422 });
  }

  try {
    const { variants, ...productData } = body;

    // Delete old variants and recreate
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        name: productData.name.trim(),
        slug: productData.slug.trim(),
        description: productData.description.trim(),
        variants: { create: variants },
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json(product);
  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("slug")) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    if (err.code === "P2002" && err.meta?.target?.includes("sku")) {
      return NextResponse.json(
        { error: "One or more variant SKUs already exist in the database." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
