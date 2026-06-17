import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import AuthModal from '../ui/AuthModal';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const [showAuth, setShowAuth] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else {
            setSuggestions([]);
          }
        }
      } catch (err) {
        console.error("Lỗi fetch suggestions:", err);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchInputRef = useRef(null);

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Nếu thanh tìm kiếm đang đóng, bấm vào icon sẽ mở nó ra
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
      return;
    }

    // Nếu đang mở và có text, thực hiện tìm kiếm
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      // Đừng đóng search bar ngay, để user thấy họ vừa tìm gì
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setShowSuggestions(false);
      }
    }
  };

  return (
    <>
      <header className="header glass">
        <div className="container flex items-center justify-between">
          <Link to="/" className="header-logo text-gradient">
            EZ4GEAR
          </Link>

          <nav className="header-nav">
            <NavLink to="/" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`} end>Trang chủ</NavLink>
            <NavLink to="/products" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Sản phẩm</NavLink>
            <NavLink to="/build-pc" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Build PC</NavLink>
            <NavLink to="/about" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Về chúng tôi</NavLink>
          </nav>

          <div className="header-actions">
            <div className={`header-search-container ${isSearchOpen ? 'open' : ''}`} style={{ position: 'relative' }}>
              <input 
                ref={searchInputRef}
                type="text" 
                className="header-search-input" 
                placeholder="Tìm kiếm linh kiện, gear..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Small delay to allow clicking suggestions or search icon
                  setTimeout(() => {
                    setIsSearchOpen(false);
                    setShowSuggestions(false);
                  }, 200);
                }}
              />
              <button 
                className="icon-btn search-btn" 
                aria-label="Search"
                onClick={handleSearch}
              >
                <Search size={18} />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  marginTop: '8px',
                  padding: '8px 0',
                  zIndex: 9999,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 16px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }}
                    >
                      <img src={(p.images && p.images[0] && p.images[0].url) || '/images/placeholder.jpg'} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', background: '#fff', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.4', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: '600' }}>{((p.skus && p.skus[0] && p.skus[0].promotional_price) || (p.skus && p.skus[0] && p.skus[0].price) || 0).toLocaleString('vi-VN')} ₫</span>
                      </div>
                    </Link>
                  ))}
                  <Link 
                    to={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '8px',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border)',
                      marginTop: '4px',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cyan)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    onClick={() => {
                      setShowSuggestions(false);
                      setIsSearchOpen(false);
                    }}
                  >
                    Xem tất cả kết quả
                  </Link>
                </div>
              )}
            </div>
            <Link to="/cart" className="icon-btn header-cart-btn" aria-label="Cart" style={{position: 'relative'}}>
              <ShoppingCart size={18} />
              {cart?.total_items > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-8px', background: 'var(--cyan)', 
                  color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', 
                  borderRadius: '10px', minWidth: '18px', textAlign: 'center'
                }}>
                  {cart.total_items}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link to="/profile" className="header-user-pill" title="Quản lý tài khoản">
                <div className="user-avatar-mini">
                  {user.picture || user.avatar ? (
                    <img src={user.picture || user.avatar} alt="Avatar" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="user-info-mini">
                  <span className="user-name-mini">{user.fullName || user.email?.split('@')[0]}</span>
                  <span className="user-badge-mini">EZ4 MEMBER</span>
                </div>
              </Link>
            ) : (
              <button className="icon-btn" aria-label="User" onClick={() => setShowAuth(true)}>
                <User size={18} />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            >
              <span className="toggle-track">
                <span className="toggle-thumb">
                  {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
