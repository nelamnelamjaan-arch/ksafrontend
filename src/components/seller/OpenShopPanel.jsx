import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/apiUrl.js";

/**
 * @param {{ token: string; onCreated: (shop: object) => void }} props
 */
export default function OpenShopPanel({ token, onCreated }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/shops"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.message || "Could not create shop");
        return;
      }
      setOk("Shop created. Opening your dashboard…");
      onCreated(json);
      setTimeout(() => {
        navigate("/seller/dashboard", { replace: true });
      }, 700);
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-neon-violet/30 bg-gradient-to-br from-neon-violet/10 to-transparent p-6 backdrop-blur-md">
      <h2 className="font-display text-lg font-semibold text-white">Open your shop</h2>
      <p className="mt-2 text-sm text-white/55">
        Create your public storefront at <span className="text-neon-cyan">/shops/your-slug</span>{" "}
        after Super Admin has approved your seller account.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block text-xs text-white/50">
          Shop name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/50">
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white"
          />
        </label>
        {err ? <p className="text-sm text-rose-300/90">{err}</p> : null}
        {ok ? <p className="text-sm text-emerald-300/90">{ok}</p> : null}
        <button
          type="submit"
          disabled={busy || !name.trim() || Boolean(ok)}
          className="rounded-2xl border border-neon-cyan/40 bg-neon-cyan/15 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create shop"}
        </button>
      </form>
    </section>
  );
}
