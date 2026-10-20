export function BrandStory() {
  return (
    <section className="py-24 bg-[#1a1a1a] text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="text-xs tracking-[0.3em] uppercase font-sans-clean text-[#c9a96e] mb-6">
          Our Philosophy
        </p>
        <h2 className="font-display text-3xl md:text-5xl tracking-widest uppercase mb-8 leading-tight">
          Crafted for the
          <br />
          Intentional Life
        </h2>
        <div className="divider mb-8" />
        <p className="text-[#9a9a9a] font-sans-clean text-sm md:text-base leading-relaxed mb-6">
          Mo Style Hub was born from a simple belief: clothing should be both
          beautiful and meaningful. We design pieces that transcend seasons,
          built with premium materials and thoughtful construction that lasts
          for years, not trends.
        </p>
        <p className="text-[#9a9a9a] font-sans-clean text-sm md:text-base leading-relaxed">
          Each collection is a story — of craftsmanship, of intention, of
          the modern individual who chooses quality over quantity and style
          over speed.
        </p>

        <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-[#2a2a2a]">
          {[
            { number: "500+", label: "Products" },
            { number: "10K+", label: "Happy Customers" },
            { number: "100%", label: "Quality Assured" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-[#c9a96e] mb-2">
                {stat.number}
              </p>
              <p className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
