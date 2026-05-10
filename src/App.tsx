import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import { checkApiHealth } from '@/utils/apiHealth';
import {
  // Public Pages
  HomePage,
  CategoriesPage,
  ProductsPage,
  ProductDetailPage,
  CategoryDetailPage,
  SuppliersPage,
  SupplierDetailPage,
  AboutPage,
  ContactPage,
  PricingPage,
  SellPage,
  BuyerProtectionPage,
  RFQPage,
  AdvertisingPage,
  SuccessStoriesPage,
  CareersPage,
  PressPage,
  SolutionsPage,
  BlogPage,
  HelpPage,
  FAQPage,
  TermsPage,
  PrivacyPage,
  CookiesPage,
  NotFoundPage,
  // Auth Pages
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyOTPPage,
  // Retailer Pages
  CartPage,
  CheckoutPage,
  WishlistPage,
  OrdersPage,
  ProfilePage,
  DashboardPage,
  // Dashboard Pages
  RetailerDashboardPage,
  RetailerOrderDetailPage,
  RetailerSettingsPage,
  RetailerNotificationsPage,
  // Supplier Pages
  SupplierDashboardPage,
  SupplierProductsPage,
  SupplierAddProductPage,
  SupplierOrderDetailPage,
  SupplierAnalyticsPage,
  SupplierSettingsPage,
  SupplierNotificationsPage,
  // Admin Pages
  AdminDashboardPage,
  AdminUsersPage,
  AdminProductsPage,
  AdminOrdersPage,
  AdminCategoriesPage,
  AdminRolesPage,
  AdminPaymentsPage,
  AdminReviewsPage,
  AdminSettingsPage,
  // Developer Pages
  ApiTestPage,
} from '@/pages';
import { useAuthStore } from '@/stores/authStore';
import { usePermission } from '@/hooks/usePermission';
import './styles/globals.css';

// ─── Loading Spinner shown during auth initialisation ────────
const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
    <p className="mt-4 text-sm text-text-muted animate-pulse">Loading…</p>
  </div>
);

// ─── Protected Route — Requires Authentication ───────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();

  if (!isInitialized) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ─── Seller Route — Requires Seller role (Supplier or Company) ─
const SellerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const { isSeller, isAdmin } = usePermission();
  const location = useLocation();

  if (!isInitialized) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins can access seller dashboards too
  if (!isSeller && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ─── Buyer Route — Requires Buyer role (Retailer) ────────────
const BuyerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const { isBuyer, isAdmin } = usePermission();
  const location = useLocation();

  if (!isInitialized) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admins can access buyer dashboards too
  if (!isBuyer && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ─── Admin Route — Requires Admin Role ───────────────────────
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const { isAdmin, hasRole } = usePermission();
  const location = useLocation();

  if (!isInitialized) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has Admin or Manager role
  if (!isAdmin && !hasRole('Manager')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ─── Auth Wrapper — Bootstraps auth on app load ──────────────
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Run health check once on app startup
  useEffect(() => {
    if (isInitialized) {
      checkApiHealth().catch((err) => {
        console.error('[App] Health check failed:', err);
      });
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0F2C38',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<Layout />}>
            {/* Home & Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
            
            {/* Information Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/buyer-protection" element={<BuyerProtectionPage />} />
            <Route path="/rfq" element={<RFQPage />} />
            <Route path="/advertising" element={<AdvertisingPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            
            {/* Cart & Checkout */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            
            {/* User Account Routes */}
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            
            {/* Retailer Dashboard Routes — guarded by BuyerRoute */}
            <Route path="/dashboard/retailer" element={<BuyerRoute><RetailerDashboardPage /></BuyerRoute>} />
            <Route path="/dashboard/retailer/orders" element={<BuyerRoute><OrdersPage /></BuyerRoute>} />
            <Route path="/dashboard/retailer/orders/:id" element={<BuyerRoute><RetailerOrderDetailPage /></BuyerRoute>} />
            <Route path="/dashboard/retailer/settings" element={<BuyerRoute><RetailerSettingsPage /></BuyerRoute>} />
            <Route path="/dashboard/retailer/notifications" element={<BuyerRoute><RetailerNotificationsPage /></BuyerRoute>} />
            
            {/* Supplier Dashboard Routes — guarded by SellerRoute */}
            <Route path="/dashboard/supplier" element={<SellerRoute><SupplierDashboardPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/products" element={<SellerRoute><SupplierProductsPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/products/add" element={<SellerRoute><SupplierAddProductPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/products/:id/edit" element={<SellerRoute><SupplierAddProductPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/orders" element={<SellerRoute><OrdersPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/orders/:id" element={<SellerRoute><SupplierOrderDetailPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/analytics" element={<SellerRoute><SupplierAnalyticsPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/settings" element={<SellerRoute><SupplierSettingsPage /></SellerRoute>} />
            <Route path="/dashboard/supplier/notifications" element={<SellerRoute><SupplierNotificationsPage /></SellerRoute>} />
          </Route>

          {/* Admin Routes (with AdminLayout) */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/roles" element={<AdminRolesPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Auth Routes (without layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />

          {/* Developer Routes (Testing) */}
          {import.meta.env.DEV && (
            <Route path="/dev/api-tests" element={<ApiTestPage />} />
          )}

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  );
}

export default App;
