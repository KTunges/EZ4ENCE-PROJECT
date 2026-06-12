import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // If no state (e.g. user manually navigated to /checkout/success), redirect home
  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location, navigate]);

  if (!location.state) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center fade-in py-12">
      <div className="glass max-w-lg w-full p-8 text-center" style={{ borderRadius: '1rem', borderTop: '4px solid #00d2ff' }}>
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan shadow-[0_0_30px_rgba(0,210,255,0.3)]" style={{ background: 'rgba(0, 210, 255, 0.1)' }}>
            <CheckCircle size={56} className="text-cyan animate-pulse" />
          </div>
        </div>
        
        <h1 className="glitch-text text-4xl font-bold mb-4" data-text="THÀNH CÔNG!">THÀNH CÔNG!</h1>
        <p className="text-muted text-lg mb-8">
          Cảm ơn bạn đã tin tưởng EZ4ENCE. Đơn hàng của bạn đã được thanh toán và đặt thành công.
        </p>

        <div className="rounded-lg p-6 mb-8 border" style={{ background: 'var(--bg-card, rgba(0,0,0,0.05))', borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}>
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--text-color)' }}>
            <Package className="text-pink" />
            <span className="font-semibold text-lg">Thông tin đơn hàng</span>
          </div>
          <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}>
            <span className="text-muted">Mã đơn hàng:</span>
            <span className="font-mono text-cyan font-bold">#{location.state?.orderId || Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between py-3 border-b" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.1))' }}>
            <span className="text-muted">Phương thức:</span>
            <span className="font-semibold uppercase">{location.state?.method === 'paypal' ? 'PayPal' : location.state?.method}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-muted">Tổng tiền:</span>
            <span className="font-bold text-pink text-xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(location.state?.total || 0)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link to="/profile" className="btn btn-outline flex items-center justify-center gap-2">
            Xem đơn hàng <ArrowRight size={18} />
          </Link>
          <Link to="/" className="btn btn-primary flex items-center justify-center gap-2">
            <Home size={18} /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
