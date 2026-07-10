import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, User, Package, Printer, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getAdminOrderById, updateOrderStatus } from '../../services/adminApi';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getAdminOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'CONFIRMED': return <span style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'SHIPPING': return <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đang giao hàng</span>;
      case 'DELIVERED': return <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã giao</span>;
      case 'CANCELLED': return <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return null;
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(id, { status: newStatus });
      // COD: DELIVERED => PAID, ngược lại => UNPAID
      let updatedPayment = order.payment_status;
      if (order.payment_method === 'COD') {
        updatedPayment = newStatus === 'DELIVERED' ? 'PAID' : 'UNPAID';
      }
      setOrder(prev => ({ ...prev, status: newStatus, payment_status: updatedPayment }));
      alert(`Đã cập nhật trạng thái đơn hàng thành công`);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy đơn hàng</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="no-print"
            style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              Đơn hàng #{order.id.substring(0, 8).toUpperCase()} {getStatusBadge(order.status)}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Đặt lúc: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="no-print" style={{ padding: '8px 16px', background: 'var(--border)', color: 'var(--text)', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
              {order.items.map(item => {
                const imageUrl = item.sku?.product?.images?.[0]?.url || 'https://via.placeholder.com/60/1a1a2e/00d2ff?text=No+Img';
                const name = item.sku?.product?.name || 'Sản phẩm';
                return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <img src={imageUrl} alt={name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>SL: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                </div>
              )})}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Tạm tính</span>
                <span>{order.total_amount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Phí vận chuyển</span>
                <span>0 đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>Giảm giá</span>
                <span>0 đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--cyan)' }}>{order.total_amount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Actions */}
          <div className="glass no-print" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)' }}>Cập nhật trạng thái</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => handleStatusChange('PENDING')} style={{ padding: '10px', background: order.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)', color: order.status === 'PENDING' ? '#f59e0b' : 'var(--text)', border: order.status === 'PENDING' ? '1px solid #f59e0b' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} /> Chờ xác nhận
              </button>
              <button onClick={() => handleStatusChange('CONFIRMED')} style={{ padding: '10px', background: order.status === 'CONFIRMED' ? 'rgba(33, 150, 243, 0.2)' : 'var(--bg-surface)', color: order.status === 'CONFIRMED' ? '#2196f3' : 'var(--text)', border: order.status === 'CONFIRMED' ? '1px solid #2196f3' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Đã xác nhận
              </button>
              <button onClick={() => handleStatusChange('SHIPPING')} style={{ padding: '10px', background: order.status === 'SHIPPING' ? 'rgba(156, 39, 176, 0.2)' : 'var(--bg-surface)', color: order.status === 'SHIPPING' ? '#9c27b0' : 'var(--text)', border: order.status === 'SHIPPING' ? '1px solid #9c27b0' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} /> Đang giao hàng
              </button>
              <button onClick={() => handleStatusChange('DELIVERED')} style={{ padding: '10px', background: order.status === 'DELIVERED' ? 'rgba(76, 175, 80, 0.2)' : 'var(--bg-surface)', color: order.status === 'DELIVERED' ? '#4caf50' : 'var(--text)', border: order.status === 'DELIVERED' ? '1px solid #4caf50' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> Đã giao hàng
              </button>
              <button onClick={() => handleStatusChange('CANCELLED')} style={{ padding: '10px', background: order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)', color: order.status === 'CANCELLED' ? '#ef4444' : 'var(--text)', border: order.status === 'CANCELLED' ? '1px solid #ef4444' : 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <p style={{ fontWeight: 'bold', color: 'var(--text)' }}>{order.shipping_address?.full_name || order.user?.full_name || 'Khách vãng lai'}</p>
              <p>{order.user?.email || 'Chưa cập nhật email'}</p>
              <p>{order.shipping_address?.phone || 'Chưa cập nhật SĐT'}</p>
            </div>
            
            <hr style={{ borderColor: 'var(--border)', margin: '16px 0' }} />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={16} color="#94a3b8" style={{ flexShrink: 0, marginTop: '4px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {order.shipping_address ? `${order.shipping_address.address_line}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.city}` : 'Không có địa chỉ'}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--cyan)" /> Thanh toán
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Phương thức</span>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{order.payment_method || 'Chưa rõ'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Trạng thái</span>
              {order.payment_status === 'PAID' ? (
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
