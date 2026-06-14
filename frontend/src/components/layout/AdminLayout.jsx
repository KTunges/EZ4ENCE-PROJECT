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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { section: 'TỔNG QUAN', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard', active: true }
    ]},
    { section: 'BÁN HÀNG', items: [
      { id: 'orders', label: 'Quản lý Đơn hàng', icon: <ShoppingCart size={18} />, path: '/admin/orders', active: true },
      { id: 'products', label: 'Quản lý Sản phẩm', icon: <Package size={18} />, path: '/admin/products', active: true },
      { id: 'categories', label: 'Quản lý Danh mục', icon: <Tags size={18} />, path: '/admin/categories', active: true },
      { id: 'brands', label: 'Quản lý Thương hiệu', icon: <Award size={18} />, path: '/admin/brands', active: true }
    ]},
    { section: 'MARKETING', items: [
      { id: 'coupons', label: 'Mã giảm giá', icon: <Ticket size={18} />, path: '/admin/coupons', active: false },
      { id: 'banners', label: 'Quản lý Banner', icon: <ImageIcon size={18} />, path: '/admin/banners', active: false },
      { id: 'email', label: 'Email Marketing', icon: <Send size={18} />, path: '/admin/email', active: false }
    ]},
    { section: 'KHO & ĐỐI TÁC', items: [
      { id: 'inventory', label: 'Theo dõi Tồn kho', icon: <ClipboardList size={18} />, path: '/admin/inventory', active: false },
      { id: 'suppliers', label: 'Nhà cung cấp', icon: <Truck size={18} />, path: '/admin/suppliers', active: false },
      { id: 'stock-in', label: 'Phiếu nhập kho', icon: <ArrowDownToLine size={18} />, path: '/admin/stock-in', active: false },
      { id: 'stock-out', label: 'Phiếu xuất kho', icon: <ArrowUpFromLine size={18} />, path: '/admin/stock-out', active: false }
    ]},
    { section: 'KHÁCH HÀNG', items: [
      { id: 'customers', label: 'Khách hàng', icon: <Users size={18} />, path: '/admin/customers', active: false },
      { id: 'reviews', label: 'Đánh giá/Bình luận', icon: <Star size={18} />, path: '/admin/reviews', active: false },
      { id: 'chat', label: 'Live Chat', icon: <MessageSquare size={18} />, path: '/admin/chat', active: false },
      { id: 'returns', label: 'Đổi/Trả hàng', icon: <RefreshCcw size={18} />, path: '/admin/returns', active: false }
    ]},
    { section: 'HỆ THỐNG', items: [
      { id: 'users', label: 'Nhân viên (Staff)', icon: <UserCog size={18} />, path: '/admin/users', active: false },
      { id: 'roles', label: 'Phân quyền', icon: <ShieldCheck size={18} />, path: '/admin/roles', active: false }
    ]}
  ];

  return (
    <div  style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
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
            <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900', letterSpacing: '1px', margin: 0 }}>EZ4ENCE</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', letterSpacing: '2px', fontWeight: '600', margin: '4px 0 0 0' }}>ADMINISTRATOR</p>
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
                          borderRight: isActive ? '3px solid #ffffff' : '3px solid transparent',
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
                        <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Dev</span>
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
                onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = '#38bdf8'; e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.2)'; }}
                onBlur={(e) => { e.target.style.background = 'var(--border)'; e.target.style.borderColor = 'var(--border-hover)'; e.target.style.boxShadow = 'none'; }}
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
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text)', letterSpacing: '0.5px' }}>{user?.fullName || 'Admin'}</div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '500', letterSpacing: '0.5px' }}>Super Administrator</div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}>
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '4px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'} title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '30px', background: 'var(--bg-page)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
