import { useEffect, useState } from "react";
import { apiUrl } from "../../utils/apiUrl.js";

function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Flash sale timer — only when PlatformSettings.flashSaleEndsAt is set server-side. */
export default function FlashSaleCountdown({ className = "" }) {
  const [deadline, setDeadline] = useState(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/storefront/social-proof"));
        const data = await res.json().catch(() => ({}));
        if (cancelled || !res.ok || !data.flashSaleEndsAt) return;
        const end = new Date(data.flashSaleEndsAt).getTime();
        if (Number.isFinite(end) && end > Date.now()) {
          setDeadline(end);
          setRemaining(end - Date.now());
        }
      } catch {
        /* no countdown */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (deadline == null) return undefined;
    const id = setInterval(() => {
      setRemaining(deadline - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (deadline == null || remaining <= 0) return null;

  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-100 ${className}`}
      role="timer"
    >
      <span className="font-bold uppercase tracking-[0.2em] text-amber-300">Flash sale ends in</span>
      <span className="font-mono text-lg font-semibold text-white">{formatRemaining(remaining)}</span>
    </div>
  );
}
