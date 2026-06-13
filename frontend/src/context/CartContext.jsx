import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/cart', {
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

  const addToCart = async (skuId, quantity = 1) => {
    if (!user || !token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return false;
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sku_id: skuId, quantity })
      });
      
      if (res.ok) {
        await fetchCart();
        return true;
      } else {
        const data = await res.json();
        alert(data.detail || 'Lỗi thêm vào giỏ hàng');
        return false;
      }
    } catch (err) {
      console.error("Add to cart error", err);
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/cart/items/${itemId}`, {
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
      const res = await fetch(`http://localhost:8000/api/cart/items/${itemId}`, {
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
  
  const clearCartState = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart,
      clearCartState
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
