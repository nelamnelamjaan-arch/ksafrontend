import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { applyPageSeo, publicSiteOrigin } from "../utils/seo.js";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  useEffect(() => {
    const origin = publicSiteOrigin();
    applyPageSeo({
      title: "Order confirmed",
      description: "Your KSA Store payment was received. Track your order in account history.",
      canonical: origin ? `${origin}/checkout/success` : undefined,
      ogType: "website",
    });
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-white">Payment received</h1>
      <p className="mt-3 text-sm text-white/60">
        Thank you. Your facilitator acknowledgement and partner attribution are on file.
        {orderId ? (
          <>
            {" "}
            Order reference: <span className="font-mono text-cyan-200/90">{orderId}</span>
          </>
        ) : null}
      </p>
      <Link to="/account/orders" className="mt-8 inline-block text-sm text-neon-cyan hover:underline">
        View order history →
      </Link>
    </div>
  );
}
