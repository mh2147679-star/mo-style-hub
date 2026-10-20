"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  /** "icon" = small heart for product cards, "button" = full labelled button for product detail */
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({ productId, variant = "icon", className = "" }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { hydrate, toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(productId);

  // Hydrate once when the user is logged in
  useEffect(() => {
    if (session?.user) hydrate();
  }, [session, hydrate]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // prevent navigating if inside a <Link>
    e.stopPropagation();

    if (!session?.user) {
      router.push("/login");
      return;
    }

    toggle(productId);
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`btn-outline w-full py-4 flex items-center justify-center gap-2 ${className}`}
      >
        <HeartIcon filled={wishlisted} />
        <span className="text-sm font-sans-clean">
          {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </span>
      </button>
    );
  }

  // icon variant — small absolute heart for product card
  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      className={`p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm ${className}`}
    >
      <HeartIcon filled={wishlisted} className="w-4 h-4" />
    </button>
  );
}

function HeartIcon({ filled, className = "w-5 h-5" }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`${className} transition-colors ${filled ? "text-red-500" : "text-[#6b6b6b]"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}
