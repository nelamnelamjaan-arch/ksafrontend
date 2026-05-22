import { useState } from "react";
import { apiUrl } from "../../utils/apiUrl.js";

/**
 * @param {{ token: string; onCreated?: () => void }} props
 */
export default function SellerManualProductForm({ token, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ksaPrice, setKsaPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/seller/products"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          ksaPrice: Number(ksaPrice),
          imageUrl: imageUrl.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.message || "Could not add product");
        return;
      }
      setMsg(json.message || "Product submitted for approval");
      setTitle("");
      setDescription("");
      setKsaPrice("");
      setImageUrl("");
      onCreated?.();
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">Add product manually</h2>
      <p className="mt-1 text-xs text-white/40">Quick listing without URL import — pending admin approval.</p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-white/50 sm:col-span-2">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/50">
          Price (SAR)
          <input
            type="number"
            min="0"
            step="0.01"
            value={ksaPrice}
            onChange={(e) => setKsaPrice(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/50">
          Image URL (optional)
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block text-xs text-white/50 sm:col-span-2">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </label>
        {err ? (
          <p className="text-sm text-rose-300/90 sm:col-span-2">{err}</p>
        ) : null}
        {msg ? (
          <p className="text-sm text-teal-200/90 sm:col-span-2">{msg}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2 sm:w-fit"
        >
          {busy ? "Submitting…" : "Submit for approval"}
        </button>
      </form>
    </section>
  );
}
