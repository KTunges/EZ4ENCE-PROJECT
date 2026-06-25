import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const isWishlisted = (skuId) => {
    return wishlistItems.some(item => item.sku_id === skuId);
  };

  const toggleWishlist = async (skuId) => {
    if (!isAuthenticated) {
      addToast('Vui lòng đăng nhập để thêm vào mục yêu thích', 'error');
      return false;
    }

    const token = localStorage.getItem('token');
    const currentlyWishlisted = isWishlisted(skuId);

    try {
      if (currentlyWishlisted) {
        // Remove from wishlist
        const res = await fetch(`http://localhost:8000/api/wishlist/${skuId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          setWishlistItems(prev => prev.filter(item => item.sku_id !== skuId));
          addToast('Đã bỏ khỏi danh sách yêu thích', 'info');
          return true;
        }
      } else {
        // Add to wishlist
        const res = await fetch('http://localhost:8000/api/wishlist', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sku_id: skuId })
        });
        
        if (res.ok) {
          const newItem = await res.json();
          setWishlistItems(prev => [...prev, newItem]);
          addToast('Đã thêm vào danh sách yêu thích', 'success');
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
      addToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    }
    
    return false;
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, toggleWishlist, isWishlisted, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
