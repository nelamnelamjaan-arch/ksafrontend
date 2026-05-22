import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/apiUrl.js";
import { isOpenShopEnabled } from "../utils/openShop.js";
import { applyPageSeo, getSeoHeading, publicSiteOrigin } from "../utils/seo.js";

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const openShop = isOpenShopEnabled();

  useEffect(() => {
    if (!openShop) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/shops?limit=48&page=1"));
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setShops(Array.isArray(data?.shops) ? data.shops : []);
      } catch {
        if (!cancelled) setShops([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [openShop]);

  useEffect(() => {
    const origin = publicSiteOrigin();
    applyPageSeo({
      title: getSeoHeading("shops", "Seller Shops — KSA Store"),
      description:
        "Browse independent seller storefronts on KSA Store — curated catalogues with secure checkout and nationwide delivery.",
      canonical: origin ? `${origin}/shops` : undefined,
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link to="/" className="text-sm text-neon-cyan hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 font-display text-2xl font-bold text-white">Seller shops</h1>
      <p className="mt-2 text-sm text-white/50">
        Independent storefronts on KSA Store — each shop has its own catalogue and fulfilment.
      </p>

      {!openShop ? (
        <p className="mt-10 text-sm text-white/45">Open Shop is not enabled on this deployment.</p>
      ) : loading ? (
        <p className="mt-10 text-sm text-white/45">Loading shops…</p>
      ) : shops.length === 0 ? (
        <p className="mt-10 text-sm text-white/45">
          No active shops yet.{" "}
          <Link to="/seller/register" className="text-neon-cyan hover:underline">
            Register as a seller
          </Link>
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {shops.map((s) => (
            <li key={s._id}>
              <Link
                to={`/shops/${s.slug}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-neon-cyan/30 hover:bg-white/[0.06]"
              >
                <h2 className="font-semibold text-white">{s.name}</h2>
                {s.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-white/50">{s.description}</p>
                ) : null}
                <span className="mt-3 inline-block text-xs text-neon-cyan/80">Visit shop →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
