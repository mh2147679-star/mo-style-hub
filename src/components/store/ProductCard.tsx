"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((Number(product.comparePrice) - Number(product.price)) /
          Number(product.comparePrice)) *
          100
      )
    : 0;

  return (
    <div className="group product-card block relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#f0ede8] overflow-hidden mb-4">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#c9a96e] text-white text-xs px-2 py-1 font-sans-clean tracking-wider">
              -{discountPct}%
            </span>
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-[#6b6b6b] font-sans-clean tracking-widest uppercase mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-sans-clean text-sm font-medium text-[#1a1a1a] mb-2 group-hover:text-[#c9a96e] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[#1a1a1a] font-sans-clean text-sm">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[#6b6b6b] font-sans-clean text-xs line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist heart — sits in top-right of image, outside the Link */}
      <WishlistButton
        productId={product.id}
        variant="icon"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      />
    </div>
  );
}
