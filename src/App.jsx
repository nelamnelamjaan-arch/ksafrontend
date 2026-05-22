import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { isKiranGrandAdmin } from "./utils/kiranAdmin.js";
import { StorefrontProvider } from "./context/StorefrontContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import CarrierTrackPage from "./pages/CarrierTrackPage.jsx";
import RefundPolicyPage from "./pages/RefundPolicyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ShopsPage from "./pages/ShopsPage.jsx";
import GourmetPage from "./pages/GourmetPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ConciergePage from "./pages/ConciergePage.jsx";
import FamilyNeedsPage from "./pages/FamilyNeedsPage.jsx";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage.jsx";
import CheckoutCancelPage from "./pages/CheckoutCancelPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import CookieConsent from "./components/legal/CookieConsent.jsx";

import AdminLoginPage from "./pages/AdminLoginPage.jsx";
const AdminCachePage = lazy(() => import("./pages/AdminCachePage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const AdminStripePayoutPage = lazy(() => import("./pages/AdminStripePayoutPage.jsx"));
const MagicImportPage = lazy(() => import("./pages/MagicImportPage.jsx"));
const SellerLoginPage = lazy(() => import("./pages/SellerLoginPage.jsx"));
const SellerRegisterPage = lazy(() => import("./pages/SellerRegisterPage.jsx"));
const SellerDashboardPage = lazy(() => import("./pages/SellerDashboardPage.jsx"));
const SellerShopPage = lazy(() => import("./pages/SellerShopPage.jsx"));

function RouteSuspense({ children, label = "Loading…" }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-charcoal-950 px-4">
          <p className="text-base font-medium text-white/80">{label}</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function AdminIndexRedirect() {
  const { token, user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm text-white/60">Loading…</p>
      </div>
    );
  }
  if (token && isKiranGrandAdmin(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/admin/login" replace />;
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-sm text-white/50">This URL is not on KSA Store.</p>
      <a href="/" className="mt-8 inline-block text-sm text-neon-cyan hover:underline">
        ← Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <StorefrontProvider>
      <CookieConsent />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="track" element={<CarrierTrackPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="track-order/:id" element={<TrackOrderPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="browse/:department" element={<BrowsePage />} />
          <Route path="c/:slug" element={<BrowsePage />} />
          <Route path="c/:parentSlug/:childSlug" element={<BrowsePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="shops" element={<ShopsPage />} />
          <Route path="gourmet" element={<GourmetPage />} />
          <Route path="concierge" element={<ConciergePage />} />
          <Route path="family" element={<FamilyNeedsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="account/orders" element={<OrdersPage />} />
          <Route path="admin" element={<AdminIndexRedirect />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route
            path="admin/cache"
            element={
              <RouteSuspense label="Loading admin…">
                <AdminCachePage />
              </RouteSuspense>
            }
          />
          <Route
            path="admin/dashboard"
            element={
              <RouteSuspense>
                <AdminDashboardPage />
              </RouteSuspense>
            }
          />
          <Route
            path="admin/stripe-payout"
            element={
              <RouteSuspense>
                <AdminStripePayoutPage />
              </RouteSuspense>
            }
          />
          <Route
            path="admin/magic-import"
            element={
              <RouteSuspense>
                <MagicImportPage />
              </RouteSuspense>
            }
          />
          <Route
            path="seller/register"
            element={
              <RouteSuspense>
                <SellerRegisterPage />
              </RouteSuspense>
            }
          />
          <Route
            path="seller/login"
            element={
              <RouteSuspense>
                <SellerLoginPage />
              </RouteSuspense>
            }
          />
          <Route
            path="seller/dashboard"
            element={
              <RouteSuspense>
                <SellerDashboardPage />
              </RouteSuspense>
            }
          />
          <Route
            path="shops/:slug"
            element={
              <RouteSuspense label="Loading shop…">
                <SellerShopPage />
              </RouteSuspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </StorefrontProvider>
  );
}
