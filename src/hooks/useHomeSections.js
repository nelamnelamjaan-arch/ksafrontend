import { useEffect, useState } from "react";
import { geoFetch } from "../utils/geoFetch.js";
import { parseProductsFromJson, parseProductsResponse } from "../utils/parseProductsResponse.js";

const HOME_ROW_LIMIT = 12;

export const HOME_PRODUCT_SECTIONS = [
  {
    id: "featured",
    title: "Featured picks",
    subtitle: "Hand-picked listings with live pricing",
    seeAll: "/browse",
    featured: true,
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "new-arrivals",
    title: "New arrivals",
    subtitle: "Freshly added to the global catalog",
    seeAll: "/browse",
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "best-sellers",
    title: "Popular now",
    subtitle: "Top luxury & lifestyle picks",
    seeAll: "/browse/luxury",
    query: { vertical: "luxury" },
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "electronics",
    title: "Electronics",
    subtitle: "Phones, laptops, and smart devices",
    seeAll: "/browse/electronics",
    query: { catalog_key: "electronics" },
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "fashion",
    title: "Fashion",
    subtitle: "Apparel, shoes, and accessories",
    seeAll: "/browse/fashion",
    query: { group: "fashion" },
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "essentials",
    title: "Daily essentials",
    subtitle: "Groceries, pantry, and household",
    seeAll: "/browse?catalog_key=daily_essentials",
    query: { catalog_key: "daily_essentials" },
    limit: HOME_ROW_LIMIT,
  },
  {
    id: "jewellery",
    title: "Jewellery & luxury",
    subtitle: "Gold, diamonds, and premium pieces",
    seeAll: "/c/luxury-jewellery",
    query: { catalog_key: "jewellery" },
    limit: HOME_ROW_LIMIT,
    jewelleryTheme: true,
  },
  {
    id: "gourmet",
    title: "VIP Gourmet",
    subtitle: "Curated artisan pantry & fresh essentials",
    seeAll: "/gourmet",
    query: { vertical: "gourmet_food" },
    limit: HOME_ROW_LIMIT,
    gourmetTheme: true,
  },
];

export const HOME_DEPARTMENT_SPOTLIGHT = [
  {
    id: "electronics",
    title: "Electronics",
    blurb: "Phones, laptops, and smart devices",
    browse: "/browse/electronics",
    query: { catalog_key: "electronics" },
  },
  {
    id: "essentials",
    title: "Daily essentials",
    blurb: "Groceries, produce, and household",
    browse: "/browse?catalog_key=daily_essentials",
    query: { catalog_key: "daily_essentials" },
  },
  {
    id: "fashion",
    title: "Fashion",
    blurb: "Regional style, shoes, and apparel",
    browse: "/browse/fashion",
    query: { group: "fashion" },
  },
  {
    id: "jewellery",
    title: "Jewellery",
    blurb: "Gold, diamonds, and premium gifts",
    browse: "/c/luxury-jewellery",
    query: { catalog_key: "jewellery" },
  },
];

export const HOME_QUICK_LINKS = [
  { label: "Electronics", to: "/browse/electronics" },
  { label: "Fashion", to: "/browse/fashion" },
  { label: "Daily essentials", to: "/browse?catalog_key=daily_essentials" },
  { label: "Jewellery", to: "/c/luxury-jewellery" },
  { label: "Makeup", to: "/browse?catalog_key=makeup" },
  { label: "Gourmet", to: "/gourmet" },
  { label: "Healthcare", to: "/browse/healthcare" },
  { label: "All products", to: "/browse" },
];

async function loadProductsFromApi(url) {
  const res = await geoFetch(url);
  const { products } = await parseProductsResponse(res);
  return products;
}

async function loadFeaturedProducts(limit) {
  const res = await geoFetch(`/api/products/featured?limit=${limit}`);
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  const { products } = parseProductsFromJson(data);
  return products;
}

function buildProductsUrl(query, limit) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(query || {})) {
    if (v != null && v !== "") p.set(k, String(v));
  }
  p.set("limit", String(limit));
  p.set("page", "1");
  return `/api/products?${p.toString()}`;
}

function emptySectionState() {
  const map = {};
  for (const cfg of HOME_PRODUCT_SECTIONS) {
    map[cfg.id] = { products: [], loading: true, error: null };
  }
  return map;
}

export function useHomeSections(country) {
  const [sections, setSections] = useState(emptySectionState);
  const [deptCovers, setDeptCovers] = useState(() =>
    Object.fromEntries(HOME_DEPARTMENT_SPOTLIGHT.map((d) => [d.id, { image: "", loading: true }]))
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      setSections(emptySectionState());

      const results = await Promise.all(
        HOME_PRODUCT_SECTIONS.map(async (cfg) => {
          try {
            const products = cfg.featured
              ? await loadFeaturedProducts(cfg.limit)
              : await loadProductsFromApi(buildProductsUrl(cfg.query, cfg.limit));
            return { id: cfg.id, products, loading: false, error: null };
          } catch (e) {
            return {
              id: cfg.id,
              products: [],
              loading: false,
              error: e?.message || "Failed to load",
            };
          }
        })
      );

      if (cancelled) return;
      const map = {};
      for (const r of results) map[r.id] = r;
      setSections(map);
    }

    async function loadDeptCovers() {
      const covers = await Promise.all(
        HOME_DEPARTMENT_SPOTLIGHT.map(async (dept) => {
          try {
            const rows = await loadProductsFromApi(buildProductsUrl(dept.query, 1));
            const image = rows[0]?.images?.[0] || "";
            return { id: dept.id, image, loading: false };
          } catch {
            return { id: dept.id, image: "", loading: false };
          }
        })
      );
      if (cancelled) return;
      setDeptCovers(Object.fromEntries(covers.map((c) => [c.id, c])));
    }

    loadSections();
    loadDeptCovers();

    return () => {
      cancelled = true;
    };
  }, [country]);

  return { sections, deptCovers };
}
