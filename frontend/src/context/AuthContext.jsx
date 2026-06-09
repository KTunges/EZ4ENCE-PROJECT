/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user details
  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/me', {
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
  }, []);

  // Initialize and verify token
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchCurrentUser]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

  // Register handler
  const register = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
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
      const res = await fetch('http://localhost:8000/api/auth/google', {
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
      const res = await fetch('http://localhost:8000/api/auth/profile', {
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

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
        isAuthenticated: !!user,
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
