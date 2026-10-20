export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-7 w-36 bg-[#e8e4de] animate-pulse rounded-sm mb-10" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e8e4de] p-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-[#e8e4de] animate-pulse rounded-sm" />
                <div className="h-3 w-28 bg-[#f0ede8] animate-pulse rounded-sm" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 bg-[#f0ede8] animate-pulse rounded-sm" />
                <div className="h-5 w-16 bg-[#e8e4de] animate-pulse rounded-sm" />
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-16 h-20 bg-[#f0ede8] animate-pulse rounded-sm flex-shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
