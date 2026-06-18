import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/customer/Home';
import About from './pages/customer/About';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import CheckoutSuccess from './pages/customer/CheckoutSuccess';
import CheckoutVnpayReturn from './pages/customer/CheckoutVnpayReturn';
import Profile from './pages/customer/Profile';
import OrderDetails from './pages/customer/OrderDetails';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import BuildPC from './pages/customer/BuildPC';
import NewsDetails from './pages/customer/NewsDetails';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBanners from './pages/admin/AdminBanners';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminStock from './pages/admin/AdminStock';
import AdminStaffs from './pages/admin/AdminStaffs';
import AdminNews from './pages/admin/AdminNews';

// Google Client ID (đọc từ file .env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
          <AuthProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="build-pc" element={<BuildPC />} />
                    <Route path="news/:slug" element={<NewsDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="checkout/success" element={<CheckoutSuccess />} />
                    <Route path="checkout/vnpay-return" element={<CheckoutVnpayReturn />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/orders/:id" element={<OrderDetails />} />
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
                    <Route path="email" element={<div style={{ padding: '40px' }}>Tính năng Email Marketing đang phát triển</div>} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="suppliers" element={<AdminSuppliers />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="stock" element={<AdminStock />} />
                    {/* Các route tương lai sẽ thêm vào đây */}
                  </Route>
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
