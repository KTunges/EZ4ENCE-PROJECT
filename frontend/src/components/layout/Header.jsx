import { useState } from 'react';
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
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(!isSearchOpen);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <header className="header glass">
        <div className="container flex items-center justify-between">
          <Link to="/" className="header-logo text-gradient">
            EZ4ENCE
          </Link>

          <nav className="header-nav">
            <NavLink to="/" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`} end>Trang chủ</NavLink>
            <NavLink to="/products" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Sản phẩm</NavLink>
            <NavLink to="/build-pc" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Build PC</NavLink>
            <NavLink to="/about" className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}>Về chúng tôi</NavLink>
          </nav>

          <div className="header-actions">
            <div className={`header-search-container ${isSearchOpen ? 'open' : ''}`}>
              <input 
                type="text" 
                className="header-search-input" 
                placeholder="Tìm kiếm linh kiện, gear..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  // Small delay to allow clicking the search icon itself to toggle
                  setTimeout(() => setIsSearchOpen(false), 200);
                }}
              />
              <button 
                className="icon-btn search-btn" 
                aria-label="Search"
                onClick={handleSearch}
              >
                <Search size={18} />
              </button>
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
