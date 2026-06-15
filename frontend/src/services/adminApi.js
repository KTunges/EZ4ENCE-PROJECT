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
  return response.data;
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

// --- DASHBOARD (DUMMY CHO TỚI KHI CÓ API THỐNG KÊ THẬT) ---
export const getDashboardStats = async () => {
  try {
    const [orders, products] = await Promise.all([
      getAdminOrders({ limit: 100 }),
      getAdminProducts({ limit: 1000 })
    ]);
    
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      activeProducts: products.length,
      newCustomers: 4 // Giả lập số khách hàng
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard:", error);
    return { totalRevenue: 0, totalOrders: 0, activeProducts: 0, newCustomers: 0 };
  }
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

export default adminApi;
