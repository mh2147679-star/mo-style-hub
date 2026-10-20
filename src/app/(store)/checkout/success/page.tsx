"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "loading" | "confirmed" | "timeout";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("confirmed"); // No session id — just show success
      return;
    }

    // Poll for the order — the webhook may take a moment to fire
    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    const INTERVAL_MS = 1500;

    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/by-session?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setOrderNumber(data.orderNumber);
          setStatus("confirmed");
          return;
        }
      } catch {
        // ignore transient errors, keep polling
      }

      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        // Webhook may still be processing — show success without order number
        setStatus("timeout");
        return;
      }
      setTimeout(poll, INTERVAL_MS);
    };

    poll();
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" ? (
          <div className="space-y-4">
            <div className="w-12 h-12 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-sans-clean text-sm text-[#6b6b6b]">Confirming your order…</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Checkmark */}
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h1 className="font-display text-2xl tracking-widest uppercase mb-2">
                Order Confirmed
              </h1>
              {orderNumber ? (
                <p className="text-[#6b6b6b] font-sans-clean text-sm">
                  Your order <strong className="text-[#1a1a1a]">{orderNumber}</strong> has been placed successfully.
                  We&apos;ll be in touch shortly.
                </p>
              ) : (
                <p className="text-[#6b6b6b] font-sans-clean text-sm">
                  Your payment was successful. Your order is being processed and will appear in your order history shortly.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/orders" className="btn-gold px-8 py-3 inline-block text-sm">
                View Orders
              </Link>
              <Link href="/shop" className="btn-outline px-8 py-3 inline-block text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
