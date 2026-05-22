import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../utils/apiUrl.js";

function verticalLabel(v) {
  if (!v) return "";
  return String(v).replace(/_/g, " ");
}

export default function AdminCatalogStatsPanel({ inventory: initialInventory, token }) {
  const [inventory, setInventory] = useState(initialInventory);
  const [syncStatus, setSyncStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

  const refreshStats = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const [statsRes, syncRes] = await Promise.all([
        fetch(apiUrl("/api/admin/catalog/stats?refresh=1&activeOnly=true"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(apiUrl("/api/admin/sync/status"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);
      const statsJson = await statsRes.json().catch(() => ({}));
      const syncJson = await syncRes.json().catch(() => ({}));
      if (statsRes.ok) setInventory(statsJson);
      if (syncRes.ok) setSyncStatus(syncJson);
    } catch {
      /* ignore */
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    refreshStats();
    const id = setInterval(refreshStats, 60_000);
    return () => clearInterval(id);
  }, [token, refreshStats]);

  const rows = inventory?.categories || [];
  const summary = inventory?.summary;

  const grouped = useMemo(() => {
    const empty = rows.filter((r) => r.productCount === 0);
    return { empty };
  }, [rows]);

  if (!inventory) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-teal-500/[0.06] p-6 shadow-[0_16px_56px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Catalogue by category</h2>
          <p className="mt-1 text-xs text-white/50">
            Live approved catalogue products (demo seed rows excluded)
          </p>
        </div>
        {summary ? (
          <motionHeaderBadges summary={summary} />
        ) : null}
        {inventory.generatedAt ? (
          <p className="w-full text-[10px] text-white/30">
            Updated {new Date(inventory.generatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>

      {token ? (
        <button
          type="button"
          onClick={refreshStats}
          disabled={refreshing}
          className="mt-3 text-xs text-neon-cyan hover:underline disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh counts"}
        </button>
      ) : null}

      {syncStatus?.running || syncStatus?.latest ? (
        <motionSyncStatus syncStatus={syncStatus} />
      ) : null}

      <motionTable rows={rows} grouped={grouped} verticalLabel={verticalLabel} />
    </section>
  );
}

function motionHeaderBadges({ summary }) {
  return (
    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
      <span className="rounded-lg border border-teal-400/40 bg-teal-500/15 px-3 py-1.5 text-teal-100">
        {summary.totalProducts} live SKUs
      </span>
      <span className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-white/60">
        {summary.withProducts}/{summary.categories} categories filled
      </span>
      {summary.emptyCategories > 0 ? (
        <span className="rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 text-amber-100">
          {summary.emptyCategories} empty
        </span>
      ) : null}
    </div>
  );
}

function motionSyncStatus({ syncStatus }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/60">
      <p className="font-semibold uppercase tracking-wider text-white/45">Catalog sync</p>
      {syncStatus.running ? (
        <p className="mt-1 text-amber-200/90">
          Running batch {syncStatus.running.batch}
          {syncStatus.running.label ? ` · ${syncStatus.running.label}` : ""}
        </p>
      ) : null}
      {syncStatus.latest && !syncStatus.running ? (
        <p className="mt-1">
          Last: batch {syncStatus.latest.batch} — {syncStatus.latest.status}
          {syncStatus.latest.summary?.productCountAfter != null
            ? ` · ${syncStatus.latest.summary.productCountAfter} products`
            : ""}
        </p>
      ) : null}
    </div>
  );
}

function motionTable({ rows, grouped, verticalLabel: vLabel }) {
  return (
    <>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-[10px] uppercase tracking-wider text-white/40">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vertical</th>
              <th className="px-4 py-3 text-right">Live products</th>
              <th className="px-4 py-3 text-right">Total (incl. pending)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-white/40">
                  No categories in database — run seed:bootstrap.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.categoryId}
                  className={`border-b border-white/[0.06] ${
                    row.productCount === 0 ? "bg-amber-500/[0.04]" : ""
                  }`}
                >
                  <td className="px-4 py-2.5">
                    <span className="text-white/90">{row.name}</span>
                    <span className="ml-2 font-mono text-[10px] text-white/30">{row.slug}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-white/45">{vLabel(row.marketplaceVertical)}</td>
                  <td
                    className={`px-4 py-2.5 text-right font-mono ${
                      row.productCount === 0 ? "text-amber-200/80" : "text-teal-200"
                    }`}
                  >
                    {row.productCount}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-white/40">{row.totalProducts}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {grouped.empty.length > 0 ? (
        <p className="mt-4 text-xs text-amber-200/70">
          Empty categories need sync:{" "}
          {grouped.empty
            .slice(0, 12)
            .map((r) => r.slug)
            .join(", ")}
          {grouped.empty.length > 12 ? "…" : ""}
        </p>
      ) : null}
    </>
  );
}
