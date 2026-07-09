import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock3, CheckCircle, Truck, MapPin, CreditCard, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageSkeleton from '../../components/ui/PageSkeleton';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          // Handle error, e.g., order not found
          navigate('/profile');
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return <PageSkeleton variant="order" />;
  }

  if (!order) return null;

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="status-badge status-warning text-sm"><Clock3 size={16} /> Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="status-badge status-info text-sm"><CheckCircle size={16} /> Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="status-badge status-info text-sm"><Truck size={16} /> Đang giao</span>;
      case 'DELIVERED':
        return <span className="status-badge status-success text-sm"><CheckCircle size={16} /> Đã giao</span>;
      case 'CANCELLED':
        return <span className="status-badge status-danger text-sm"><CheckCircle size={16} /> Đã hủy</span>;
      default:
        return <span className="status-badge text-sm">{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0', backgroundColor: 'var(--bg-page)' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <Link to="/profile" state={{ activeTab: 'orders' }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Quay lại danh sách đơn hàng
          </Link>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 8px 0', color: 'var(--text)' }}>
                Đơn hàng <span style={{ color: 'var(--cyan)' }}>#{order.id.split('-')[0].toUpperCase()}</span>
              </h1>
              <p style={{ fontSize: '16px', margin: 0, color: 'var(--text-muted)' }}>
                Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}
              </p>
            </div>
            
            <div>
              <div style={{ 
                     display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                     borderRadius: '9999px', fontSize: '14px', fontWeight: 'bold', 
                     border: '1px solid', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                     backgroundColor: order.status === 'DELIVERED' ? 'var(--cyan-dim)' : order.status === 'CANCELLED' ? 'var(--pink-dim)' : 'var(--bg-surface)', 
                     color: order.status === 'DELIVERED' ? 'var(--cyan)' : order.status === 'CANCELLED' ? 'var(--pink)' : 'var(--text)',
                     borderColor: order.status === 'DELIVERED' ? 'var(--cyan)' : order.status === 'CANCELLED' ? 'var(--pink)' : 'var(--border)'
                   }}>
                <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
                  {(order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'SHIPPING') && (
                    <span className="animate-ping" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', opacity: 0.75, backgroundColor: 'var(--text)' }}></span>
                  )}
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '10px', height: '10px', backgroundColor: 'currentColor' }}></span>
                </span>
                {order.status === 'PENDING' ? 'Đang chờ xử lý' :
                 order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                 order.status === 'SHIPPING' ? 'Đang vận chuyển' :
                 order.status === 'DELIVERED' ? 'Giao hàng thành công' :
                 order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stepper - Clean & Minimalist */}
        {order.status !== 'CANCELLED' && (
          <div style={{ marginBottom: '48px', padding: '40px 0', borderRadius: '24px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
              {/* Background Line */}
              <div style={{ position: 'absolute', top: '24px', left: '12%', right: '12%', height: '4px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px', zIndex: 0 }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                {['Đặt hàng', 'Xác nhận', 'Vận chuyển', 'Hoàn thành'].map((step, idx) => {
                  const statusMapToIdx = { 'PENDING': 0, 'CONFIRMED': 1, 'SHIPPING': 2, 'DELIVERED': 3 };
                  const currentIdx = statusMapToIdx[order.status] || 0;
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', gap: '12px', background: 'transparent' }}>
                      <div style={{ 
                             width: '48px', height: '48px', borderRadius: '50%', 
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             backgroundColor: isCompleted ? 'var(--cyan)' : 'var(--bg-card)',
                             border: isCompleted ? 'none' : '2px solid var(--border)',
                             color: isCompleted ? '#000' : 'var(--text-muted)',
                             boxShadow: isCompleted ? '0 0 20px var(--cyan-glow)' : 'none',
                             transition: 'all 0.5s ease', zIndex: 10
                           }}>
                        {idx === 0 && <FileText size={20} />}
                        {idx === 1 && <Clock3 size={20} />}
                        {idx === 2 && <Truck size={20} />}
                        {idx === 3 && <CheckCircle size={20} />}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', textAlign: 'center',
                              color: isCurrent ? 'var(--cyan)' : isCompleted ? 'var(--text)' : 'var(--text-muted)',
                              textShadow: isCurrent ? '0 0 10px var(--cyan-dim)' : 'none' }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* MAIN CONTENT: Products & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: '1 / -1' }}>
            
            {/* Products Card */}
            <div style={{ borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>
                  Sản phẩm đã mua ({order.items.length})
                </h2>
              </div>
              
              <div>
                {order.items.map((item, idx) => (
                  <div key={item.id} style={{ 
                        padding: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px',
                        borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid var(--border)' 
                      }}>
                    {/* Compact Image */}
                    <div style={{ 
                           width: '64px', height: '64px', flexShrink: 0,
                           borderRadius: '12px', border: '1px solid var(--border)', 
                           display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: '#fff' 
                         }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Package size={24} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <Link to={`/product/${item.sku_code.replace('-sku', '')}`} style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.4', textDecoration: 'none', color: 'var(--text)' }}>
                        {item.product_name}
                      </Link>
                      <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                        Mã SP: {item.sku_code}
                      </p>
                    </div>

                    {/* Price Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', textAlign: 'right', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text)' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_purchase)}
                        </p>
                        <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-muted)' }}>Số lượng: {item.quantity}</p>
                      </div>
                      <div style={{ width: '112px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0', color: 'var(--text-muted)' }}>Thành tiền</p>
                        <p style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: 'var(--cyan)' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_purchase * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Timeline Card */}
            <div style={{ borderRadius: '24px', border: '1px solid var(--border)', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: 'var(--bg-card)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 32px 0', color: 'var(--text)' }}>
                Nhật ký đơn hàng
              </h2>
              <div style={{ position: 'relative', paddingLeft: '16px', borderLeft: '2px solid var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {order.status_history?.map((hist, idx) => {
                  const isLast = idx === order.status_history.length - 1;
                  return (
                    <div key={idx} style={{ position: 'relative' }}>
                      {/* Timeline Dot */}
                      <div style={{ 
                             position: 'absolute', left: '-25px', top: '2px', width: '16px', height: '16px', 
                             borderRadius: '50%', border: '3px solid',
                             backgroundColor: isLast ? 'var(--cyan)' : 'var(--bg-card)', 
                             borderColor: isLast ? 'var(--cyan)' : 'var(--border)'
                           }}></div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', paddingLeft: '16px' }}>
                        <p style={{ fontSize: '14px', minWidth: '140px', margin: 0, color: 'var(--text-muted)' }}>
                          {new Date(hist.created_at).toLocaleString('vi-VN')}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '500', margin: 0, opacity: isLast ? 1 : 0.7, color: isLast ? 'var(--cyan)' : 'var(--text)' }}>
                          {hist.description || hist.status}
                        </p>
                      </div>
                    </div>
                  );
                }) || (
                  <p style={{ fontSize: '14px', margin: 0, color: 'var(--text-muted)' }}>Chưa có lịch sử cập nhật.</p>
                )}
              </div>
            </div>

          </div>

          {/* SIDEBAR: Info & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridColumn: '1 / -1' }}>
            
            {/* Delivery Info */}
            <div style={{ borderRadius: '24px', border: '1px solid var(--border)', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <MapPin size={20} style={{ color: 'var(--cyan)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>Địa chỉ nhận hàng</h3>
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' }}>{user?.fullName}</p>
                  <p style={{ fontWeight: '500', margin: 0, color: 'var(--text-muted)' }}>{user?.phone || '0988 123 456'}</p>
                </div>
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ margin: 0 }}>
                    {order.shipping_address ? (
                      `${order.shipping_address.address_line}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.city}`
                    ) : '123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ borderRadius: '24px', border: '1px solid var(--border)', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <CreditCard size={20} style={{ color: 'var(--pink)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>Thanh toán</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phương thức</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                    {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.payment_method}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Trạng thái</span>
                  <span style={{ 
                          fontWeight: 'bold', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px',
                          backgroundColor: order.payment_status === 'PAID' ? 'var(--cyan-dim)' : 'var(--bg-surface)',
                          color: order.payment_status === 'PAID' ? 'var(--cyan)' : 'var(--text-muted)'
                        }}>
                    {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div style={{ borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-card)' }}>
              {/* Top Accent Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: 'var(--cyan)' }}></div>
              
              <div style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px 0', color: 'var(--text)' }}>Tóm tắt đơn hàng</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tổng tiền hàng</span>
                    <span style={{ fontWeight: '600', color: 'var(--text)' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount - order.shipping_fee + order.discount_amount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển</span>
                    <span style={{ fontWeight: '600', color: 'var(--text)' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shipping_fee)}
                    </span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--cyan)' }}>Giảm giá khuyến mãi</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount_amount)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text)' }}>Tổng cộng</span>
                    <span style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--pink)' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', textAlign: 'right', margin: 0, color: 'var(--text-muted)' }}>(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
