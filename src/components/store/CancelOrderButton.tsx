"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
}

export function CancelOrderButton({ orderId }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel order.");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <div className="mb-8">
        <button
          onClick={() => setConfirming(true)}
          className="text-xs font-sans-clean tracking-widest uppercase text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 transition-colors"
        >
          Cancel Order
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-red-50 border border-red-200 p-4 max-w-md">
      <p className="text-sm font-sans-clean text-red-700 mb-4">
        Are you sure you want to cancel this order? This cannot be undone.
      </p>
      {error && (
        <p className="text-xs font-sans-clean text-red-600 mb-3">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-xs font-sans-clean tracking-widest uppercase bg-red-500 hover:bg-red-600 text-white px-4 py-2 transition-colors disabled:opacity-50"
        >
          {loading ? "Cancelling…" : "Yes, Cancel Order"}
        </button>
        <button
          onClick={() => { setConfirming(false); setError(""); }}
          disabled={loading}
          className="text-xs font-sans-clean tracking-widest uppercase border border-[#e8e4de] px-4 py-2 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
        >
          Keep Order
        </button>
      </div>
    </div>
  );
}
