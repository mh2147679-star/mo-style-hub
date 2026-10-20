import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateProductBody } from "@/lib/validateProduct";

// GET /api/products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const take = parseInt(searchParams.get("take") || "50");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(featured === "true" && { featured: true }),
    },
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
    take,
  });

  return NextResponse.json(products);
}

// POST /api/products — admin only
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ── Validate ────────────────────────────────────────────────────────────
    const errors = validateProductBody(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 422 });
    }

    const { variants, ...productData } = body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        name: productData.name.trim(),
        slug: productData.slug.trim(),
        description: productData.description.trim(),
        variants: {
          create: variants,
        },
      },
      include: { variants: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    // Unique constraint on slug
    if (err.code === "P2002" && err.meta?.target?.includes("slug")) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    // Unique constraint on variant SKU
    if (err.code === "P2002" && err.meta?.target?.includes("sku")) {
      return NextResponse.json(
        { error: "One or more variant SKUs already exist in the database." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
