const SOURCE_META = {
  amazon: { label: "KSA Store", className: "from-amber-500/90 to-orange-600/90" },
  walmart: { label: "KSA Store", className: "from-blue-600/90 to-blue-800/90" },
  ebay: { label: "KSA Store", className: "from-red-500/90 to-yellow-500/90" },
  noon: { label: "KSA Store", className: "from-yellow-400/90 to-amber-500/90" },
  aliexpress: { label: "KSA Store", className: "from-orange-500/90 to-red-600/90" },
  daraz: { label: "Daraz", className: "from-orange-600/90 to-pink-600/90" },
  zalando: { label: "Zalando", className: "from-neutral-600/90 to-neutral-800/90" },
  flipkart: { label: "Flipkart", className: "from-blue-500/90 to-indigo-700/90" },
  otto: { label: "Otto", className: "from-red-600/90 to-red-800/90" },
  etsy: { label: "Etsy", className: "from-orange-500/80 to-rose-600/80" },
  generic: { label: "KSA Store", className: "from-neon-cyan/80 to-neon-violet/80" },
};

export function sourceMeta(sourceType) {
  return SOURCE_META.generic;
}

function resolveLabel(_sourcePlatform, _sourceType) {
  return "KSA Store";
}

/** Storefront partner badge — always KSA Store (supplier metadata is admin-only). */
export default function SourceBadge({
  sourceType,
  sourcePlatform,
  originCountry,
  className = "",
}) {
  const label = resolveLabel(sourcePlatform, sourceType);
  const meta = sourceMeta(sourceType);

  return (
    <span
      className={`inline-flex max-w-[9.5rem] items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-lg backdrop-blur-xl ${className}`}
      title={`${label}${originCountry ? ` · ${originCountry}` : ""}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${meta.className}`}
        aria-hidden
      />
      <span className="truncate">
        <span className="font-bold">{label}</span>
      </span>
      {originCountry ? (
        <span className="shrink-0 rounded bg-white/10 px-1 font-mono text-[8px] text-white/70">
          {originCountry}
        </span>
      ) : null}
    </span>
  );
}
