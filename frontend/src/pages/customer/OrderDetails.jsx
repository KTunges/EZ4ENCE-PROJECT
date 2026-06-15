import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock3, CheckCircle, Truck, MapPin, CreditCard, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
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
    return <div className="min-h-screen pt-32 pb-20 flex justify-center"><div className="loader"></div></div>;
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

  const statusMap = {
    'PENDING': 0,
    'CONFIRMED': 1,
    'SHIPPING': 2,
    'DELIVERED': 3,
    'CANCELLED': -1
  };
  const currentStep = statusMap[order.status];

  return (
    <div className="min-h-screen pt-32 pb-20 fade-in">
      <div className="container max-w-5xl mx-auto px-4">
        
        <div className="mb-6">
          <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
            <ArrowLeft size={18} /> Quay lại danh sách đơn hàng
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Package className="text-cyan" /> Chi Tiết Đơn Hàng
              </h1>
              <div className="text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <span>Mã đơn: <strong className="text-white font-mono">{order.id.split('-')[0].toUpperCase()}</strong></span>
                <span>•</span>
                <span>Ngày đặt: <strong className="text-white">{new Date(order.created_at).toLocaleString('vi-VN')}</strong></span>
              </div>
            </div>
            <div>
              {renderStatusBadge(order.status)}
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Timeline & Items */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Timeline */}
              {order.status !== 'CANCELLED' && (
                <div className="p-6 border border-white/10 rounded-xl bg-black/20">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Clock3 size={18} /> Trạng thái đơn hàng</h3>
                  <div className="relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10"></div>
                    <div className="space-y-6">
                      {order.status_history?.length > 0 ? (
                        order.status_history.map((hist, index) => (
                          <div key={index} className="relative pl-12">
                            <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black
                              ${index === order.status_history.length - 1 ? 'border-cyan text-cyan' : 'border-white/20 text-white/50'}
                            `}>
                              <CheckCircle size={14} />
                            </div>
                            <div className="pt-1">
                              <h4 className={`font-medium ${index === order.status_history.length - 1 ? 'text-white' : 'text-gray-400'}`}>
                                {hist.description || hist.status}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{new Date(hist.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="relative pl-12">
                            <div className="absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black border-cyan text-cyan">
                              <CheckCircle size={14} />
                            </div>
                            <div className="pt-1">
                              <h4 className="font-medium text-white">Chờ xác nhận</h4>
                              <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'CANCELLED' && (
                <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/10 text-red-200">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">Đơn hàng đã bị hủy</h3>
                  <p className="text-sm opacity-80">Đơn hàng này đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn lại theo quy định.</p>
                </div>
              )}

              {/* Items */}
              <div className="p-6 border border-white/10 rounded-xl bg-black/20">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Package size={18} /> Sản phẩm</h3>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-white/5 rounded-lg bg-white/5">
                      <div className="w-20 h-20 bg-black/40 rounded flex-shrink-0 p-2">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.product_name} className="w-full h-full object-contain" />
                        ) : (
                          <Package className="w-full h-full text-white/20 p-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.sku_code.replace('-sku', '')}`} className="font-medium hover:text-cyan transition-colors line-clamp-2">
                          {item.product_name}
                        </Link>
                        <div className="text-sm text-gray-400 mt-1">Mã SP: {item.sku_code}</div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-cyan font-mono font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_purchase)}
                          </div>
                          <div className="text-sm text-gray-400">x{item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Info & Summary */}
            <div className="space-y-6">
              
              <div className="p-6 border border-white/10 rounded-xl bg-black/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin size={18} /> Địa chỉ nhận hàng</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="font-bold text-white text-base">{user?.fullName}</p>
                  <p>SĐT: {user?.phone || '0988123456'}</p>
                  <p className="leading-relaxed">
                    {/* fallback mock address if order.shipping_address isn't available yet */}
                    {order.shipping_address ? (
                      `${order.shipping_address.address_line}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.city}`
                    ) : '123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'}
                  </p>
                </div>
              </div>

              <div className="p-6 border border-white/10 rounded-xl bg-black/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={18} /> Thanh toán</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phương thức:</span>
                    <span className="font-medium text-white">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mã GD:</span>
                    <span className="font-mono text-cyan">
                      {order.payment_transaction_id || 'Chưa có'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tình trạng:</span>
                    <span className={`font-medium ${order.payment_status === 'PAID' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-white/10 rounded-xl bg-black/20">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={18} /> Tóm tắt đơn hàng</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tạm tính:</span>
                    <span className="text-white">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount - order.shipping_fee + order.discount_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phí vận chuyển:</span>
                    <span className="text-white">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shipping_fee)}
                    </span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Giảm giá:</span>
                      <span className="text-green-400">
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.discount_amount)}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-white font-medium">Tổng cộng:</span>
                    <span className="text-2xl font-mono font-bold text-cyan">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
