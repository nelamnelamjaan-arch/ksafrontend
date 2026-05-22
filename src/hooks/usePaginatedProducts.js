import { useCallback, useEffect, useMemo, useState } from "react";
import { geoFetch } from "../utils/geoFetch.js";
import { parseProductsResponse } from "../utils/parseProductsResponse.js";
import { BROWSE_PAGE_SIZE } from "../utils/catalogBrowse.js";

/**
 * Paginated storefront product fetch (page mode or append "load more").
 */
export function usePaginatedProducts(queryParams, { country, pageSize = BROWSE_PAGE_SIZE } = {}) {
  const stableKey = useMemo(() => JSON.stringify(queryParams || {}), [queryParams]);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (targetPage, { append = false } = {}) => {
      const p = new URLSearchParams();
      for (const [k, v] of Object.entries(queryParams || {})) {
        if (v != null && v !== "") p.set(k, String(v));
      }
      p.set("limit", String(pageSize));
      p.set("page", String(targetPage));

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const res = await geoFetch(`/api/products?${p.toString()}`);
        const { products: list, pagination: pag } = await parseProductsResponse(res);

        setProducts((prev) => (append ? [...prev, ...list] : list));
        setPagination(pag);
        setPage(targetPage);
      } catch (e) {
        setError(e?.message || "Failed to load products");
        if (!append) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [queryParams, pageSize]
  );

  useEffect(() => {
    setPage(1);
    fetchPage(1, { append: false });
  }, [stableKey, country, fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    const hasMore = pagination?.hasMore ?? false;
    if (!hasMore) return;
    fetchPage(page + 1, { append: true });
  }, [fetchPage, loading, loadingMore, page, pagination?.hasMore]);

  const goToPage = useCallback(
    (n) => {
      const target = Math.max(1, Math.floor(n));
      if (target === page && !loading) return;
      fetchPage(target, { append: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPage, loading, page]
  );

  return {
    products,
    pagination,
    page,
    loading,
    loadingMore,
    error,
    loadMore,
    goToPage,
    hasMore: Boolean(pagination?.hasMore),
    total: pagination?.total ?? products.length,
    totalPages: pagination?.totalPages ?? 1,
  };
}
