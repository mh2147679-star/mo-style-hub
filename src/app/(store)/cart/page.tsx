"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/store/WishlistButton";
import type { Metadata } from "next";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  const shipping = totalPrice() > 150 ? 0 : 15;
  const total = totalPrice() + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <svg
          className="w-12 h-12 text-[#e8e4de] mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="font-display text-2xl tracking-widest uppercase mb-3">
          Your cart is empty
        </h1>
        <p className="text-[#6b6b6b] font-sans-clean text-sm mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop" className="btn-gold px-8 py-3 inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl tracking-widest uppercase">
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-sans-clean text-[#6b6b6b] hover:text-red-500 transition-colors tracking-widest uppercase"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-[#e8e4de]">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 py-6">
              {/* Image */}
              <Link
                href={`/products/${item.productId}`}
                className="relative w-24 h-32 bg-[#f0ede8] flex-shrink-0 block"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-sans-clean text-sm font-medium hover:text-[#c9a96e] transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-[#6b6b6b] font-sans-clean mt-0.5">
                      {item.size} · {item.color}
                    </p>
                    <p className="text-[#c9a96e] font-sans-clean text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  {/* Line total */}
                  <p className="font-sans-clean text-sm font-medium whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity stepper */}
                  <div className="flex items-center border border-[#e8e4de]">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-sans-clean">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <WishlistButton
                      productId={item.productId}
                      variant="icon"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-sans-clean text-[#6b6b6b] hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e8e4de] p-6 sticky top-24">
            <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-sans-clean text-[#6b6b6b]">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item
                  {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""})
                </span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-xs font-sans-clean text-[#6b6b6b]">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs font-sans-clean text-[#9a9a9a]">
                  Free shipping on orders over $150
                </p>
              )}
              <div className="flex justify-between font-display text-base pt-3 border-t border-[#e8e4de]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-gold block text-center py-3.5 w-full mb-3"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="btn-outline block text-center py-3 w-full text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
