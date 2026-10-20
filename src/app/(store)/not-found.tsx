import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-8">
      <p className="font-display text-[6rem] leading-none tracking-widest text-[#e8e4de]">
        404
      </p>
      <div className="space-y-3">
        <h1 className="font-display text-2xl tracking-widest uppercase">
          Page Not Found
        </h1>
        <p className="font-sans-clean text-sm text-[#6b6b6b]">
          We couldn't find what you were looking for.
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
  );
}
