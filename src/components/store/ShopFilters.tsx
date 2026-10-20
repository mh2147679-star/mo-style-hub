"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort") || "newest";

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => updateFilter("category", null)}
              className={`text-sm font-sans-clean transition-colors ${
                !activeCategory
                  ? "text-[#1a1a1a] font-medium"
                  : "text-[#6b6b6b] hover:text-[#1a1a1a]"
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateFilter("category", cat.slug)}
                className={`text-sm font-sans-clean transition-colors ${
                  activeCategory === cat.slug
                    ? "text-[#1a1a1a] font-medium"
                    : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
          Sort By
        </h3>
        <ul className="space-y-2">
          {[
            { label: "Newest", value: "newest" },
            { label: "Price: Low to High", value: "price-asc" },
            { label: "Price: High to Low", value: "price-desc" },
          ].map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateFilter("sort", opt.value)}
                className={`text-sm font-sans-clean transition-colors ${
                  activeSort === opt.value
                    ? "text-[#1a1a1a] font-medium"
                    : "text-[#6b6b6b] hover:text-[#1a1a1a]"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
          Price Range
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") || ""}
            className="input-luxury w-full text-xs"
            onBlur={(e) => updateFilter("minPrice", e.target.value || null)}
          />
          <span className="text-[#6b6b6b] text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") || ""}
            className="input-luxury w-full text-xs"
            onBlur={(e) => updateFilter("maxPrice", e.target.value || null)}
          />
        </div>
      </div>

      {/* Clear filters */}
      {(activeCategory || activeSort !== "newest") && (
        <button
          onClick={() => router.push("/shop")}
          className="text-xs font-sans-clean text-[#c9a96e] hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
