import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a1a1a]/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-in">
        <p className="text-xs tracking-[0.3em] uppercase font-sans-clean mb-4 text-[#e8d5b0]">
          New Collection 2026
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase mb-6 leading-tight">
          Mo Style
          <br />
          <span className="text-[#c9a96e]">Hub</span>
        </h1>
        <p className="font-sans-clean text-sm md:text-base tracking-wider text-white/80 max-w-md mx-auto mb-10">
          Timeless fashion for the modern individual. Crafted with intention,
          worn with purpose.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="btn-gold px-10 py-4 inline-block"
          >
            Shop Now
          </Link>
          <Link
            href="/shop?featured=true"
            className="border border-white text-white text-xs tracking-widest uppercase font-sans-clean px-10 py-4 hover:bg-white hover:text-[#1a1a1a] transition-colors inline-block"
          >
            New Arrivals
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase font-sans-clean">Scroll</span>
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  );
}
