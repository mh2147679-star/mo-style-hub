export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="h-7 w-40 bg-[#e8e4de] animate-pulse rounded-sm mb-2" />
        <div className="h-4 w-20 bg-[#e8e4de] animate-pulse rounded-sm" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar skeleton */}
        <aside className="w-full lg:w-60 flex-shrink-0 space-y-4">
          <div className="h-4 w-24 bg-[#e8e4de] animate-pulse rounded-sm" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-32 bg-[#f0ede8] animate-pulse rounded-sm" />
          ))}
          <div className="h-4 w-24 bg-[#e8e4de] animate-pulse rounded-sm mt-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-28 bg-[#f0ede8] animate-pulse rounded-sm" />
          ))}
        </aside>

        {/* Product grid skeleton */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-[#e8e4de] animate-pulse rounded-sm mb-4" />
      <div className="h-3 w-16 bg-[#f0ede8] animate-pulse rounded-sm mb-2" />
      <div className="h-4 w-32 bg-[#e8e4de] animate-pulse rounded-sm mb-2" />
      <div className="h-4 w-20 bg-[#f0ede8] animate-pulse rounded-sm" />
    </div>
  );
}
