import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { serializeProduct } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true, variants: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = items.map((i) => i.product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl tracking-widest uppercase mb-2">Wishlist</h1>
        <p className="text-[#6b6b6b] font-sans-clean text-sm">
          {products.length} saved item{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <svg
            className="w-12 h-12 text-[#e8e4de] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <p className="text-[#6b6b6b] font-sans-clean text-sm mb-6">
            Your wishlist is empty. Save items you love.
          </p>
          <Link href="/shop" className="btn-gold px-8 py-3 inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={serializeProduct(product) as any} />
          ))}
        </div>
      )}
    </div>
  );
}
