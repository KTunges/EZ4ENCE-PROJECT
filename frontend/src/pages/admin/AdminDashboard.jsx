import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-color)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'rgba(10, 10, 15, 0.95)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 className="glitch-text text-xl font-bold" data-text="EZ4ENCE ADMIN">EZ4ENCE ADMIN</h2>
          <p className="text-cyan text-sm mt-1">v0.0.5</p>
        </div>
        
        <nav style={{ flex: 1, padding: '16px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
              { id: 'products', label: 'Quản lý Sản Phẩm', icon: <Package size={20} /> },
              { id: 'orders', label: 'Quản lý Đơn Hàng', icon: <ShoppingCart size={20} /> },
              { id: 'users', label: 'Quản lý Khách Hàng', icon: <Users size={20} /> },
              { id: 'settings', label: 'Cài Đặt', icon: <Settings size={20} /> }
            ].map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', 
                    background: activeMenu === item.id ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                    color: activeMenu === item.id ? 'var(--cyan)' : 'var(--text-muted)',
                    border: 'none', borderRight: activeMenu === item.id ? '3px solid var(--cyan)' : '3px solid transparent',
                    cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: activeMenu === item.id ? '600' : '400',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user?.fullName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Administrator</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'transparent', border: '1px solid var(--pink)', color: 'var(--pink)', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Trở về trang khách
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h1 className="text-2xl font-bold mb-6">Xin chào, {user?.fullName}! 👋</h1>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
          <LayoutDashboard size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Chức năng đang được xây dựng</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Các module UI/UX cho phần {activeMenu} sẽ được thiết kế và tích hợp vào bản cập nhật tới bởi contributor UI.
          </p>
        </div>
      </main>
    </div>
  );
}
