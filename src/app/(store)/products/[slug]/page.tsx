import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { auth } from "@/lib/auth";
import { serializeProduct } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const [session, product] = await Promise.all([
    auth(),
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  if (!product) notFound();

  // Related products
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: { category: true, variants: true },
    take: 4,
  });

  // ── Review eligibility ──────────────────────────────────────────────────────
  let canReview = false;
  let existingReview: { id: string; rating: number; comment: string | null } | null = null;

  if (session?.user) {
    const [delivered, userReview] = await Promise.all([
      // Check the user has a confirmed (or further) order containing this product
      prisma.orderItem.findFirst({
        where: {
          productId: product.id,
          order: {
            userId: session.user.id,
            status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
          },
        },
        select: { id: true },
      }),
      // Fetch any existing review by this user for this product
      prisma.review.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: product.id,
          },
        },
        select: { id: true, rating: true, comment: true },
      }),
    ]);

    canReview = !!delivered;
    existingReview = userReview;
  }

  return (
    <ProductDetail
      product={serializeProduct(product) as any}
      related={related.map(serializeProduct) as any}
      canReview={canReview}
      existingReview={existingReview}
    />
  );
}
