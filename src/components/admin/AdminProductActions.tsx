"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.refresh();
    setDeleting(false);
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/products/${productId}`}
        className="text-xs font-sans-clean text-[#c9a96e] hover:underline"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs font-sans-clean text-red-500 hover:underline disabled:opacity-50"
      >
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  );
}
