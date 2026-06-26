import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Power, PowerOff, X, Percent, DollarSign, ShoppingCart } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: '',
    discount_amount: '',
    min_order_value: 0,
    is_active: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPromotions();
      setCoupons(res.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách mã giảm giá:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.discount_percent && !formData.discount_amount) {
      alert('Vui lòng nhập phần trăm giảm HOẶC số tiền giảm!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().replace(/\s+/g, ''),
        discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : null,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        min_order_value: parseFloat(formData.min_order_value || 0)
      };

      await adminApi.createPromotion(payload);
      
      setShowModal(false);
      setFormData({ code: '', discount_percent: '', discount_amount: '', min_order_value: 0, is_active: true });
      fetchCoupons();
    } catch (error) {
      console.error('Lỗi tạo mã giảm giá:', error);
      alert(error.response?.data?.detail || 'Tạo mã giảm giá thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminApi.togglePromotionStatus(id);
      fetchCoupons();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      await adminApi.deletePromotion(id);
      fetchCoupons();
    } catch (error) {
      console.error('Lỗi xóa mã:', error);
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Ticket size={28} color="#eab308" /> Mã Giảm Giá
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tạo và quản lý các coupon khuyến mãi cho khách hàng.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#eab308', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Tạo Mã Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Mã CODE</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Mức Giảm</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Đơn Tối Thiểu</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Trạng Thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-yellow-500"></div></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có mã giảm giá nào</td></tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'inline-block', background: 'rgba(234, 179, 8, 0.1)', border: '1px dashed #eab308',
                      color: '#eab308', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '2px'
                    }}>
                      {coupon.code}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '15px' }}>
                    {coupon.discount_percent ? `${coupon.discount_percent}%` : `${coupon.discount_amount?.toLocaleString('vi-VN')}đ`}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    {coupon.min_order_value > 0 ? `${coupon.min_order_value.toLocaleString('vi-VN')}đ` : 'Không yêu cầu'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: coupon.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: coupon.is_active ? '#22c55e' : '#ef4444'
                    }}>
                      {coupon.is_active ? 'Đang bật' : 'Đã tắt'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleToggle(coupon.id)}
                      title={coupon.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: coupon.is_active ? '#ef4444' : '#22c55e', padding: '8px', borderRadius: '8px' }}
                    >
                      {coupon.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      title="Xóa mã"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#eab308' }}>Tạo Mã Giảm Giá Mới</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '20px' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Mã CODE *</label>
                <div style={{ position: 'relative' }}>
                  <Ticket size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" required
                    placeholder="VD: SALE10, FREESHIP..."
                    value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Giảm theo %</label>
                  <div style={{ position: 'relative' }}>
                    <Percent size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="number" min="0" max="100" step="1"
                      placeholder="VD: 10" disabled={!!formData.discount_amount}
                      value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', background: formData.discount_amount ? 'var(--border)' : 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Giảm tiền mặt (đ)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="number" min="0" step="1000"
                      placeholder="VD: 50000" disabled={!!formData.discount_percent}
                      value={formData.discount_amount} onChange={e => setFormData({...formData, discount_amount: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', background: formData.discount_percent ? 'var(--border)' : 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Giá trị đơn tối thiểu (đ)</label>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="number" min="0" step="1000"
                    value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: '#eab308', border: 'none', color: '#000', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {isSubmitting ? 'Đang tạo...' : 'Lưu Mã Giảm Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
