import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "@/components/store/ShopFilters";
import { ShopPagination } from "@/components/store/ShopPagination";
import { serializeProduct } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all Mo Style Hub products.",
};

const PAGE_SIZE = 12;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const where = {
    isActive: true,
    ...(params.category && { category: { slug: params.category } }),
    ...(params.q && {
      OR: [
        { name: { contains: params.q, mode: "insensitive" as const } },
        { description: { contains: params.q, mode: "insensitive" as const } },
      ],
    }),
    ...((params.minPrice || params.maxPrice) && {
      price: {
        ...(params.minPrice && { gte: parseFloat(params.minPrice) }),
        ...(params.maxPrice && { lte: parseFloat(params.maxPrice) }),
      },
    }),
  };

  const orderBy =
    params.sort === "price-asc"
      ? { price: "asc" as const }
      : params.sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const [totalCount, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true, variants: true },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl tracking-widest uppercase mb-2">
          {params.category
            ? categories.find((c) => c.slug === params.category)?.name || "Shop"
            : params.q
            ? `Search: "${params.q}"`
            : "All Products"}
        </h1>
        <p className="text-[#6b6b6b] font-sans-clean text-sm">
          {totalCount} product{totalCount !== 1 ? "s" : ""}
          {totalPages > 1 && ` — page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-60 flex-shrink-0">
          <ShopFilters categories={categories} />
        </aside>

        {/* Product grid + pagination */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#6b6b6b] font-sans-clean text-sm">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={serializeProduct(product) as any}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <ShopPagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={params}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
