import { useEffect, useState } from "react";
import { apiUrl } from "../../utils/apiUrl.js";

/**
 * Social-proof toast from paid orders (last 24h) — city only, no PII.
 */
export default function RecentPurchaseToast({ intervalMs = 28_000 }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/storefront/social-proof"));
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok) setProof(data);
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!proof?.lastPurchaseCity) return undefined;

    const show = () => {
      const city = proof.lastPurchaseCity;
      const count = Number(proof.recentOrdersLast24h) || 0;
      const suffix =
        count > 1 ? ` · ${count} orders in the last 24 hours` : "";
      setMessage(`Someone from ${city} purchased recently${suffix}`);
      setVisible(true);
      setTimeout(() => setVisible(false), 5200);
    };

    const first = setTimeout(show, 6000);
    const id = setInterval(show, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [proof, intervalMs]);

  if (!visible || !message) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-4 z-50 max-w-xs rounded-2xl border border-white/15 bg-charcoal-950/90 px-4 py-3 text-sm text-white shadow-neon-strong backdrop-blur-xl sm:left-6"
      role="status"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neon-cyan/90">
        Recent order
      </p>
      <p className="mt-1 text-white/85">{message}</p>
    </div>
  );
}
