import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/apiUrl.js";
import { isOpenShopEnabled } from "../utils/openShop.js";

export default function SellerRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", name: "", username: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  if (!isOpenShopEnabled()) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-white/60">
        Seller registration is disabled on this deployment.
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/auth/seller-register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.message || "Registration failed");
        return;
      }
      setOk(data.message || "Account created — wait for admin approval, then sign in.");
      setTimeout(() => navigate("/seller/login", { replace: true }), 2500);
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <Link to="/" className="text-sm text-neon-cyan hover:underline">
        ← Home
      </Link>
      <div className="mt-8 rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.09] to-violet-500/[0.04] p-8 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <h1 className="font-display text-2xl font-bold text-white">Become a seller</h1>
        <p className="mt-2 text-sm text-white/55">
          Register for Open Shop. Super Admin approves your account before you can open a storefront.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {["email", "name", "username"].map((key) => (
            <label key={key} className="block text-xs text-white/50 capitalize">
              {key}
              <input
                type={key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required
                autoComplete={key === "email" ? "email" : key === "username" ? "username" : "name"}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
              />
            </label>
          ))}
          <label className="block text-xs text-white/50">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
            />
          </label>
          {err ? <p className="text-sm text-rose-300/90">{err}</p> : null}
          {ok ? <p className="text-sm text-teal-200/90">{ok}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl border border-neon-violet/50 bg-gradient-to-r from-neon-violet/30 to-neon-cyan/20 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? "Registering…" : "Register as seller"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-white/40">
          Already approved?{" "}
          <Link to="/seller/login" className="text-neon-cyan hover:underline">
            Seller login
          </Link>
        </p>
      </div>
    </div>
  );
}
