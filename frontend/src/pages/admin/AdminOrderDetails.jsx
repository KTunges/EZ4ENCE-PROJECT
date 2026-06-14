import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, User, Package, Printer, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for order
  const [order, setOrder] = useState({
    id: id || 'ORD-2026-0614',
    date: '14/06/2026 14:30',
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'VNPay',
    customer: {
      name: 'Nguyễn Kim Tùng',
      email: 'kimtung5576@gmail.com',
      phone: '0987654321',
      address: '123 Đường Công Nghệ, Phường 4, Quận Cầu Giấy, Hà Nội'
    },
    items: [
      { id: '1', name: 'Intel Core i9-14900K', qty: 1, price: 15500000, img: 'https://via.placeholder.com/60/1a1a2e/00d2ff?text=CPU' },
      { id: '2', name: 'Z790 AORUS ELITE', qty: 1, price: 6500000, img: 'https://via.placeholder.com/60/1a1a2e/00d2ff?text=MB' }
    ],
    subtotal: 22000000,
    shippingFee: 50000,
    discount: 0,
    total: 22050000
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Chờ xử lý</span>;
      case 'shipping': return <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đang giao hàng</span>;
      case 'completed': return <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hoàn thành</span>;
      case 'cancelled': return <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return null;
    }
  };

  const handleStatusChange = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }));
    // Simulate API call
    alert(`Đã cập nhật trạng thái đơn hàng thành: ${newStatus}`);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/admin/orders')}
            style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              Đơn hàng #{order.id} {getStatusBadge(order.status)}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Đặt lúc: {order.date}</p>
          </div>
        </div>
        <button style={{ padding: '8px 16px', background: 'var(--border)', color: 'var(--text)', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Printer size={16} /> In hóa đơn
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Items */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="var(--cyan)" /> Sản phẩm đã đặt
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>SL: {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{item.price.toLocaleString('vi-VN')} đ</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Tạm tính</span>
                <span>{order.subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Phí vận chuyển</span>
                <span>{order.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Giảm giá</span>
                <span>-{order.discount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--cyan)' }}>{order.total.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Actions */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)' }}>Cập nhật trạng thái</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => handleStatusChange('pending')} style={{ padding: '10px', background: order.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)', color: order.status === 'pending' ? '#f59e0b' : 'var(--text)', border: order.status === 'pending' ? '1px solid #f59e0b' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Chờ xử lý
              </button>
              <button onClick={() => handleStatusChange('shipping')} style={{ padding: '10px', background: order.status === 'shipping' ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface)', color: order.status === 'shipping' ? '#38bdf8' : 'var(--text)', border: order.status === 'shipping' ? '1px solid #38bdf8' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} /> Đang giao hàng
              </button>
              <button onClick={() => handleStatusChange('completed')} style={{ padding: '10px', background: order.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-surface)', color: order.status === 'completed' ? '#22c55e' : 'var(--text)', border: order.status === 'completed' ? '1px solid #22c55e' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Đã hoàn thành
              </button>
              <button onClick={() => handleStatusChange('cancelled')} style={{ padding: '10px', background: order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)', color: order.status === 'cancelled' ? '#ef4444' : 'var(--text)', border: order.status === 'cancelled' ? '1px solid #ef4444' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> Hủy đơn hàng
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--cyan)" /> Khách hàng
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 'bold', color: 'var(--text)' }}>{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
            
            <hr style={{ borderColor: 'var(--border)', margin: '16px 0' }} />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: '4px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{order.customer.address}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--cyan)" /> Thanh toán
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phương thức</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Trạng thái</span>
              {order.paymentStatus === 'paid' ? (
                <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Đã thanh toán</span>
              ) : (
                <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Chưa thanh toán</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
