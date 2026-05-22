import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import HyperlocalMarketplaceSidebar from "../components/marketplace/HyperlocalMarketplaceSidebar.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import CategoryNavBar from "../components/layout/CategoryNavBar.jsx";
import CatalogPagination from "../components/browse/CatalogPagination.jsx";
import CategorySubnav from "../components/browse/CategorySubnav.jsx";
import { isJewelleryCategory } from "../utils/productCategoryUi.js";
import VisualSearchPanel from "../components/search/VisualSearchPanel.jsx";
import { productPath } from "../utils/productLink.js";
import { apiUrl } from "../utils/apiUrl.js";
import { geoFetch } from "../utils/geoFetch.js";
import { useStorefront } from "../context/StorefrontContext.jsx";
import { usePaginatedProducts } from "../hooks/usePaginatedProducts.js";
import {
  STORE_DEPARTMENTS,
  departmentProductQuery,
  parseDepartmentFromPath,
  categoryBrowsePath,
} from "../utils/catalogBrowse.js";
import { applyPageSeo, getSeoHeading, publicSiteOrigin } from "../utils/seo.js";

export default function BrowsePage() {
  const { country, dailyEssentialsVendors, format: formatMoney } = useStorefront();
  const { pathname } = useLocation();
  const { department, slug: categorySlug, parentSlug, childSlug } = useParams();
  const [searchParams] = useSearchParams();

  const vertical = searchParams.get("vertical") || "";
  const catalogKey = searchParams.get("catalog_key") || "";
  const group = searchParams.get("group") || "";

  const resolvedSlug = childSlug || categorySlug || "";
  const resolvedParentSlug = childSlug ? parentSlug : null;

  const [categoryMeta, setCategoryMeta] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(Boolean(resolvedSlug));

  const deptKey = department || parseDepartmentFromPath(pathname);

  useEffect(() => {
    if (!resolvedSlug) {
      setCategoryMeta(null);
      setCategoryLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setCategoryLoading(true);
      try {
        const q = resolvedParentSlug
          ? `?parent=${encodeURIComponent(resolvedParentSlug)}`
          : "";
        const res = await geoFetch(`/api/categories/resolve/${encodeURIComponent(resolvedSlug)}${q}`);
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setCategoryMeta(res.ok ? data : null);
      } catch {
        if (!cancelled) setCategoryMeta(null);
      } finally {
        if (!cancelled) setCategoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedSlug, resolvedParentSlug]);

  const productQuery = useMemo(() => {
    if (categoryMeta?.category?._id) {
      const cat = categoryMeta.category;
      const hasChildren = (categoryMeta.children?.length ?? 0) > 0;
      return hasChildren ? { categoryId: cat._id, includeDescendants: "1" } : { categoryId: cat._id };
    }
    if (deptKey) {
      const deptQ = departmentProductQuery(deptKey);
      if (Object.keys(deptQ).length) return deptQ;
    }
    const q = {};
    if (vertical) q.vertical = vertical;
    if (catalogKey) q.catalog_key = catalogKey;
    if (group) q.group = group;
    return q;
  }, [categoryMeta, deptKey, vertical, catalogKey, group]);

  const {
    products,
    page,
    total,
    totalPages,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore,
    goToPage,
  } = usePaginatedProducts(productQuery, { country });

  const dept = STORE_DEPARTMENTS.find((d) => d.key === deptKey);
  const category = categoryMeta?.category;
  const isGourmet =
    vertical === "gourmet_food" ||
    catalogKey === "gourmet_food" ||
    category?.marketplace_vertical === "gourmet_food" ||
    deptKey === "gourmet";

  const title =
    category?.name ||
    dept?.label ||
    (catalogKey === "fresh_produce"
      ? "Fresh Produce"
      : catalogKey === "daily_essentials"
        ? "Daily Essentials"
        : isGourmet
          ? "Gourmet Food & Essentials"
          : vertical === "healthcare"
            ? "Pharmacy"
            : "Browse");

  const parentForSubnav =
    categoryMeta?.parent?.slug ||
    (category && !category.parent ? category.slug : parentSlug);

  useEffect(() => {
    const origin = publicSiteOrigin();
    const pageTitle = getSeoHeading(`browse_${catalogKey || deptKey || "default"}`, title);
    const desc =
      category?.description ||
      dept?.description ||
      `Shop ${pageTitle} on KSA Store — authentic products, fast delivery across Saudi Arabia.`;
    const qs = searchParams.toString();
    applyPageSeo({
      title: `${pageTitle} — KSA Store`,
      description: desc,
      canonical: origin ? `${origin}${pathname}${qs ? `?${qs}` : ""}` : undefined,
    });
  }, [title, category, dept, catalogKey, deptKey, pathname, searchParams]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 lg:flex-row lg:px-8">
      <div className="shrink-0 lg:w-64">
        <HyperlocalMarketplaceSidebar />
        <div className="mt-6 hidden lg:block">
          <DepartmentSidebar activeKey={deptKey} />
        </div>
        <div className="mt-6">
          <VisualSearchPanel />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <Link to="/" className="text-sm text-neon-cyan hover:underline">
          ← Home
        </Link>
        <CategoryNavBar />
        <h1 className="mt-6 font-display text-2xl font-bold text-white">{title}</h1>
        {(category?.description || dept?.description) && (
          <p className="mt-2 max-w-2xl text-sm text-white/50">
            {category?.description || dept?.description}
          </p>
        )}
        <p className="mt-2 text-sm text-white/50">
          Prices reflect partner sites; margin: groceries +15%, pharmacy +10%, luxury +30%.
          {catalogKey === "daily_essentials" && dailyEssentialsVendors?.length > 0 ? (
            <span className="mt-2 block text-neon-cyan/80">
              Sourcing from local partners:{" "}
              {dailyEssentialsVendors.map((v) => v.label).join(", ")}.
            </span>
          ) : null}
        </p>

        {categoryMeta?.parent ? (
          <Link
            to={categoryBrowsePath(categoryMeta.parent.slug)}
            className="mt-3 inline-block text-xs text-neon-cyan/80 hover:underline"
          >
            ← {categoryMeta.parent.name}
          </Link>
        ) : null}

        <CategorySubnav
          parentSlug={parentForSubnav}
          children={categoryMeta?.children || []}
          activeSlug={resolvedSlug}
        />

        {categoryLoading || loading ? (
          <p className="mt-10 text-sm text-white/45">Loading catalogue…</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Link key={p._id} to={productPath(p)} className="block">
                <ProductCard
                  title={p.title}
                  price={formatMoney(p.ksaPrice)}
                  priceComparisonAvailable={p.priceComparisonAvailable}
                  tag={
                    isGourmet && p.deliveryType === "Local Express"
                      ? "Local Express"
                      : p.storeStockStatus === "in_stock"
                        ? "In stock"
                        : "Check stock"
                  }
                  image={p.images?.[0]}
                  index={i}
                  lastPriceScrapedAt={p.last_price_scraped_at || p.updatedAt}
                  stockStatus={p.storeStockStatus}
                  stockQuantity={p.stockQuantity}
                  category={p.category}
                  perishable={p.isPerishable ?? p.perishable}
                  vipGourmetBadge={p.vipGourmetBadge}
                  gourmetTheme={isGourmet}
                  jewelleryTheme={isJewelleryCategory(p.category)}
                />
              </Link>
            ))}
          </div>
        )}

        {error ? (
          <div className="mt-10 space-y-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            <p>{error}</p>
            <p className="text-xs text-amber-100/70">
              Start the API on port 5000 (<code className="text-amber-50">npm run dev:server</code>) and
              use the Vite dev server on 5173 so <code className="text-amber-50">/api</code> proxies correctly.
            </p>
          </div>
        ) : null}

        {!loading && !categoryLoading && !error && products.length === 0 ? (
          <div className="mt-10 space-y-2 text-sm text-white/45">
            <p>No listings match this aisle yet.</p>
            <p className="text-xs text-white/35">
              Run catalog sync for this category — see GLOBAL_CATALOG.md in the repo root.
            </p>
          </div>
        ) : null}

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
      </div>
    </div>
  );
}

function DepartmentSidebar({ activeKey }) {
  return (
    <aside className="glass-panel-strong rounded-3xl p-4" aria-label="Departments">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Departments
      </p>
      <ul className="mt-3 space-y-1">
        {STORE_DEPARTMENTS.map((d) => (
          <li key={d.key}>
            <Link
              to={d.path || `/browse/${d.key}`}
              className={`block rounded-lg px-2 py-1.5 text-sm transition ${
                activeKey === d.key ? "bg-neon-cyan/10 text-neon-cyan" : "text-white/60 hover:text-white"
              }`}
            >
              {d.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
