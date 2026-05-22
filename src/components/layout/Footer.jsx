import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrustBadges from "../trust/TrustBadges.jsx";
import DepartmentNavLinks from "./DepartmentNavLinks.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { isKiranGrandAdmin } from "../../utils/kiranAdmin.js";
import { categoryBrowsePath } from "../../utils/catalogBrowse.js";

const FOOTER_AISLES = [
  { label: "Essentials", slug: "essentials" },
  { label: "Fresh produce", slug: "fresh-produce", parent: "essentials" },
  { label: "Healthcare", slug: "healthcare" },
  { label: "Gourmet", slug: "gourmet-food-essentials" },
  { label: "Electronics", slug: "american-electronics" },
  { label: "Jewellery", slug: "luxury-jewellery" },
  { label: "Home needs", slug: "home-needs" },
];

export default function Footer() {
  const { user } = useAuth();
  const superAdminTo = isKiranGrandAdmin(user) ? "/admin/dashboard" : "/admin/login";

  return (
    <footer className="relative z-10 border-t border-white/[0.07] bg-charcoal-950/90 py-14 backdrop-blur-md">
      <motion.div
        className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <TrustBadges className="mb-10" />

        <motion.div
          className="grid gap-10 border-t border-white/[0.06] pt-10 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">KSA Store</p>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              Premium global marketplace — curated sourcing, VIP fulfilment, and transparent
              partner retail across Saudi Arabia and beyond.
            </p>
            <DepartmentNavLinks className="mt-4" />
          </motion.div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan/80">Departments</p>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-white/50">
              {FOOTER_AISLES.map((a) => (
                <Link
                  key={`${a.parent || ""}-${a.slug}`}
                  to={categoryBrowsePath(a.slug, a.parent)}
                  className="transition hover:text-neon-cyan"
                >
                  {a.label}
                </Link>
              ))}
              <Link to="/shops" className="transition hover:text-neon-cyan">
                All seller shops
              </Link>
              <Link to="/search" className="transition hover:text-neon-cyan">
                Search
              </Link>
              <Link to="/track" className="transition hover:text-neon-cyan">
                Track shipment
              </Link>
            </nav>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan/80">Legal</p>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-white/50">
              <Link to="/about" className="transition hover:text-neon-cyan">
                About
              </Link>
              <Link to="/privacy" className="transition hover:text-neon-cyan">
                Privacy
              </Link>
              <Link to="/terms" className="transition hover:text-neon-cyan">
                Terms
              </Link>
              <Link to="/refund-policy" className="transition hover:text-neon-cyan">
                Refund policy
              </Link>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-neon-cyan/80">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-white/50">
              <a
                href="mailto:nelamnelamjaan@gmail.com"
                className="block transition hover:text-neon-cyan"
              >
                nelamnelamjaan@gmail.com
              </a>
              <p className="leading-relaxed">
                Support hub — Faisalabad, Punjab, Pakistan
                <br />
                <span className="text-white/35">Mon–Sat · 10:00–18:00 PKT</span>
              </p>
              <Link to="/contact" className="inline-block text-neon-cyan/90 transition hover:text-neon-cyan">
                Full contact page →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} KSA Store · World&apos;s luxury at your doorstep
          </p>
          <Link
            to={superAdminTo}
            className="text-xs font-medium uppercase tracking-wider text-white/30 transition hover:text-amber-200/90"
          >
            Super Admin
          </Link>
        </div>
      </motion.div>
    </footer>
  );
}
