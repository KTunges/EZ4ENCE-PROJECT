import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { adminUser, isAdminAuthenticated, isAdminLoading } = useAuth();
  const location = useLocation();

  const hasAccess = (path, user) => {
    if (!user || !user.staff_role) return false;
    if (user.staff_role === 'SUPER_ADMIN') return true;
    if (path === '/admin' || path === '/admin/' || path.startsWith('/admin/dashboard')) return true;
    
    if (user.staff_role === 'SALES') {
      return ['/admin/orders', '/admin/customers'].some(p => path.startsWith(p));
    }
    if (user.staff_role === 'INVENTORY') {
      return ['/admin/products', '/admin/categories', '/admin/brands', '/admin/inventory', '/admin/suppliers', '/admin/stock'].some(p => path.startsWith(p));
    }
    return false;
  };

  if (isAdminLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div className="spinner-border text-cyan w-8 h-8 border-4 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated || !adminUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'white', textAlign: 'center', padding: '20px' }}>
        <LogIn size={64} color="var(--cyan)" style={{ marginBottom: '20px' }} />
        <h1 className="glitch-text text-3xl font-bold" data-text="YÊU CẦU ĐĂNG NHẬP">YÊU CẦU ĐĂNG NHẬP</h1>
        <p className="text-muted mt-4 mb-6">Bạn cần đăng nhập bằng tài khoản Nhân viên để vào hệ thống Admin.</p>
        <button onClick={() => window.location.href = '/ez4-portal-auth'} className="btn btn-primary">
          Đăng Nhập Admin
        </button>
      </div>
    );
  }

  if (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'white', textAlign: 'center', padding: '20px' }}>
        <ShieldAlert size={64} color="var(--pink)" style={{ marginBottom: '20px' }} />
        <h1 className="glitch-text text-3xl font-bold" data-text="403 FORBIDDEN">403 FORBIDDEN</h1>
        <p className="text-muted mt-4 mb-6">Tài khoản của bạn không có quyền hạn truy cập khu vực Quản trị.</p>
        <button onClick={() => window.location.href = '/ez4-portal-auth'} className="btn btn-outline">
          Đăng Nhập Tài Khoản Khác
        </button>
      </div>
    );
  }

  if (!hasAccess(location.pathname, adminUser)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: 'var(--text)', textAlign: 'center', padding: '20px' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Từ chối truy cập</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Tài khoản của bạn ({adminUser.staff_role}) không được phân quyền để vào trang này.</p>
        <button onClick={() => window.history.back()} style={{ padding: '10px 24px', background: '#38bdf8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Quay lại trang trước
        </button>
      </div>
    );
  }

  return children;
}
