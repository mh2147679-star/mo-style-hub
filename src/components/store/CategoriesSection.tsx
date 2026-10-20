import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

const FALLBACK_CATEGORIES = [
  {
    id: "1",
    name: "Women",
    slug: "women",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
  },
  {
    id: "2",
    name: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
  },
  {
    id: "3",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
  },
];

export function CategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  const display =
    categories.length > 0
      ? categories.map((c) => ({
          ...c,
          image:
            c.image ||
            FALLBACK_CATEGORIES.find((f) => f.slug === c.slug)?.image ||
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
        }))
      : FALLBACK_CATEGORIES;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase font-sans-clean text-[#c9a96e] mb-3">
          Browse By
        </p>
        <h2 className="font-display text-3xl md:text-4xl tracking-widest uppercase">
          Categories
        </h2>
        <div className="divider mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {display.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative overflow-hidden aspect-[3/4]"
          >
            <Image
              src={cat.image || ""}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#1a1a1a]/30 group-hover:bg-[#1a1a1a]/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
              <h3 className="font-display text-2xl tracking-widest uppercase text-white mb-3">
                {cat.name}
              </h3>
              <span className="text-xs tracking-widest uppercase font-sans-clean text-white border-b border-white/60 pb-0.5 group-hover:border-[#c9a96e] group-hover:text-[#c9a96e] transition-colors">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
