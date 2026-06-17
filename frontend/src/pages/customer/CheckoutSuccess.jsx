import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location, navigate]);

  if (!location.state) return null;

  let methodStr = location.state?.method;
  if (methodStr === 'paypal') methodStr = 'PayPal';
  if (methodStr === 'cod') methodStr = 'Thanh toán tiền mặt';
  if (methodStr === 'vnpay') methodStr = 'Chuyển khoản VNPAY';

  const displayOrderId = location.state?.orderId 
    ? location.state.orderId.substring(0, 8).toUpperCase() 
    : Math.floor(100000 + Math.random() * 900000);

  const dateStr = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date());

  return (
    <div className="checkout-page-container fade-in">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '40px 20px' }}>
        <div className="checkout-panel glass" style={{ maxWidth: '600px', width: '100%', padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '40px 30px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--cyan-dim)', border: '2px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--cyan-glow)' }}>
                <CheckCircle size={40} style={{ color: 'var(--cyan)' }} className="animate-pulse" />
              </div>
            </div>
            <h1 className="glitch-text text-3xl font-bold" data-text="THÀNH CÔNG!">THÀNH CÔNG!</h1>
            <p className="text-muted" style={{ marginTop: '10px' }}>
              Cảm ơn bạn đã tin tưởng EZ4GEAR. Đơn hàng của bạn đã được thanh toán và đặt thành công.
            </p>
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Package size={20} style={{ color: 'var(--pink)' }} />
              <h2 className="panel-title" style={{ margin: 0, padding: 0, border: 'none', fontSize: '18px' }}>Thông tin đơn hàng</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                <span className="text-muted">Mã đơn hàng:</span>
                <span style={{ color: 'var(--cyan)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>#{displayOrderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                <span className="text-muted">Thời gian:</span>
                <span style={{ color: 'var(--text)', fontWeight: '500' }}>{dateStr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                <span className="text-muted">Phương thức:</span>
                <span style={{ color: 'var(--text)', fontWeight: '500', textTransform: 'uppercase' }}>{methodStr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '5px' }}>
                <span className="text-muted" style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng tiền:</span>
                <span style={{ color: 'var(--pink)', fontSize: '24px', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(location.state?.total || 0)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 30px 30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/profile" state={{ activeTab: 'orders' }} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              XEM ĐƠN HÀNG <ArrowRight size={18} />
            </Link>
            <Link to="/" className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Home size={18} /> VỀ TRANG CHỦ
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
