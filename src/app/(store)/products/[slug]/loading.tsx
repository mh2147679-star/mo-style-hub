export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-8">
        {[48, 32, 56, 80].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`h-3 w-${w / 4} bg-[#e8e4de] animate-pulse rounded-sm`} style={{ width: w }} />
            {i < 3 && <span className="text-[#e8e4de]">/</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#e8e4de] animate-pulse rounded-sm" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#f0ede8] animate-pulse rounded-sm" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="py-4 space-y-4">
          <div className="h-3 w-24 bg-[#f0ede8] animate-pulse rounded-sm" />
          <div className="h-8 w-64 bg-[#e8e4de] animate-pulse rounded-sm" />
          <div className="h-6 w-20 bg-[#e8e4de] animate-pulse rounded-sm" />
          <div className="w-10 h-px bg-[#e8e4de]" />

          {/* Color selector */}
          <div>
            <div className="h-3 w-16 bg-[#f0ede8] animate-pulse rounded-sm mb-3" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 w-20 bg-[#e8e4de] animate-pulse rounded-sm" />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div className="h-3 w-12 bg-[#f0ede8] animate-pulse rounded-sm mb-3" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-12 bg-[#e8e4de] animate-pulse rounded-sm" />
              ))}
            </div>
          </div>

          {/* Quantity + buttons */}
          <div className="h-10 w-32 bg-[#f0ede8] animate-pulse rounded-sm" />
          <div className="h-12 w-full bg-[#e8e4de] animate-pulse rounded-sm" />
          <div className="h-12 w-full bg-[#f0ede8] animate-pulse rounded-sm" />

          {/* Description */}
          <div className="mt-8 pt-8 border-t border-[#e8e4de] space-y-2">
            <div className="h-3 w-24 bg-[#f0ede8] animate-pulse rounded-sm mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-3 bg-[#f0ede8] animate-pulse rounded-sm`} style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
