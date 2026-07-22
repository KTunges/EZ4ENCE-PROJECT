import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { WishlistProvider } from './context/WishlistContext';
import { useEffect, lazy, Suspense } from 'react';
import PageSkeleton from './components/ui/PageSkeleton';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './components/layout/MainLayout';
const Home = lazy(() => import('./pages/customer/Home'));
const About = lazy(() => import('./pages/customer/About'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/customer/CheckoutSuccess'));
const CheckoutVnpayReturn = lazy(() => import('./pages/customer/CheckoutVnpayReturn'));
const CheckoutMomoReturn = lazy(() => import('./pages/customer/CheckoutMomoReturn'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const OrderDetails = lazy(() => import('./pages/customer/OrderDetails'));
const Login = lazy(() => import('./pages/customer/Login'));
const Register = lazy(() => import('./pages/customer/Register'));
const Products = lazy(() => import('./pages/customer/Products'));
const ProductDetail = lazy(() => import('./pages/customer/ProductDetail'));
const BuildPC = lazy(() => import('./pages/customer/BuildPC'));
const NewsDetails = lazy(() => import('./pages/customer/NewsDetails'));
const PolicyPage = lazy(() => import('./pages/customer/PolicyPage'));
const NotFound = lazy(() => import('./pages/customer/NotFound'));
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'));
const AdminOrderForm = lazy(() => import('./pages/admin/AdminOrderForm'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminSuppliers = lazy(() => import('./pages/admin/AdminSuppliers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminReceipts = lazy(() => import('./pages/admin/AdminReceipts'));
const AdminStaffs = lazy(() => import('./pages/admin/AdminStaffs'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminFlashSales = lazy(() => import('./pages/admin/AdminFlashSales'));
const AdminMailchimp = lazy(() => import('./pages/admin/AdminMailchimp'));
const AdminChat = lazy(() => import('./pages/admin/AdminChat'));

// Google Client ID (đọc từ file .env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<PageSkeleton variant="home" />}>
                    <Routes>
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:slug" element={<ProductDetail />} />
                        <Route path="policy/:slug" element={<PolicyPage />} />
                        <Route path="build-pc" element={<BuildPC />} />
                        <Route path="news/:slug" element={<NewsDetails />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="checkout/success" element={<CheckoutSuccess />} />
                        <Route path="checkout/vnpay-return" element={<CheckoutVnpayReturn />} />
                        <Route path="checkout/momo-return" element={<CheckoutMomoReturn />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="profile/orders/:id" element={<OrderDetails />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/ez4-portal-auth" element={<AdminLogin />} />
                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminLayout />
                        </AdminRoute>
                      }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="orders/create" element={<AdminOrderForm />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/edit/:id" element={<AdminProductForm />} />
                        <Route path="orders/:id" element={<AdminOrderDetails />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="brands" element={<AdminBrands />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="staffs" element={<AdminStaffs />} />
                        <Route path="banners" element={<AdminBanners />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="email" element={<AdminMailchimp />} />
                        <Route path="chat" element={<AdminChat />} />
                        <Route path="news" element={<AdminNews />} />
                        <Route path="suppliers" element={<AdminSuppliers />} />
                        <Route path="flash-sales" element={<AdminFlashSales />} />
                        <Route path="inventory" element={<AdminInventory />} />
                        <Route path="receipts" element={<AdminReceipts />} />
                        {/* Các route tương lai sẽ thêm vào đây */}
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
                  </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
