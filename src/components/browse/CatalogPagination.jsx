export default function CatalogPagination({
  page,
  totalPages,
  total,
  hasMore,
  loading,
  loadingMore,
  onLoadMore,
  onGoToPage,
}) {
  if (!total && !loading) return null;

  const pages = [];
  const maxButtons = 7;
  let start = Math.max(1, page - 3);
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="mt-10 space-y-4 border-t border-white/[0.08] pt-8">
      <p className="text-center text-xs text-white/45">
        {total > 0 ? (
          <>
            Showing page {page} of {totalPages} · {total.toLocaleString()} listings
          </>
        ) : (
          "No listings on this page"
        )}
      </p>

      {totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onGoToPage(page - 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5 disabled:opacity-40"
          >
            Previous
          </button>
          {pages.map((n) => (
            <button
              key={n}
              type="button"
              disabled={loading}
              onClick={() => onGoToPage(n)}
              className={`min-w-[2.25rem] rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                n === page
                  ? "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan"
                  : "border-white/10 text-white/60 hover:bg-white/5"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onGoToPage(page + 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5 disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      ) : null}

      {hasMore ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loadingMore}
            onClick={onLoadMore}
            className="rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 px-8 py-3 text-sm font-semibold text-neon-cyan transition hover:bg-neon-cyan/20 disabled:opacity-50"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
