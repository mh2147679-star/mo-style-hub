import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* X icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-2xl tracking-widest uppercase mb-2">
            Payment Cancelled
          </h1>
          <p className="text-[#6b6b6b] font-sans-clean text-sm">
            Your payment was not completed. No charge has been made.
            Your cart items are still saved — you can try again whenever you&apos;re ready.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/checkout" className="btn-gold px-8 py-3 inline-block text-sm">
            Try Again
          </Link>
          <Link href="/shop" className="btn-outline px-8 py-3 inline-block text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
