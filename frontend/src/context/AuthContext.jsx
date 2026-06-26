/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin states
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdminUser(null);
  }, []);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token might be expired or invalid
        logout();
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const fetchCurrentAdmin = useCallback(async (authToken) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN') {
          setAdminUser(userData);
        } else {
          adminLogout();
        }
      } else {
        adminLogout();
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin admin:', err);
      adminLogout();
    } finally {
      setIsAdminLoading(false);
    }
  }, [adminLogout]);

  // Initialize and verify token
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }

    if (adminToken) {
      fetchCurrentAdmin(adminToken);
    } else {
      setIsAdminLoading(false);
    }
  }, [token, adminToken, fetchCurrentUser, fetchCurrentAdmin]);

  // Login handler
  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Đăng nhập không thành công. Vui lòng thử lại.');
      }

      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Step 1
  const adminLoginStep1 = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/admin-login-step1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Đăng nhập thất bại.');
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login Step 2
  const adminLoginStep2 = async (email, otp) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/admin-login-step2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Xác thực OTP thất bại.');

      localStorage.setItem('admin_token', data.access_token);
      setAdminToken(data.access_token);
      setAdminUser(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (fullName, username, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Đăng ký không thành công. Vui lòng thử lại.');
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google handler
  const loginWithGoogle = async (tokenStr) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenStr }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Đăng nhập Google thất bại.');
      }

      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data; // Return full data so caller can check data.is_new_user
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile handler (used for setting full name initially)
  const updateProfile = async (fullName) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Cập nhật thông tin thất bại.');
      }

      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Avatar handler
  const updateAvatar = async (file) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData, // fetch will set the correct multipart/form-data boundary automatically
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Cập nhật ảnh đại diện thất bại.');
      }

      setUser(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // Facebook Login handler
  const loginWithFacebook = async (token) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/facebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Đăng nhập Facebook thất bại.');
      }

      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);

      return data;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        adminLoginStep1,
        adminLoginStep2,
        register,
        loginWithGoogle,
        loginWithFacebook,
        updateProfile,
        updateAvatar,
        logout,
        adminLogout,
        fetchCurrentUser,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!adminUser,
        adminUser,
        adminToken,
        isAdminLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
