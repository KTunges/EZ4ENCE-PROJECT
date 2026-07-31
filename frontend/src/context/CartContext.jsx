import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'ez4_guest_cart';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ═══ Helper: Quản lý giỏ hàng Guest trong localStorage ═══
function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // ═══ Giỏ hàng Guest (chưa đăng nhập) ═══
  const [guestItems, setGuestItems] = useState(() => getGuestCart());

  // Đồng bộ guestItems → localStorage mỗi khi thay đổi
  useEffect(() => {
    saveGuestCart(guestItems);
  }, [guestItems]);

  // ═══ Auto-sync: Khi user đăng nhập, gộp giỏ ảo vào tài khoản ═══
  const syncGuestCartToServer = useCallback(async (authToken) => {
    const localItems = getGuestCart();
    if (localItems.length === 0) return;

    try {
      for (const item of localItems) {
        await fetch(`${API_URL}/api/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ sku_id: item.sku_id, quantity: item.quantity })
        });
      }
      // Xóa giỏ ảo sau khi đồng bộ thành công
      clearGuestCart();
      setGuestItems([]);
    } catch (err) {
      console.error('Lỗi đồng bộ giỏ hàng khách:', err);
    }
  }, []);

  // Fetch cart khi user đăng nhập + sync guest cart
  useEffect(() => {
    if (user && token) {
      syncGuestCartToServer(token).then(() => fetchCart());
    } else {
      setCart(null);
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (skuId, quantity = 1, silent = false) => {
    // ═══ Khách vãng lai: Lưu vào localStorage ═══
    if (!user || !token) {
      setGuestItems(prev => {
        const existing = prev.find(i => i.sku_id === skuId);
        if (existing) {
          return prev.map(i => i.sku_id === skuId ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { sku_id: skuId, quantity }];
      });
      if (!silent) addToast('Đã thêm vào giỏ hàng', 'success');
      return true;
    }
    
    // ═══ Đã đăng nhập: Gọi API bình thường ═══
    try {
      const res = await fetch(`${API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sku_id: skuId, quantity })
      });
      
      if (res.ok) {
        await fetchCart();
        if (!silent) addToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
        return true;
      } else {
        const data = await res.json();
        if (!silent) addToast(data.detail || 'Lỗi thêm vào giỏ hàng', 'error');
        return false;
      }
    } catch (err) {
      console.error("Add to cart error", err);
      if (!silent) addToast('Lỗi kết nối máy chủ', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Update quantity error", err);
    }
  };

  const removeItem = async (itemId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error("Remove item error", err);
    }
  };

  // ═══ Guest cart helpers ═══
  const updateGuestQuantity = (skuId, quantity) => {
    if (quantity <= 0) {
      setGuestItems(prev => prev.filter(i => i.sku_id !== skuId));
    } else {
      setGuestItems(prev => prev.map(i => i.sku_id === skuId ? { ...i, quantity } : i));
    }
  };

  const removeGuestItem = (skuId) => {
    setGuestItems(prev => prev.filter(i => i.sku_id !== skuId));
  };
  
  const clearCartState = () => {
    setCart(null);
  };

  // Tổng số lượng items (cả guest + server)
  const totalItems = user 
    ? (cart?.items?.length || 0) 
    : guestItems.length;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart,
      clearCartState,
      // Guest cart
      guestItems,
      updateGuestQuantity,
      removeGuestItem,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
