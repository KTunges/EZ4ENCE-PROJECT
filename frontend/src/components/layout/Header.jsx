import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header glass">
      <div className="container flex items-center justify-between">
        <Link to="/" className="header-logo text-gradient">
          EZ4ENCE
        </Link>

        <nav className="header-nav">
          <Link to="/" className="header-nav-link active">Trang chủ</Link>
          <Link to="/products" className="header-nav-link">Sản phẩm</Link>
          <Link to="/build-pc" className="header-nav-link">Build PC</Link>
          <Link to="/about" className="header-nav-link">Giới thiệu</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <ShoppingCart size={18} />
          </Link>
          <Link to="/login" className="icon-btn" aria-label="User">
            <User size={18} />
          </Link>

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
  );
}
