/**
 * Blinking low-stock badge when stock < 5.
 */
export default function StockUrgencyBlinkBadge({ stock }) {
  const n = Number(stock);
  if (!Number.isFinite(n) || n >= 5) return null;

  return (
    <p
      className="ksa-stock-urgency-blink mt-2 inline-flex max-w-full items-center gap-2 rounded-xl border border-rose-400/50 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
      role="status"
    >
      <span aria-hidden>🔥</span>
      Only {n} left in stock! Order before it&apos;s gone!
    </p>
  );
}
