import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Power, PowerOff, X, Percent, DollarSign, ShoppingCart, Clock, Users, Hash, ArrowDown } from 'lucide-react';
import { getPromotions, createPromotion, togglePromotionStatus, deletePromotion } from '../../services/adminApi';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: '',
    discount_amount: '',
    max_discount_amount: '',
    min_order_value: 0,
    usage_limit: '',
    usage_limit_per_user: 1,
    start_date: '',
    expiration_date: '',
    is_active: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await getPromotions();
      setCoupons(res);
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
        code: formData.code.toUpperCase().replace(/\s+/g, ''),
        discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : null,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        min_order_value: parseFloat(formData.min_order_value || 0),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_limit_per_user: parseInt(formData.usage_limit_per_user || 1),
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        expiration_date: formData.expiration_date ? new Date(formData.expiration_date).toISOString() : null,
        is_active: formData.is_active
      };

      await createPromotion(payload);
      
      setShowModal(false);
      setFormData({ code: '', discount_percent: '', discount_amount: '', max_discount_amount: '', min_order_value: 0, usage_limit: '', usage_limit_per_user: 1, start_date: '', expiration_date: '', is_active: true });
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
      await togglePromotionStatus(id);
      fetchCoupons();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      await deletePromotion(id);
      fetchCoupons();
    } catch (error) {
      console.error('Lỗi xóa mã:', error);
    }
  };

  const formatPrice = (value) => {
    if (!value && value !== 0) return '—';
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getPromoStatus = (coupon) => {
    const now = new Date();
    if (!coupon.is_active) return { label: 'Đã tắt', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
    if (coupon.expiration_date && new Date(coupon.expiration_date) < now) return { label: 'Hết hạn', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' };
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) return { label: 'Hết lượt', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' };
    if (coupon.start_date && new Date(coupon.start_date) > now) return { label: 'Chưa bắt đầu', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
    return { label: 'Đang hoạt động', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' };
  };

  const getDiscountLabel = (coupon) => {
    if (coupon.discount_percent) {
      let label = `${coupon.discount_percent}%`;
      if (coupon.max_discount_amount) {
        label += ` (tối đa ${formatPrice(coupon.max_discount_amount)})`;
      }
      return label;
    }
    return formatPrice(coupon.discount_amount);
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
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Lượt dùng</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thời gian</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Trạng Thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-yellow-500"></div></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có mã giảm giá nào</td></tr>
            ) : (
              coupons.map(coupon => {
                const status = getPromoStatus(coupon);
                return (
                  <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'inline-block', background: 'rgba(234, 179, 8, 0.1)', border: '1px dashed #eab308',
                        color: '#eab308', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', letterSpacing: '2px'
                      }}>
                        {coupon.code}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', fontSize: '14px' }}>
                      {getDiscountLabel(coupon)}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      {coupon.min_order_value > 0 ? formatPrice(coupon.min_order_value) : 'Không yêu cầu'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 'bold', color: coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit ? '#ef4444' : 'var(--text)' }}>
                          {coupon.usage_count}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          / {coupon.usage_limit !== null ? coupon.usage_limit : '∞'}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {coupon.usage_limit_per_user} lần/user
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div>{coupon.start_date ? formatDate(coupon.start_date) : 'Không giới hạn'}</div>
                      {(coupon.start_date || coupon.expiration_date) && <div style={{ margin: '2px 0', color: 'var(--text-muted)' }}>→</div>}
                      <div>{coupon.expiration_date ? formatDate(coupon.expiration_date) : 'Không giới hạn'}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                        background: status.bg, color: status.color
                      }}>
                        {status.label}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#eab308' }}>Tạo Mã Giảm Giá Mới</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '20px' }}>
              
              {/* Mã CODE */}
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

              {/* Giảm % và Giảm tiền */}
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

              {/* Giảm tối đa + Đơn tối thiểu */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <ArrowDown size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Giảm tối đa (đ)
                  </label>
                  <input 
                    type="number" min="0" step="1000"
                    placeholder="VD: 10000 (chỉ áp dụng khi giảm %)"
                    disabled={!formData.discount_percent}
                    value={formData.max_discount_amount} onChange={e => setFormData({...formData, max_discount_amount: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: !formData.discount_percent ? 'var(--border)' : 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Để trống = không giới hạn</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <ShoppingCart size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Đơn tối thiểu (đ)
                  </label>
                  <input 
                    type="number" min="0" step="1000"
                    value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                </div>
              </div>

              {/* Lượt sử dụng */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Hash size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Tổng lượt sử dụng
                  </label>
                  <input 
                    type="number" min="1" step="1"
                    placeholder="VD: 100 (trống = không giới hạn)"
                    value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Để trống = không giới hạn</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Mỗi user dùng tối đa
                  </label>
                  <input 
                    type="number" min="1" step="1"
                    value={formData.usage_limit_per_user} onChange={e => setFormData({...formData, usage_limit_per_user: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Mặc định: 1 lần</span>
                </div>
              </div>

              {/* Thời gian */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Bắt đầu
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Để trống = áp dụng ngay</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Hết hạn
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.expiration_date} onChange={e => setFormData({...formData, expiration_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Để trống = không hết hạn</span>
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
