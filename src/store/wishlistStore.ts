"use client";

import { create } from "zustand";

interface WishlistState {
  productIds: Set<string>;
  hydrated: boolean;

  // Load the full wishlist from the API (call once on mount when logged in)
  hydrate: () => Promise<void>;

  // Optimistic toggle — updates local state immediately, syncs with API
  toggle: (productId: string) => Promise<void>;

  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  productIds: new Set(),
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return; // not logged in — stay empty
      const items: Array<{ productId: string }> = await res.json();
      set({
        productIds: new Set(items.map((i) => i.productId)),
        hydrated: true,
      });
    } catch {
      // silently fail — wishlist just won't be pre-filled
    }
  },

  toggle: async (productId: string) => {
    const { productIds } = get();
    const isWishlisted = productIds.has(productId);

    // Optimistic update
    const next = new Set(productIds);
    if (isWishlisted) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ productIds: next });

    try {
      const res = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        // Revert on failure
        set({ productIds });
      }
    } catch {
      // Revert on network error
      set({ productIds });
    }
  },

  isWishlisted: (productId: string) => get().productIds.has(productId),
}));
