import { Link, useLocation } from "react-router-dom";
import { STORE_DEPARTMENTS, departmentBrowsePath, categoryBrowsePath } from "../../utils/catalogBrowse.js";

const QUICK_AISLES = [
  { label: "Jewellery", slug: "luxury-jewellery" },
  { label: "Shoes", catalog_key: "shoes" },
  { label: "Makeup", catalog_key: "makeup" },
  { label: "Fresh", slug: "fresh-produce", parent: "essentials" },
];

const accentClass = {
  gold: "border-amber-400/40 text-amber-200 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
  rose: "border-pink-400/35 text-pink-200 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]",
  emerald: "border-emerald-400/35 text-emerald-200 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]",
  violet: "border-violet-400/35 text-violet-200 hover:bg-violet-500/10",
  cyan: "border-cyan-400/35 text-cyan-200 hover:bg-cyan-500/10",
};

export default function CategoryNavBar() {
  const { pathname, search } = useLocation();
  const qs = new URLSearchParams(search);

  function isActiveDept(key) {
    return pathname === `/browse/${key}`;
  }

  return (
    <nav
      className="mt-4 flex flex-col gap-3"
      aria-label="Shop by category"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STORE_DEPARTMENTS.map((d) => {
          const to = d.path || departmentBrowsePath(d.key);
          const active = d.path ? pathname === d.path : isActiveDept(d.key);
          const accent =
            d.key === "luxury" ? "gold" : d.key === "gourmet" ? "emerald" : d.key === "fashion" ? "rose" : "cyan";
          return (
            <Link
              key={d.key}
              to={to}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition ${
                accentClass[accent] || accentClass.cyan
              } ${active ? "ring-1 ring-white/30 bg-white/10" : "bg-white/[0.03]"}`}
            >
              {d.label}
            </Link>
          );
        })}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_AISLES.map((c) => {
          const to = c.slug
            ? categoryBrowsePath(c.slug, c.parent)
            : `/browse?catalog_key=${encodeURIComponent(c.catalog_key)}`;
          const active = c.catalog_key
            ? qs.get("catalog_key") === c.catalog_key
            : pathname.includes(c.slug);
          return (
            <Link
              key={c.label}
              to={to}
              className={`shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/60 transition hover:text-white ${
                active ? "bg-white/10 text-white" : ""
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
