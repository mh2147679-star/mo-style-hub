export default function WishlistLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-7 w-32 bg-[#e8e4de] animate-pulse rounded-sm mb-2" />
      <div className="h-4 w-20 bg-[#f0ede8] animate-pulse rounded-sm mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-[#e8e4de] animate-pulse rounded-sm mb-4" />
            <div className="h-3 w-16 bg-[#f0ede8] animate-pulse rounded-sm mb-2" />
            <div className="h-4 w-28 bg-[#e8e4de] animate-pulse rounded-sm mb-2" />
            <div className="h-4 w-16 bg-[#f0ede8] animate-pulse rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
