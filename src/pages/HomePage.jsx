import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import CategoryNavBar from "../components/layout/CategoryNavBar.jsx";
import HomeProductSection from "../components/home/HomeProductSection.jsx";
import { useStorefront } from "../context/StorefrontContext.jsx";
import ShoppableReels from "../components/reels/ShoppableReels.jsx";
import { applyPageSeo, publicSiteOrigin, SEO_DEFAULTS } from "../utils/seo.js";
import {
  HOME_PRODUCT_SECTIONS,
  HOME_DEPARTMENT_SPOTLIGHT,
  HOME_QUICK_LINKS,
  useHomeSections,
} from "../hooks/useHomeSections.js";

const HERO_POSTER =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&w=1920&q=85";
const HERO_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-hallway-of-an-elegant-empty-building-with-chandeliers-4048-large.mp4";

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const { format: formatMoney, hero, country } = useStorefront();
  const { sections, deptCovers } = useHomeSections(country);

  useEffect(() => {
    const origin = publicSiteOrigin();
    applyPageSeo({
      title: SEO_DEFAULTS.title,
      description: SEO_DEFAULTS.description,
      keywords: SEO_DEFAULTS.keywords,
      canonical: origin ? `${origin}/` : undefined,
    });
  }, []);

  return (
    <>
      <HeroSection reduceMotion={reduceMotion} hero={hero} />

      <section className="relative z-10 border-b border-white/[0.06] bg-charcoal-925/60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Shop by aisle
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {HOME_QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 transition hover:border-neon-cyan/30 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ShoppableReels />

      <DepartmentSpotlight reduceMotion={reduceMotion} deptCovers={deptCovers} />

      <section className="relative z-10 mx-auto max-w-7xl border-b border-white/[0.06] px-4 py-10 sm:px-6 lg:px-8">
        <CategoryNavBar />
      </section>

      {HOME_PRODUCT_SECTIONS.map((cfg) => {
        const row = sections[cfg.id] || { products: [], loading: true };
        return (
          <HomeProductSection
            key={cfg.id}
            title={cfg.title}
            subtitle={cfg.subtitle}
            seeAll={cfg.seeAll}
            products={row.products}
            loading={row.loading}
            formatMoney={formatMoney}
            jewelleryTheme={cfg.jewelleryTheme}
            gourmetTheme={cfg.gourmetTheme}
            skeletonCount={8}
          />
        );
      })}
    </>
  );
}

function HeroSection({ reduceMotion, hero }) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative -mt-[1px] min-h-[min(72vh,780px)] overflow-hidden border-b border-white/[0.06]">
      <div className="absolute inset-0 bg-charcoal-950">
        {!videoFailed && !reduceMotion && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_POSTER}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        {(videoFailed || reduceMotion) && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_POSTER})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-charcoal-950/75 to-charcoal-950" />
        <div className="absolute inset-0 bg-vip-glow opacity-90" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(72vh,780px)] max-w-5xl flex-col justify-center px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8 lg:pt-32">
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              })}
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_14px_#00e5ff]" />
            {hero?.badge || "KSA Store · Live catalog"}
          </p>

          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            {hero?.title || "World's Luxury"}
            <br />
            <span className="text-gradient-vip">{hero?.titleAccent || "at Your Doorstep"}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {hero?.subtitle ||
              "Browse thousands of real listings — electronics, fashion, essentials, and jewellery with live SAR pricing."}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/browse"
              className="rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet px-8 py-3 text-sm font-semibold text-charcoal-950 shadow-neon-strong transition hover:opacity-95"
            >
              Shop all products
            </Link>
            <Link
              to="/browse/electronics"
              className="rounded-full border border-white/20 bg-white/[0.06] px-8 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
            >
              Electronics
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DepartmentSpotlight({ reduceMotion, deptCovers }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl border-b border-white/[0.06] px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="mb-10 text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-violet/90">
          Departments
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
          Shop by <span className="text-gradient-vip">category</span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOME_DEPARTMENT_SPOTLIGHT.map((cat, i) => {
          const cover = deptCovers[cat.id];
          const image = cover?.image;
          const loadingCover = cover?.loading;

          return (
            <motion.div
              key={cat.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={cat.browse}
                className="group glass-panel block overflow-hidden rounded-2xl transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-900">
                  {loadingCover ? (
                    <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
                  ) : image ? (
                    <img
                      src={image}
                      alt={cat.title}
                      className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-charcoal-900 to-navy-950 text-xs text-white/35">
                      Explore {cat.title}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{cat.title}</h3>
                  <p className="mt-2 text-sm text-white/50">{cat.blurb}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-neon-cyan">
                    Shop now →
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
