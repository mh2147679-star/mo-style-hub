"use client";

import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(searchParams)) {
    if (val && key !== "page") params.set(key, val);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

export function ShopPagination({ currentPage, totalPages, searchParams }: Props) {
  // Build page number list — show up to 5 pages around current
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase =
    "w-9 h-9 flex items-center justify-center text-xs font-sans-clean border transition-colors";
  const active = `${btnBase} border-[#1a1a1a] bg-[#1a1a1a] text-white`;
  const inactive = `${btnBase} border-[#e8e4de] text-[#6b6b6b] hover:border-[#c9a96e] hover:text-[#1a1a1a]`;
  const disabled = `${btnBase} border-[#e8e4de] text-[#c0bdb8] cursor-not-allowed`;

  return (
    <nav
      aria-label="Shop pagination"
      className="flex items-center justify-center gap-1.5 pt-4 border-t border-[#e8e4de]"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={buildHref(searchParams, currentPage - 1)} className={inactive} aria-label="Previous page">
          ←
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">←</span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-[#9a9a9a]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(searchParams, p)}
            className={p === currentPage ? active : inactive}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={buildHref(searchParams, currentPage + 1)} className={inactive} aria-label="Next page">
          →
        </Link>
      ) : (
        <span className={disabled} aria-disabled="true">→</span>
      )}
    </nav>
  );
}
