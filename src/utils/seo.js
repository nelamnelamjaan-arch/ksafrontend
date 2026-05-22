import { useEffect } from "react";

/** Default SEO copy — override via VITE_SEO_* in root `.env`. */
export const SEO_DEFAULTS = {
  siteName: import.meta.env.VITE_SEO_SITE_NAME || "KSA Store",
  title:
    import.meta.env.VITE_SEO_DEFAULT_TITLE ||
    "KSA Store — Premium Online Shopping in Saudi Arabia",
  description:
    import.meta.env.VITE_SEO_DEFAULT_DESCRIPTION ||
    "Shop groceries, pharmacy, jewellery, gourmet imports & global brands with fast delivery across Riyadh, Jeddah, Dammam & KSA. Authentic products, secure checkout.",
  keywords:
    import.meta.env.VITE_SEO_KEYWORDS ||
    "KSA Store, Saudi Arabia online shopping, Riyadh delivery, Jeddah ecommerce, grocery delivery KSA, pharmacy online Saudi, imported products, dropship Saudi",
  ogImage: import.meta.env.VITE_SEO_OG_IMAGE || "/favicon.svg",
};

/** Per-page H1/heading hints — optional JSON in VITE_SEO_HEADINGS. */
export function getSeoHeading(pageKey, fallback = "") {
  try {
    const raw = import.meta.env.VITE_SEO_HEADINGS;
    if (!raw) return fallback;
    const map = typeof raw === "string" ? JSON.parse(raw) : raw;
    return map?.[pageKey] || fallback;
  } catch {
    return fallback;
  }
}

export function publicSiteOrigin() {
  const env = import.meta.env.VITE_PUBLIC_SITE_URL;
  if (env) return String(env).replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/** Resolve relative OG image paths to absolute URLs for crawlers. */
export function absoluteOgImage(pathOrUrl) {
  const raw = pathOrUrl || SEO_DEFAULTS.ogImage;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const origin = publicSiteOrigin();
  if (!origin) return raw;
  return `${origin}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function upsertMeta(attr, key, content) {
  if (!content) return;
  let node = document.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

/**
 * Sets document title + core meta tags for SPA routes (no react-helmet dependency).
 * @param {{ title?: string, description?: string, keywords?: string, ogImage?: string, ogType?: string, canonical?: string }} opts
 */
export function applyPageSeo(opts = {}) {
  const title = opts.title || SEO_DEFAULTS.title;
  const description = (opts.description || SEO_DEFAULTS.description).slice(0, 170);
  const keywords = (opts.keywords || SEO_DEFAULTS.keywords).slice(0, 500);
  const ogImage = absoluteOgImage(opts.ogImage || SEO_DEFAULTS.ogImage);
  const site = SEO_DEFAULTS.siteName;

  document.title = title.includes(site) ? title : `${title} | ${site}`;

  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords);
  upsertMeta("property", "og:type", opts.ogType || "website");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:site_name", site);
  if (ogImage) upsertMeta("property", "og:image", ogImage);
  upsertMeta("name", "twitter:card", ogImage ? "summary_large_image" : "summary");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  if (ogImage) upsertMeta("name", "twitter:image", ogImage);

  if (opts.canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", opts.canonical);
  }
}

/**
 * React hook — restores previous title on unmount.
 */
export function usePageSeo(opts) {
  useEffect(() => {
    const prevTitle = document.title;
    applyPageSeo(typeof opts === "function" ? opts() : opts);
    return () => {
      document.title = prevTitle;
    };
  }, [opts]);
}
