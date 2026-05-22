import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import LogoKSA from "../brand/LogoKSA.jsx";
import CountrySwitcher from "./CountrySwitcher.jsx";
import LocationBadge from "./LocationBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { isKiranGrandAdmin } from "../../utils/kiranAdmin.js";
import { isOpenShopEnabled } from "../../utils/openShop.js";
import { apiUrl } from "../../utils/apiUrl.js";
import { STORE_DEPARTMENTS, departmentBrowsePath } from "../../utils/catalogBrowse.js";

const navLinks = [
  { label: "Home", to: "/" },
  ...STORE_DEPARTMENTS.map((d) => ({
    label: d.label,
    to: d.path || departmentBrowsePath(d.key),
    accent:
      d.key === "gourmet" ? "gourmet" : d.key === "luxury" ? "gold" : d.key === "fashion" ? "rose" : undefined,
  })),
  { label: "Shops", to: "/shops" },
  ...(isOpenShopEnabled() ? [{ label: "Sell", to: "/seller/login" }] : []),
  { label: "Track", to: "/track" },
  { label: "Concierge", to: "/concierge" },
];

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { user, setToken, logout, loading } = useAuth();

  function submitSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  }

  const isAdmin = isKiranGrandAdmin(user);
  const superAdminTo = isAdmin ? "/admin/dashboard" : "/admin/login";
  const adminLinks = isAdmin
    ? [
        { label: "Super Admin", to: "/admin/dashboard", accent: "admin" },
        { label: "Product import", to: "/admin/magic-import" },
        { label: "Stripe payout", to: "/admin/stripe-payout" },
        { label: "Admin cache", to: "/admin/cache" },
      ]
    : [];
  const accountLinks = user
    ? [
        { label: "My orders", to: "/account/orders" },
        { label: "Family Needs", to: "/family" },
        { label: "Checkout", to: "/checkout" },
      ]
    : [];
  const allNavLinks = [...navLinks, ...accountLinks, ...adminLinks];

  async function onGoogleSuccess(credentialResponse) {
    const credential = credentialResponse.credential;
    if (!credential) return;
    try {
      const res = await fetch(apiUrl("/api/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn(data.message || "Google sign-in failed");
        return;
      }
      setToken(data.token);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-4 py-3.5 sm:gap-5 sm:px-6 lg:px-10">
        <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="KSA Store home">
          <LogoKSA size={44} className="shrink-0 transition group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,0.45)]" />
          <div className="leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              KSA{" "}
              <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">
                Store
              </span>
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40 sm:block">
              Private marketplace
            </span>
          </div>
        </Link>

        <div className="order-last flex w-full flex-1 basis-full items-center gap-3 md:order-none md:mx-4 md:max-w-xl md:basis-auto lg:max-w-2xl">
          <form className="group relative w-full" role="search" onSubmit={submitSearch}>
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-neon-cyan/25 via-neon-violet/20 to-neon-fuchsia/25 opacity-0 blur-md transition duration-500 group-focus-within:opacity-100"
              aria-hidden
            />
            <div className="relative flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.06] px-3 py-2 shadow-glass backdrop-blur-2xl sm:px-4 sm:py-2.5">
              <svg
                className="h-5 w-5 shrink-0 text-neon-cyan/90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Global search — brands, products, sellers…"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/35 outline-none sm:text-[15px]"
                aria-label="Global marketplace search"
              />
              <span className="hidden shrink-0 rounded-lg border border-white/10 bg-charcoal-900/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/35 sm:inline">
                ⌘K
              </span>
            </div>
          </form>
        </div>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {allNavLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition hover:bg-white/[0.05] ${
                  link.accent === "gourmet"
                    ? "text-emerald-300/90 hover:text-amber-200"
                    : link.accent === "gold"
                      ? "text-amber-200/90 hover:text-amber-100"
                      :                   link.accent === "rose"
                        ? "text-pink-200/90 hover:text-pink-100"
                        : link.accent === "admin"
                          ? "text-amber-200/90 hover:text-amber-100"
                          : "text-white/55 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LocationBadge />
          <CountrySwitcher />
          {loading && !user ? (
            <span className="hidden text-xs text-white/40 sm:inline">…</span>
          ) : user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-[140px] truncate text-xs text-white/60" title={user.email}>
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/85 transition hover:bg-white/[0.09]"
              >
                Sign out
              </button>
            </div>
          ) : googleClientId ? (
            <div className="hidden sm:block [&>div]:!flex">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => console.warn("Google login error")}
                useOneTap={false}
                theme="filled_black"
                size="medium"
                text="signin_with"
                shape="pill"
                locale="en"
              />
            </div>
          ) : (
            <span className="hidden max-w-[120px] text-[10px] text-amber-200/80 sm:block">
              Set VITE_GOOGLE_CLIENT_ID
            </span>
          )}

          <Link
            to={superAdminTo}
            className="hidden rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.15)] transition hover:border-amber-300/55 hover:bg-amber-500/15 sm:inline-flex"
            title={isAdmin ? "Super Admin dashboard" : "Super Admin sign in (Kiran)"}
          >
            Super Admin
          </Link>

          <Link
            to={isOpenShopEnabled() ? "/seller/login" : "/shops"}
            className="rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-4 py-2 text-sm font-bold tracking-tight text-charcoal-950 shadow-lg shadow-neon-cyan/25 transition hover:brightness-110 sm:px-5"
            title={isOpenShopEnabled() ? "Open shop seller flow" : "Open Shop is disabled"}
          >
            Open a shop
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`h-0.5 w-5 rounded-full bg-white/70 ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-0.5 w-5 origin-center rounded-full bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/[0.08] bg-charcoal-900/95 px-4 py-5 backdrop-blur-2xl lg:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                to={superAdminTo}
                className="block rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-3 font-semibold text-amber-100"
                onClick={() => setOpen(false)}
              >
                Super Admin
              </Link>
            </li>
            {allNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="block rounded-xl px-3 py-3 text-white/75"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-white/10 pt-4">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-white/85"
              >
                Sign out
              </button>
            ) : googleClientId ? (
              <div className="flex justify-center [&>div]:!flex">
                <GoogleLogin
                  onSuccess={async (cr) => {
                    await onGoogleSuccess(cr);
                    setOpen(false);
                  }}
                  onError={() => {}}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="pill"
                />
              </div>
            ) : (
              <p className="text-center text-xs text-white/50">Configure Google OAuth in .env</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
