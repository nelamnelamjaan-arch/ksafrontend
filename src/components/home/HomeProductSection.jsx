import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "../ui/ProductCard.jsx";
import ProductCardSkeleton from "./ProductCardSkeleton.jsx";
import { productPath } from "../../utils/productLink.js";
import { isJewelleryCategory } from "../../utils/productCategoryUi.js";

export default function HomeProductSection({
  title,
  subtitle,
  seeAll,
  seeAllLabel = "See all",
  products = [],
  loading = false,
  formatMoney,
  jewelleryTheme = false,
  gourmetTheme = false,
  skeletonCount = 8,
}) {
  const reduceMotion = useReducedMotion();
  const showEmpty = !loading && products.length === 0;

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neon-cyan/85">
            Shop now
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-2 max-w-xl text-sm text-white/50">{subtitle}</p> : null}
        </div>
        {seeAll ? (
          <Link
            to={seeAll}
            className="shrink-0 text-sm font-semibold text-neon-cyan transition hover:underline"
          >
            {seeAllLabel} →
          </Link>
        ) : null}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          <ProductCardSkeleton count={skeletonCount} />
        </div>
      ) : showEmpty ? (
        <div className="glass-panel rounded-2xl px-6 py-10 text-center">
          <p className="text-sm text-white/55">No listings in this aisle yet.</p>
          {seeAll ? (
            <Link to={seeAll} className="mt-3 inline-block text-sm font-medium text-neon-cyan hover:underline">
              Browse the full catalog
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((p, i) => (
            <Link key={p._id} to={productPath(p)} className="block">
              <ProductCard
                title={p.title}
                price={formatMoney(p.ksaPrice)}
                priceComparisonAvailable={p.priceComparisonAvailable}
                tag={
                  p.storeStockStatus === "in_stock"
                    ? "In stock"
                    : p.storeStockStatus
                      ? "Check stock"
                      : "Featured"
                }
                image={p.images?.[0]}
                index={i}
                lastPriceScrapedAt={p.last_price_scraped_at || p.updatedAt}
                stockStatus={p.storeStockStatus}
                stockQuantity={p.stockQuantity}
                category={p.category}
                perishable={p.isPerishable ?? p.perishable}
                vipGourmetBadge={p.vipGourmetBadge}
                gourmetTheme={gourmetTheme}
                jewelleryTheme={jewelleryTheme || isJewelleryCategory(p.category)}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
