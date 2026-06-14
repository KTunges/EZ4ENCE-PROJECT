import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div className="spinner-border text-cyan w-8 h-8 border-4 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
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

  if (user.role !== 'ADMIN') {
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

  return children;
}
