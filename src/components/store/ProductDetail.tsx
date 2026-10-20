"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "./ProductCard";
import { ReviewForm } from "./ReviewForm";
import { WishlistButton } from "./WishlistButton";

interface Props {
  product: Product & { variants: ProductVariant[]; reviews: any[] };
  related: Product[];
  canReview?: boolean;
  existingReview?: { id: string; rating: number; comment: string | null } | null;
}

export function ProductDetail({ product, related, canReview, existingReview }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCartStore();

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const stockCount = selectedVariant?.stock ?? null;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const lowStock = stockCount !== null && stockCount > 0 && stockCount <= 5;
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;

  // Returns true if a size has at least one variant in stock (any color)
  function isSizeAvailable(size: string) {
    return product.variants.some((v) => v.size === size && v.stock > 0);
  }

  // Returns true if a color has at least one variant in stock (any size)
  function isColorAvailable(color: string) {
    return product.variants.some((v) => v.color === color && v.stock > 0);
  }

  // Returns true if the specific size+color combo is in stock
  function isComboInStock(size: string, color: string) {
    const v = product.variants.find((v) => v.size === size && v.color === color);
    return v ? v.stock > 0 : false;
  }

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color.");
      return;
    }
    if (!selectedVariant) return;
    if (selectedVariant.stock <= 0) return;

    // Cap quantity at available stock
    const safeQty = Math.min(quantity, selectedVariant.stock);

    setAdding(true);
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: safeQty,
    });
    setTimeout(() => setAdding(false), 800);
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs font-sans-clean text-[#6b6b6b]">
        <Link href="/" className="hover:text-[#1a1a1a]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#1a1a1a]">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-[#1a1a1a]">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-[#f0ede8] overflow-hidden">
            <Image
              src={product.images[selectedImage] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square bg-[#f0ede8] overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-[#c9a96e]" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-4">
          <p className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-2">
            {product.category?.name}
          </p>
          <h1 className="font-display text-3xl tracking-wide mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(avgRating) ? "text-[#c9a96e]" : "text-[#e8e4de]"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#6b6b6b] font-sans-clean">
                ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-2xl">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-[#6b6b6b] text-sm font-sans-clean line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>

          <div className="w-10 h-px bg-[#e8e4de] mb-6" />

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase font-sans-clean mb-3">
                Color:{" "}
                <span className="text-[#c9a96e]">{selectedColor || "Select"}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => {
                  const available = selectedSize
                    ? isComboInStock(selectedSize, color)
                    : isColorAvailable(color);
                  return (
                    <button
                      key={color}
                      onClick={() => available && setSelectedColor(color)}
                      disabled={!available}
                      title={!available ? "Out of stock" : undefined}
                      className={`px-4 py-2 text-xs font-sans-clean border transition-colors relative ${
                        selectedColor === color
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : available
                          ? "border-[#e8e4de] hover:border-[#1a1a1a]"
                          : "border-[#e8e4de] text-[#c0bdb8] cursor-not-allowed line-through"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase font-sans-clean mb-3">
                Size:{" "}
                <span className="text-[#c9a96e]">{selectedSize || "Select"}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => {
                  const available = selectedColor
                    ? isComboInStock(size, selectedColor)
                    : isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      title={!available ? "Out of stock" : undefined}
                      className={`w-12 h-12 text-xs font-sans-clean border transition-colors relative ${
                        selectedSize === size
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : available
                          ? "border-[#e8e4de] hover:border-[#1a1a1a]"
                          : "border-[#e8e4de] text-[#c0bdb8] cursor-not-allowed line-through"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase font-sans-clean mb-3">Quantity</p>
            <div className="flex items-center border border-[#e8e4de] w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a]"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-sans-clean">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(
                    stockCount !== null
                      ? Math.min(stockCount, quantity + 1)
                      : quantity + 1
                  )
                }
                disabled={stockCount !== null && quantity >= stockCount}
                className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {/* Stock status messages */}
            {selectedVariant && (
              <p className={`text-xs font-sans-clean mt-2 ${
                stockCount === 0
                  ? "text-red-500"
                  : lowStock
                  ? "text-amber-600"
                  : "text-[#6b6b6b]"
              }`}>
                {stockCount === 0
                  ? "Out of stock"
                  : lowStock
                  ? `Only ${stockCount} left`
                  : `${stockCount} in stock`}
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding || !selectedSize || !selectedColor}
            className="btn-gold w-full py-4 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding
              ? "Added ✓"
              : !inStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* Wishlist */}
          <WishlistButton productId={product.id} variant="button" className="mb-3" />

          {/* Description */}
          <div className="mt-8 pt-8 border-t border-[#e8e4de]">
            <h3 className="text-xs tracking-widest uppercase font-sans-clean mb-4">Description</h3>
            <p className="text-[#6b6b6b] font-sans-clean text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 pt-12 border-t border-[#e8e4de]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl tracking-widest uppercase">Reviews</h2>
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(avgRating) ? "text-[#c9a96e]" : "text-[#e8e4de]"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-sans-clean text-[#6b6b6b]">
                {avgRating.toFixed(1)} · {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Existing reviews list */}
        {product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="bg-white p-6 border border-[#e8e4de]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? "text-[#c9a96e]" : "text-[#e8e4de]"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-sans-clean font-medium">{review.user.name}</span>
                  <span className="text-xs font-sans-clean text-[#9a9a9a] ml-auto">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-[#6b6b6b] text-sm font-sans-clean">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6b6b6b] font-sans-clean text-sm mb-10">
            No reviews yet. Be the first to share your thoughts.
          </p>
        )}

        {/* Review form — only for eligible buyers */}
        {canReview && (
          <ReviewForm
            productId={product.id}
            existingReview={existingReview}
          />
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#e8e4de]">
          <h2 className="font-display text-2xl tracking-widest uppercase mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
