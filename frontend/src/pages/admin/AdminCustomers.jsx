import { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, Eye, X, Star } from 'lucide-react';
import { getCustomers, toggleCustomerActive, getCustomerDetails } from '../../services/adminApi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách khách hàng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    const action = currentStatus ? "Khóa" : "Mở khóa";
    if (await window.customConfirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
      try {
        await toggleCustomerActive(id);
        fetchCustomers();
        if (selectedCustomer && selectedCustomer.id === id) {
           setSelectedCustomer({...selectedCustomer, is_active: !currentStatus});
        }
      } catch (error) {
        window.toast.error("Có lỗi xảy ra khi thực hiện thao tác!");
        console.error(error);
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const data = await getCustomerDetails(id);
      setSelectedCustomer(data);
    } catch (error) {
      window.toast.error("Lỗi khi tải chi tiết khách hàng!");
      console.error(error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Khách hàng</h1>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '250px' }}>Khách hàng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Số điện thoại</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>Đơn hàng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Tổng chi tiêu</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có khách hàng nào</td></tr>
              ) : filteredCustomers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {user.fullName ? user.fullName.charAt(0) : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{user.fullName || 'Khách vãng lai'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{user.phone || 'Chưa cập nhật'}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{user.total_orders}</td>
                  <td style={{ padding: '16px 12px', color: '#f59e0b', fontWeight: 'bold' }}>{formatCurrency(user.total_spent)}</td>
                  <td style={{ padding: '16px 12px' }}>
                    {user.is_active ? (
                      <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Hoạt động</span>
                    ) : (
                      <span style={{ background: 'rgba(255, 23, 68, 0.1)', color: '#ff1744', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Bị khóa</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleViewDetails(user.id)} style={{ padding: '6px 12px', background: 'rgba(56, 189, 248, 0.1)', border: 'none', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }} title="Xem chi tiết">
                        <Eye size={14} /> Chi tiết
                      </button>
                      {user.is_active ? (
                        <button onClick={() => handleToggleActive(user.id, user.is_active)} style={{ padding: '6px 12px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }} title="Khóa tài khoản">
                          <ShieldAlert size={14} /> Khóa
                        </button>
                      ) : (
                        <button onClick={() => handleToggleActive(user.id, user.is_active)} style={{ padding: '6px 12px', background: 'rgba(34, 197, 94, 0.1)', border: 'none', color: '#22c55e', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }} title="Mở khóa tài khoản">
                          <ShieldCheck size={14} /> Mở khóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {(selectedCustomer || detailsLoading) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass" style={{ width: '800px', maxWidth: '95%', maxHeight: '90vh', background: 'var(--bg-card)', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Hồ sơ Khách hàng</h2>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {detailsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin chi tiết...</div>
              ) : selectedCustomer && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Basic Info */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>
                      {selectedCustomer.fullName ? selectedCustomer.fullName.charAt(0) : selectedCustomer.email.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text)' }}>{selectedCustomer.fullName || 'Chưa cập nhật tên'}</h3>
                      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <div>Email: <span style={{ color: 'var(--text)' }}>{selectedCustomer.email}</span></div>
                        <div>SĐT: <span style={{ color: 'var(--text)' }}>{selectedCustomer.phone || 'Chưa có'}</span></div>
                        <div>Tham gia: <span style={{ color: 'var(--text)' }}>{formatDate(selectedCustomer.createdAt)}</span></div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Tổng chi tiêu</div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b' }}>{formatCurrency(selectedCustomer.total_spent)}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* Addresses Info */}
                    <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', gridColumn: '1 / -1' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                        Sổ địa chỉ
                        <span style={{ background: 'var(--border)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{selectedCustomer.addresses?.length || 0}</span>
                      </h4>
                      {selectedCustomer.addresses?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                          {selectedCustomer.addresses.map(addr => (
                            <div key={addr.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: addr.is_default ? '2px solid #38bdf8' : '1px solid var(--border)', position: 'relative' }}>
                              {addr.is_default && <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#38bdf8', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>Mặc định</div>}
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{addr.full_name}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>SĐT: {addr.phone}</div>
                              <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                                {addr.address_line}, {addr.ward ? `${addr.ward}, ` : ''}{addr.district}, {addr.city}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>Chưa có địa chỉ nào được lưu</div>
                      )}
                    </div>

                    {/* Orders History */}
                    <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                        Lịch sử Đơn hàng
                        <span style={{ background: 'var(--border)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{selectedCustomer.orders?.length || 0}</span>
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                        {selectedCustomer.orders?.length > 0 ? selectedCustomer.orders.map(order => (
                          <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>{order.id.substring(0,8).toUpperCase()}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>{formatCurrency(order.total_amount)}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{order.status}</div>
                            </div>
                          </div>
                        )) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có đơn hàng nào</div>
                        )}
                      </div>
                    </div>

                    {/* Reviews History */}
                    <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                        Lịch sử Đánh giá
                        <span style={{ background: 'var(--border)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{selectedCustomer.reviews?.length || 0}</span>
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                        {selectedCustomer.reviews?.length > 0 ? selectedCustomer.reviews.map(review => (
                          <div key={review.id} style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--cyan)' }}>{review.product_name}</div>
                              <div style={{ display: 'flex', color: '#f59e0b' }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} color={i < review.rating ? "currentColor" : "var(--border-hover)"} />
                                ))}
                              </div>
                            </div>
                            <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text)' }}>
                              {review.comment || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Không có nội dung</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{formatDate(review.created_at)}</div>
                          </div>
                        )) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>Chưa có đánh giá nào</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
