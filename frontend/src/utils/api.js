const API_BASE_URL = "http://localhost:8000/api";

/**
 * Helper function để thực hiện API call (sử dụng fetch API có sẵn của trình duyệt)
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Tự động thêm Content-Type header cho request JSON
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Tự động chèn JWT token vào Authorization header nếu có trong localStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Ném lỗi kèm message từ backend trả về
    throw new Error(data.detail || "Đã xảy ra lỗi hệ thống!");
  }

  return data;
}

export const api = {
  // Authentication APIs
  auth: {
    register: (userData) => 
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
      
    login: (credentials) => {
      // API Login của FastAPI Auth OAuth2 yêu cầu dữ liệu gửi lên dạng Form (URL-Encoded)
      const formData = new URLSearchParams();
      formData.append("username", credentials.email); // Dùng email làm username
      formData.append("password", credentials.password);
      
      return fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Sai email hoặc mật khẩu!");
        return data;
      });
    },

    getProfile: () => request("/auth/me"),
  },

  // Products APIs
  products: {
    getAll: () => request("/products"),
    getById: (id) => request(`/products/${id}`),
  }
};
