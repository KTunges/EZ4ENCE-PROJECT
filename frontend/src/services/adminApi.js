import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = VITE_API_URL.endsWith('/api') ? VITE_API_URL : `${VITE_API_URL}/api`;

const adminApi = axios.create({
  baseURL: API_URL,
});

// Interceptor để tự động gắn token vào header
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- PRODUCTS ---
export const getAdminProducts = async (params) => {
  // Tái sử dụng API GET /products có sẵn nhưng có thể dùng thêm param nếu cần
  const response = await adminApi.get('/products', { params });
  return response.data.data || response.data;
};

export const uploadAdminImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await adminApi.post('/admin/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.url;
};

export const createProduct = async (productData) => {
  const response = await adminApi.post('/admin/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await adminApi.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await adminApi.delete(`/admin/products/${id}`);
  return response.data;
};

// --- ORDERS ---
export const getAdminProductById = async (id) => {
  const response = await adminApi.get(`/admin/products/${id}`);
  return response.data;
};

export const getAdminOrders = async (params) => {
  const response = await adminApi.get('/admin/orders', { params });
  return response.data;
};

export const getAdminOrderById = async (id) => {
  const response = await adminApi.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await adminApi.put(`/admin/orders/${id}/status`, statusData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await adminApi.delete(`/admin/orders/${id}`);
  return response.data;
};

// --- DASHBOARD ---
export const getDashboardStats = async (period = 'week') => {
  const response = await adminApi.get(`/admin/dashboard/stats?period=${period}`);
  return response.data;
};

// --- CATEGORIES ---
export const getCategories = async () => {
  const response = await adminApi.get('/categories');
  return response.data;
};

export const createCategory = async (data) => {
  const response = await adminApi.post('/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await adminApi.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await adminApi.delete(`/admin/categories/${id}`);
  return response.data;
};

// --- BRANDS ---
export const getBrands = async () => {
  const response = await adminApi.get('/brands');
  return response.data;
};

export const createBrand = async (data) => {
  const response = await adminApi.post('/admin/brands', data);
  return response.data;
};

export const updateBrand = async (id, data) => {
  const response = await adminApi.put(`/admin/brands/${id}`, data);
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await adminApi.delete(`/admin/brands/${id}`);
  return response.data;
};

// --- CUSTOMERS ---
export const getCustomers = async () => {
  const response = await adminApi.get('/admin/users');
  return response.data;
};

export const getCustomerDetails = async (id) => {
  const response = await adminApi.get(`/admin/users/${id}`);
  return response.data;
};

export const toggleCustomerActive = async (id) => {
  const response = await adminApi.put(`/admin/users/${id}/toggle-active`);
  return response.data;
};

// --- REVIEWS ---
export const getReviews = async () => {
  const response = await adminApi.get('/admin/reviews');
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await adminApi.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const replyReview = async (id, replyText) => {
  const response = await adminApi.post(`/admin/reviews/${id}/reply`, { reply: replyText });
  return response.data;
};

export const toggleHideReview = async (id, isHidden) => {
  const response = await adminApi.put(`/admin/reviews/${id}/hide`, { is_hidden: isHidden });
  return response.data;
};

// MARKETING - PROMOTIONS & BANNERS & NEWS
// MARKETING - PROMOTIONS & BANNERS & NEWS
export const getPromotions = async () => { const r = await adminApi.get('/admin/marketing/promotions'); return r.data; };
export const createPromotion = async (data) => { const r = await adminApi.post('/admin/marketing/promotions', data); return r.data; };
export const togglePromotionStatus = async (id) => { const r = await adminApi.put(`/admin/marketing/promotions/${id}/toggle`); return r.data; };
export const deletePromotion = async (id) => { const r = await adminApi.delete(`/admin/marketing/promotions/${id}`); return r.data; };

export const getAdminBanners = async () => { const r = await adminApi.get('/admin/marketing/banners'); return r.data; };
export const createBanner = async (data) => { const r = await adminApi.post('/admin/marketing/banners', data); return r.data; };
export const toggleBannerStatus = async (id) => { const r = await adminApi.put(`/admin/marketing/banners/${id}/toggle`); return r.data; };
export const deleteBanner = async (id) => { const r = await adminApi.delete(`/admin/marketing/banners/${id}`); return r.data; };

export const getAdminNews = async () => { const r = await adminApi.get('/admin/news'); return r.data; };
export const createNews = async (data) => { const r = await adminApi.post('/admin/news', data); return r.data; };
export const updateNews = async (id, data) => { const r = await adminApi.put(`/admin/news/${id}`, data); return r.data; };
export const deleteNews = async (id) => { const r = await adminApi.delete(`/admin/news/${id}`); return r.data; };

// INVENTORY & SUPPLIERS
export const getSuppliers = async () => { const r = await adminApi.get('/admin/inventory/suppliers'); return r.data; };
export const createSupplier = async (data) => { const r = await adminApi.post('/admin/inventory/suppliers', data); return r.data; };
export const updateSupplier = async (id, data) => { const r = await adminApi.put(`/admin/inventory/suppliers/${id}`, data); return r.data; };
export const deleteSupplier = async (id) => { const r = await adminApi.delete(`/admin/inventory/suppliers/${id}`); return r.data; };

export const getInventorySkus = async () => { const r = await adminApi.get('/admin/inventory/skus'); return r.data; };

export const getStockReceipts = async () => { const r = await adminApi.get('/admin/inventory/receipts'); return r.data; };
export const createStockReceipt = async (data) => { const r = await adminApi.post('/admin/inventory/receipts', data); return r.data; };

// STAFFS
export const getStaffs = () => adminApi.get('/admin/staffs');
export const createStaff = (data) => adminApi.post('/admin/staffs', data);
export const updateStaff = (id, data) => adminApi.put(`/admin/staffs/${id}`, data);
export const deleteStaff = (id) => adminApi.delete(`/admin/staffs/${id}`);

// Admin Mailchimp
export const getEmailRecipients = async () => { const r = await adminApi.get('/admin/mailchimp/stats'); return r.data; };
export const triggerManualSync = async () => { const r = await adminApi.post('/admin/mailchimp/sync'); return r.data; };

export default adminApi;

