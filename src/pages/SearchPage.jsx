import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard.jsx";
import { productPath } from "../utils/productLink.js";
import { useStorefront } from "../context/StorefrontContext.jsx";
import { usePaginatedProducts } from "../hooks/usePaginatedProducts.js";
import CatalogPagination from "../components/browse/CatalogPagination.jsx";
import { applyPageSeo, getSeoHeading, publicSiteOrigin } from "../utils/seo.js";

export default function SearchPage() {
  const { country, format: formatMoney } = useStorefront();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const productQuery = useMemo(() => (q ? { q } : {}), [q]);

  useEffect(() => {
    const origin = publicSiteOrigin();
    const title = q ? `Search: ${q}` : getSeoHeading("search", "Search catalogue");
    applyPageSeo({
      title,
      description: q
        ? `Results for “${q}” on KSA Store — groceries, pharmacy, fashion & imports.`
        : "Search KSA Store for authentic products with fast delivery across Saudi Arabia.",
      canonical: origin ? `${origin}/search${q ? `?q=${encodeURIComponent(q)}` : ""}` : undefined,
    });
  }, [q]);

  const {
    products,
    page,
    total,
    totalPages,
    hasMore,
    loading,
    loadingMore,
    loadMore,
    goToPage,
  } = usePaginatedProducts(productQuery, { country });

  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const term = String(fd.get("q") || "").trim();
    if (term) setSearchParams({ q: term });
    else setSearchParams({});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <Link to="/" className="text-sm text-neon-cyan hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 font-display text-2xl font-bold text-white">Search results</h1>

      <form onSubmit={onSubmit} className="mt-6 flex gap-2" role="search">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search products, brands…"
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none focus:border-neon-cyan/40"
          aria-label="Search query"
        />
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-violet px-6 py-3 text-sm font-bold text-charcoal-950"
        >
          Search
        </button>
      </form>

      {q ? (
        <p className="mt-4 text-sm text-white/50">
          Results for <span className="text-white/80">&ldquo;{q}&rdquo;</span>
        </p>
      ) : (
        <p className="mt-4 text-sm text-white/45">Enter a term to search the catalogue.</p>
      )}

      {loading ? (
        <p className="mt-10 text-sm text-white/45">Searching…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Link key={p._id} to={productPath(p)} className="block">
              <ProductCard
                title={p.title}
                price={formatMoney(p.ksaPrice)}
                image={p.images?.[0]}
                index={i}
                category={p.category}
              />
            </Link>
          ))}
        </div>
      )}

      {!loading && q && products.length === 0 ? (
        <p className="mt-10 text-sm text-white/45">No products matched your search.</p>
      ) : null}

      {q ? (
        <CatalogPagination
          page={page}
          totalPages={totalPages}
          total={total}
          hasMore={hasMore}
          loading={loading}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
          onGoToPage={goToPage}
        />
      ) : null}
    </div>
  );
}
