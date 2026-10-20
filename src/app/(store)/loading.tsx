export default function StoreLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="h-[70vh] bg-[#e8e4de] animate-pulse" />

      {/* Categories skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-6 w-48 bg-[#e8e4de] animate-pulse rounded-sm mx-auto mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#f0ede8] animate-pulse rounded-sm" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="h-6 w-48 bg-[#e8e4de] animate-pulse rounded-sm mx-auto mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-[#e8e4de] animate-pulse rounded-sm mb-3" />
              <div className="h-3 w-16 bg-[#f0ede8] animate-pulse rounded-sm mb-2" />
              <div className="h-4 w-28 bg-[#e8e4de] animate-pulse rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
