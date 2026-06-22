import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Tags, Award, Ticket, 
  Image as ImageIcon, Users, UserCog, ShieldCheck, Mail, MessageSquare, 
  Send, Truck, ArrowDownToLine, ArrowUpFromLine, ClipboardList, 
  Search, Star, RefreshCcw, FileText, LogOut, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const hasAccess = (path, isDev = false) => {
    if (isDev) return false; // Dev items are always false
    if (!adminUser || !adminUser.staff_role) return false; // Should not happen if logged in
    if (adminUser.staff_role === 'SUPER_ADMIN') return true;
    if (path === '/admin/dashboard') return true; // Everyone can see dashboard
    
    if (adminUser.staff_role === 'SALES') {
      return ['/admin/orders', '/admin/customers', '/admin/chat'].includes(path);
    }
    if (adminUser.staff_role === 'INVENTORY') {
      return ['/admin/products', '/admin/categories', '/admin/brands', '/admin/inventory', '/admin/suppliers', '/admin/stock'].includes(path);
    }
    return false;
  };

  const navItems = [
    { section: 'TỔNG QUAN', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard', active: hasAccess('/admin/dashboard') }
    ]},
    { section: 'BÁN HÀNG', items: [
      { id: 'orders', label: 'Quản lý Đơn hàng', icon: <ShoppingCart size={18} />, path: '/admin/orders', active: hasAccess('/admin/orders') },
      { id: 'products', label: 'Quản lý Sản phẩm', icon: <Package size={18} />, path: '/admin/products', active: hasAccess('/admin/products') },
      { id: 'categories', label: 'Quản lý Danh mục', icon: <Tags size={18} />, path: '/admin/categories', active: hasAccess('/admin/categories') },
      { id: 'brands', label: 'Quản lý Thương hiệu', icon: <Award size={18} />, path: '/admin/brands', active: hasAccess('/admin/brands') }
    ]},
    { section: 'MARKETING', items: [
      { id: 'coupons', label: 'Mã giảm giá', icon: <Ticket size={18} />, path: '/admin/coupons', active: hasAccess('/admin/coupons') },
      { id: 'banners', label: 'Quản lý Banner', icon: <ImageIcon size={18} />, path: '/admin/banners', active: hasAccess('/admin/banners') },
      { id: 'news', label: 'Tin tức', icon: <FileText size={18} />, path: '/admin/news', active: hasAccess('/admin/dashboard') },
      { id: 'email', label: 'Email Marketing', icon: <Send size={18} />, path: '/admin/email', active: hasAccess('/admin/email') }
    ]},
    { section: 'KHO & ĐỐI TÁC', items: [
      { id: 'inventory', label: 'Theo dõi Tồn kho', icon: <Package size={18} />, path: '/admin/inventory', active: hasAccess('/admin/inventory') },
      { id: 'suppliers', label: 'Nhà cung cấp', icon: <Truck size={18} />, path: '/admin/suppliers', active: hasAccess('/admin/suppliers') },
      { id: 'stock-in', label: 'Phiếu nhập/xuất kho', icon: <FileText size={18} />, path: '/admin/stock', active: hasAccess('/admin/stock') }
    ]},
    { section: 'KHÁCH HÀNG', items: [
      { id: 'customers', label: 'Khách hàng', icon: <Users size={18} />, path: '/admin/customers', active: hasAccess('/admin/customers') },
      { id: 'reviews', label: 'Đánh giá/Bình luận', icon: <Star size={18} />, path: '/admin/reviews', active: hasAccess('/admin/reviews') },
      { id: 'chat', label: 'Live Chat', icon: <MessageSquare size={18} />, path: '/admin/chat', active: hasAccess('/admin/chat') },
      { id: 'returns', label: 'Đổi/Trả hàng', icon: <RefreshCcw size={18} />, path: '/admin/returns', active: hasAccess('/admin/returns', true) }
    ]},
    { section: 'HỆ THỐNG', items: [
      { id: 'staffs', label: 'Nhân viên (Staff)', icon: <UserCog size={18} />, path: '/admin/staffs', active: hasAccess('/admin/staffs') }
    ]}
  ];

  return (
    <div data-theme="light" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '260px' : '0px', 
        background: 'linear-gradient(180deg, #1e40af 0%, #0f172a 100%)', 
        borderRight: 'none', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', letterSpacing: '0.5px', margin: 0 }}>
              EZ4GEAR <span style={{ color: '#38bdf8' }}>ADMIN</span>
            </h2>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }} className="admin-sidebar-nav">
          {navItems.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <div style={{ padding: '0 24px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>
                {group.section}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {group.items.map(item => (
                  <li key={item.id}>
                    {item.active ? (
                      <NavLink 
                        to={item.path}
                        className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 24px',
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.85)',
                          background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          borderRight: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                          textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? '700' : '500',
                          transition: 'all 0.2s',
                          opacity: 1
                        })}
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    ) : (
                      <div 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 24px',
                          color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', cursor: 'not-allowed', opacity: 0.6
                        }}
                        title="Tính năng đang được phát triển"
                      >
                        {item.icon}
                        {item.label}
                        <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                          {['/admin/email', '/admin/returns'].includes(item.path) ? 'Dev' : <ShieldCheck size={12} />}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <header style={{ 
          height: '64px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={24} />
            </button>
            
            {/* Smart Search */}
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Smart Search (Nhấn / để tìm kiếm)..." 
                style={{ 
                  width: '100%', padding: '10px 16px 10px 42px', background: 'var(--bg-card)', 
                  border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none',
                  transition: 'all 0.2s', letterSpacing: '0.3px'
                }}
                onFocus={(e) => { e.target.style.background = 'var(--bg-card-hover)'; e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                onBlur={(e) => { e.target.style.background = 'var(--bg-card)'; e.target.style.borderColor = 'var(--border-hover)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', position: 'relative', display: 'flex' }}>
              <Bell size={22} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', border: '2px solid var(--glass-bg)', width: '10px', height: '10px', borderRadius: '50%' }}></span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-hover)', paddingLeft: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text)', letterSpacing: '0.5px' }}>{adminUser?.fullName || 'Admin'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {adminUser?.staff_role === 'SUPER_ADMIN' ? 'Super Admin' : adminUser?.staff_role || 'System Admin'}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}>
                {adminUser?.fullName?.charAt(0) || 'A'}
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '4px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px', background: '#ffffff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
