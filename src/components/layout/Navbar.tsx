"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCartStore();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when it opens
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7] border-b border-[#e8e4de]">
      {/* Top announcement bar */}
      <div className="bg-[#1a1a1a] text-white text-center py-2 text-xs tracking-widest uppercase font-sans-clean">
        Free shipping on orders over $150 · New collection available now
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full bg-white border-b border-[#e8e4de] shadow-sm z-40 animate-fade-in">
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3"
          >
            <svg
              className="w-4 h-4 text-[#c9a96e] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Search products…"
              className="flex-1 bg-transparent outline-none font-sans-clean text-sm text-[#1a1a1a] placeholder:text-[#9a9a9a]"
            />
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
              aria-label="Close search"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-px bg-[#1a1a1a] mb-1.5" />
            <div className="w-5 h-px bg-[#1a1a1a] mb-1.5" />
            <div className="w-5 h-px bg-[#1a1a1a]" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl tracking-widest uppercase text-[#1a1a1a] absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            Mo Style Hub
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/shop?category=women"
              className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Women
            </Link>
            <Link
              href="/shop?category=men"
              className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Men
            </Link>
            <Link
              href="/shop?category=accessories"
              className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              Accessories
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            >
              <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            {/* Account links — desktop */}
            {session ? (
              <div className="hidden lg:flex items-center gap-4">
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] hover:text-[#b8955a] transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                >
                  Wishlist
                </Link>
                <Link
                  href="/profile"
                  className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2" aria-label="View cart">
              <svg
                className="w-5 h-5 text-[#1a1a1a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-sans-clean">
                  {totalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-[#e8e4de] py-4 animate-fade-in">
            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                if (!q) return;
                setMenuOpen(false);
                setSearchQuery("");
                router.push(`/shop?q=${encodeURIComponent(q)}`);
              }}
              className="flex items-center gap-2 border border-[#e8e4de] px-3 py-2 mb-4"
            >
              <svg className="w-4 h-4 text-[#c9a96e] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent outline-none font-sans-clean text-xs text-[#1a1a1a] placeholder:text-[#9a9a9a]"
              />
            </form>

            <div className="flex flex-col gap-4">
              <Link
                href="/shop"
                className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                onClick={() => setMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                href="/shop?category=women"
                className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                onClick={() => setMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                href="/shop?category=men"
                className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                onClick={() => setMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                href="/shop?category=accessories"
                className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                onClick={() => setMenuOpen(false)}
              >
                Accessories
              </Link>

              {session ? (
                <>
                  {session.user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/profile"
                    className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/cart"
                    className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-left text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
