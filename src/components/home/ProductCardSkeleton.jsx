/** Loading placeholder matching ProductCard layout */
export default function ProductCardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]"
          aria-hidden
        >
          <div className="aspect-[4/5] bg-white/[0.06]" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-3/4 rounded bg-white/[0.08]" />
            <div className="h-4 w-1/2 rounded bg-white/[0.1]" />
          </div>
        </div>
      ))}
    </>
  );
}
