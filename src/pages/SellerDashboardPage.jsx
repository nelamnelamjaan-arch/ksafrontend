import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { isApprovedSeller } from "../utils/sellerAccess.js";
import { isOpenShopEnabled } from "../utils/openShop.js";
import MagicAmazonImportPanel from "../components/admin/MagicAmazonImportPanel.jsx";
import OpenShopPanel from "../components/seller/OpenShopPanel.jsx";
import SellerManualProductForm from "../components/seller/SellerManualProductForm.jsx";
import { apiUrl } from "../utils/apiUrl.js";

export default function SellerDashboardPage() {
  const { token, user, loading } = useAuth();
  const { currency } = useCurrency();
  const [data, setData] = useState(null);
  const [needsShop, setNeedsShop] = useState(false);
  const [err, setErr] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!token || !isApprovedSeller(user)) return;
    setErr("");
    try {
      const res = await fetch(apiUrl("/api/seller/dashboard"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 404 && /no shop/i.test(json.message || "")) {
        setNeedsShop(true);
        setData(null);
        return;
      }
      if (!res.ok) {
        setErr(json.message || "Could not load dashboard");
        setNeedsShop(false);
        return;
      }
      setNeedsShop(false);
      setData(json);
    } catch {
      setErr("Network error");
    }
  }, [token, user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-white/45">Loading…</div>
    );
  }

  if (!isOpenShopEnabled()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-white/50">
        Open Shop is disabled on this deployment.
      </div>
    );
  }

  if (!token || !isApprovedSeller(user)) {
    return <Navigate to="/seller/login" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link to="/" className="text-sm text-neon-cyan hover:underline">
        ← Storefront
      </Link>
      <h1 className="mt-6 font-display text-2xl font-bold text-white">Seller Dashboard</h1>
      <p className="mt-2 text-sm text-white/55">
        {user.name}
        {data?.shop?.name ? ` · ${data.shop.name}` : null}
        {data?.shop?.slug ? (
          <>
            {" "}
            ·{" "}
            <Link to={`/shops/${data.shop.slug}`} className="text-neon-cyan hover:underline">
              View public shop
            </Link>
          </>
        ) : null}
      </p>

      {needsShop ? (
        <OpenShopPanel
          token={token}
          onCreated={() => {
            setNeedsShop(false);
            loadDashboard();
          }}
        />
      ) : null}

      {!needsShop && data?.stats ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Pending", data.stats.pendingProducts],
            ["Live", data.stats.liveProducts],
            ["Recent orders", data.stats.recentOrderCount],
          ].map(([label, val]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-md"
            >
              <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
              <p className="mt-1 font-mono text-xl text-white">{val}</p>
            </div>
          ))}
        </div>
      ) : null}

      {!needsShop ? (
        <>
          <SellerManualProductForm token={token} onCreated={loadDashboard} />
          <div className="mt-10">
            <MagicAmazonImportPanel
              token={token}
              displayCurrency={currency}
              importEndpoint="/api/seller/import"
              loaderText="AI is scanning the globe…"
              successHint="Submitted for Super Admin approval — not visible on the storefront yet."
            />
          </div>
        </>
      ) : null}

      {err ? (
        <p className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100/90">
          {err}
        </p>
      ) : null}

      {!needsShop && data?.recentOrders?.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">Recent orders</h2>
          <ul className="mt-4 space-y-3">
            {data.recentOrders.map((o) => (
              <li
                key={o._id}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 backdrop-blur-md"
              >
                <span className="font-mono text-neon-cyan">{o.ksaSerialGlobal || o._id}</span>
                {" · "}
                {Number(o.totalSAR || 0).toFixed(2)} SAR
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!needsShop && data?.recentProducts?.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">Your products</h2>
          <ul className="mt-4 space-y-3">
            {data.recentProducts.map((p) => (
              <li
                key={p._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-md"
              >
                <span className="text-sm text-white/85">{p.title}</span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                    p.status === "approved" || p.approvalStatus === "approved"
                      ? "border border-teal-400/40 text-teal-200"
                      : p.status === "rejected" || p.approvalStatus === "rejected"
                        ? "border border-rose-400/40 text-rose-200"
                        : "border border-amber-400/40 text-amber-200"
                  }`}
                >
                  {p.status || p.approvalStatus}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
