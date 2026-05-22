import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../utils/apiUrl.js";
import { productPath } from "../../utils/productLink.js";

/**
 * Two related products from the same catalog_key — Add Both CTA.
 */
export default function FrequentlyBoughtTogether({ productId, shopId, onAddBoth }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return undefined;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const qs = new URLSearchParams({ productId: String(productId) });
        const res = await fetch(apiUrl(`/api/products/cross-sell?${qs.toString()}`));
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok) {
          setRows(Array.isArray(data.products) ? data.products : []);
        }
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading || rows.length === 0) return null;

  const checkoutBoth = () => {
    if (typeof onAddBoth === "function") {
      onAddBoth(rows);
      return;
    }
    const first = rows[0];
    const qs = new URLSearchParams({
      shopId: String(shopId || first?.shop?._id || first?.shop || ""),
      productId: String(first?._id || ""),
    });
    window.location.href = `/checkout?${qs.toString()}`;
  };

  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-white">Frequently bought together</h2>
      <ul className="mt-4 space-y-3">
        {rows.map((p) => (
          <li key={p._id} className="flex items-center justify-between gap-3">
            <Link to={productPath(p)} className="text-sm text-neon-cyan hover:underline line-clamp-2">
              {p.title}
            </Link>
            <span className="shrink-0 text-sm font-semibold text-white/80">{p.ksaPrice} SAR</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={checkoutBoth}
        className="mt-4 w-full rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 py-2.5 text-sm font-bold text-neon-cyan transition hover:bg-neon-cyan/20"
      >
        Add both to checkout
      </button>
    </section>
  );
}
