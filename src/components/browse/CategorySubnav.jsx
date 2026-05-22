import { Link } from "react-router-dom";
import { categoryBrowsePath } from "../../utils/catalogBrowse.js";

export default function CategorySubnav({ parentSlug, children = [], activeSlug }) {
  if (!children.length) return null;

  return (
    <nav className="mt-4 flex flex-wrap gap-2" aria-label="Subcategories">
      {children.map((c) => {
        const to = categoryBrowsePath(c.slug, parentSlug || undefined);
        const active = activeSlug === c.slug;
        return (
          <Link
            key={c._id || c.slug}
            to={to}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan"
                : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
