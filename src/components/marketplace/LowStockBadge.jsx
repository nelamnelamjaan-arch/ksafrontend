import LowStockUrgencyBadge from "./LowStockUrgencyBadge.jsx";

/**
 * Low-stock FOMO badge — accepts `stock` or `qty` (partner/scraped quantity).
 */
export default function LowStockBadge({ stock, qty }) {
  const n = qty ?? stock;
  return <LowStockUrgencyBadge qty={n} />;
}
