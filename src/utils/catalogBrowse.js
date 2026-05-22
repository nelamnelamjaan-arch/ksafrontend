/** Major department hubs (top navigation). */
export const STORE_DEPARTMENTS = [
  {
    key: "electronics",
    label: "Electronics",
    description: "Phones, laptops, and smart devices",
    query: { catalog_key: "electronics" },
  },
  {
    key: "gourmet",
    label: "Gourmet",
    description: "Artisan food & premium pantry",
    path: "/gourmet",
  },
  {
    key: "fashion",
    label: "Fashion",
    description: "Shoes, apparel, and regional style",
    query: { group: "fashion" },
  },
  {
    key: "essentials",
    label: "Essentials",
    description: "Groceries, produce, and daily needs",
    query: { vertical: "essentials" },
  },
  {
    key: "food-drink",
    label: "Food & Drink",
    description: "Fast food, desi cuisine, and beverages",
    path: "/c/food-drink",
  },
  {
    key: "healthcare",
    label: "Healthcare",
    description: "Pharmacy and wellness",
    query: { vertical: "healthcare" },
  },
  {
    key: "luxury",
    label: "Luxury",
    description: "Jewellery, beauty, and premium brands",
    query: { vertical: "luxury" },
  },
];

export const BROWSE_PAGE_SIZE = 48;

export function departmentBrowsePath(key) {
  const dept = STORE_DEPARTMENTS.find((d) => d.key === key);
  if (!dept) return "/browse";
  if (dept.path) return dept.path;
  return `/browse/${dept.key}`;
}

export function categoryBrowsePath(slug, parentSlug) {
  if (parentSlug) return `/c/${encodeURIComponent(parentSlug)}/${encodeURIComponent(slug)}`;
  return `/c/${encodeURIComponent(slug)}`;
}

/** Build query object for /api/products from department key or explicit query. */
export function departmentProductQuery(key) {
  const dept = STORE_DEPARTMENTS.find((d) => d.key === key);
  return dept?.query ? { ...dept.query } : {};
}

export function buildProductsQueryString(params) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function parseDepartmentFromPath(pathname) {
  const m = String(pathname || "").match(/^\/browse\/([a-z0-9-]+)\/?$/i);
  return m ? m[1].toLowerCase() : null;
}
