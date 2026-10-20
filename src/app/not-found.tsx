import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Large 404 */}
        <div>
          <p className="font-display text-[8rem] leading-none tracking-widest text-[#e8e4de]">
            404
          </p>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-2xl tracking-widest uppercase text-[#1a1a1a]">
            Page Not Found
          </h1>
          <p className="font-sans-clean text-sm text-[#6b6b6b] leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-gold px-8 py-3 inline-block text-sm">
            Go Home
          </Link>
          <Link href="/shop" className="btn-outline px-8 py-3 inline-block text-sm">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
