"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 cart-overlay"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#faf9f7] z-50 animate-slide-right flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e4de]">
          <h2 className="font-display text-lg tracking-widest uppercase">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-1 hover:text-[#c9a96e] transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg className="w-12 h-12 text-[#e8e4de]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-[#6b6b6b] text-sm font-sans-clean tracking-wide">
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="btn-outline px-6 py-2.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 pb-5 border-b border-[#e8e4de] last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-20 h-24 bg-[#f0ede8] flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans-clean text-sm font-medium truncate">
                      {item.name}
                    </h4>
                    <p className="text-[#6b6b6b] text-xs font-sans-clean mt-0.5">
                      {item.size} · {item.color}
                    </p>
                    <p className="text-[#c9a96e] text-sm font-sans-clean mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#e8e4de]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a]"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-sans-clean">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#1a1a1a]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-sans-clean text-[#6b6b6b] hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#e8e4de] bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-sans-clean tracking-wide uppercase text-[#6b6b6b]">
                Subtotal
              </span>
              <span className="font-display text-lg">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <p className="text-xs text-[#6b6b6b] font-sans-clean mb-4">
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold block text-center py-3 w-full"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="btn-outline block text-center py-3 w-full mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
