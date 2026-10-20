import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase font-sans-clean text-[#c9a96e] mb-3">
            Hand Picked
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-widest uppercase">
            Featured Pieces
          </h2>
          <div className="divider mt-4" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b6b6b] font-sans-clean">
              No featured products yet. Add products in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/shop" className="btn-outline px-10 py-3 inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
