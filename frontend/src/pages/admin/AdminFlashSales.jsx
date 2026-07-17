import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, X, Search, Zap, Power, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/adminApi';

export default function AdminFlashSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '', start_time: '', end_time: '', is_active: true
  });
  const [editingSaleId, setEditingSaleId] = useState(null);

  const [itemForm, setItemForm] = useState({
    product_sku_id: '', flash_price: '', quantity: ''
  });

  // ── Fetch ──
  const fetchSales = async () => {
    try {
      const res = await adminApi.get('/admin/flash-sales');
      setSales(res.data);
    } catch (error) {
      addToast('Lỗi khi tải danh sách Flash Sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (q = '') => {
    try {
      const res = await adminApi.get('/admin/products/search-skus', { params: { search: q } });
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  // ── Handlers ──
  const openEditModal = (sale) => {
    setEditingSaleId(sale.id);
    const formatLocalTime = (isoString) => {
      const d = new Date(isoString);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };
    
    setFormData({
      name: sale.name,
      start_time: formatLocalTime(sale.start_time),
      end_time: formatLocalTime(sale.end_time),
      is_active: sale.is_active
    });
    setShowCreateModal(true);
  };

  const handleCreateSale = async (e) => {
    e.preventDefault();
    try {
      if (new Date(formData.start_time) >= new Date(formData.end_time)) {
        return addToast('Thời gian kết thúc phải sau thời gian bắt đầu', 'error');
      }
      
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      };

      if (editingSaleId) {
        await adminApi.put(`/admin/flash-sales/${editingSaleId}`, payload);
        addToast('Cập nhật chiến dịch thành công!', 'success');
      } else {
        await adminApi.post('/admin/flash-sales', payload);
        addToast('Tạo chiến dịch thành công!', 'success');
      }
      
      setShowCreateModal(false);
      setEditingSaleId(null);
      setFormData({ name: '', start_time: '', end_time: '', is_active: true });
      fetchSales();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Lỗi lưu chiến dịch', 'error');
    }
  };

  const handleToggleActive = async (sale) => {
    try {
      await adminApi.put(`/admin/flash-sales/${sale.id}`, { is_active: !sale.is_active });
      addToast(sale.is_active ? 'Đã tắt chiến dịch' : 'Đã bật chiến dịch', 'success');
      fetchSales();
    } catch (error) {
      addToast('Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa chiến dịch này?')) return;
    try {
      await adminApi.delete(`/admin/flash-sales/${id}`);
      addToast('Đã xóa chiến dịch', 'success');
      fetchSales();
    } catch (error) {
      addToast('Lỗi khi xóa', 'error');
    }
  };

  const openItemModal = (sale) => {
    setSelectedSale(sale);
    setShowItemModal(true);
    setSearchQuery('');
    fetchProducts();
  };

  const [addingItem, setAddingItem] = useState(null);

  const handleAddItem = (sku, product) => {
    if (!selectedSale) return;
    setAddingItem({ sku, product });
    setItemForm({ 
      flash_price: Math.round(sku.price * 0.5), 
      quantity: Math.min(10, sku.stock_quantity || 10) 
    });
  };

  const submitAddItem = async (e) => {
    e.preventDefault();
    if (!selectedSale || !addingItem) return;
    
    try {
      await adminApi.post(`/admin/flash-sales/${selectedSale.id}/items`, {
        product_sku_id: addingItem.sku.id,
        flash_price: Number(itemForm.flash_price),
        quantity: Number(itemForm.quantity)
      });
      addToast('Đã thêm sản phẩm vào Flash Sale!', 'success');
      fetchSales();
      setAddingItem(null);
      // Refresh selected sale
      const res = await adminApi.get('/admin/flash-sales');
      const updated = res.data.find(s => s.id === selectedSale.id);
      if (updated) setSelectedSale(updated);
    } catch (error) {
      addToast(error.response?.data?.detail || 'Lỗi thêm sản phẩm', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!selectedSale) return;
    try {
      await adminApi.delete(`/admin/flash-sales/${selectedSale.id}/items/${itemId}`);
      addToast('Đã xóa sản phẩm khỏi Flash Sale', 'success');
      fetchSales();
      const res = await adminApi.get('/admin/flash-sales');
      const updated = res.data.find(s => s.id === selectedSale.id);
      if (updated) setSelectedSale(updated);
    } catch (error) {
      addToast('Lỗi xóa sản phẩm', 'error');
    }
  };

  const getSaleStatus = (sale) => {
    const now = new Date();
    const start = new Date(sale.start_time);
    const end = new Date(sale.end_time);
    if (!sale.is_active) return { label: 'Đã tắt', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
    if (now < start) return { label: 'Sắp diễn ra', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    if (now > end) return { label: 'Đã kết thúc', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
    return { label: 'Đang diễn ra', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' };
  };

  // ── Styles ──
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' };

  // ── Render ──
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>⚡ Quản lý Flash Sale</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '14px' }}>Thiết lập chiến dịch, thêm sản phẩm, bật/tắt trạng thái</p>
        </div>
        <button onClick={() => { setEditingSaleId(null); setFormData({ name: '', start_time: '', end_time: '', is_active: true }); setShowCreateModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
          <Plus size={18} /> Tạo chiến dịch
        </button>
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)' }}>
              {['Tên chiến dịch', 'Thời gian', 'Trạng thái', 'Sản phẩm', 'Bật/Tắt', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontWeight: '600', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Zap size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <p style={{ margin: 0, fontWeight: '600' }}>Chưa có chiến dịch Flash Sale nào</p>
                  <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Bấm "Tạo chiến dịch" để bắt đầu</p>
                </td>
              </tr>
            ) : sales.map(sale => {
              const status = getSaleStatus(sale);
              return (
                <tr key={sale.id} style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--text)' }}>{sale.name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Calendar size={14} /> Bắt đầu: {new Date(sale.start_time).toLocaleString('vi-VN')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> Kết thúc: {new Date(sale.end_time).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => openItemModal(sale)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      <Package size={14} /> {sale.items?.length || 0} sản phẩm
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => handleToggleActive(sale)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '24px', borderRadius: '12px', background: sale.is_active ? '#22c55e' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: sale.is_active ? '18px' : '2px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditModal(sale)} style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Sửa chiến dịch">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(sale.id)} style={{ padding: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Xóa chiến dịch">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ══ Modal: Tạo chiến dịch ══ */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }} onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} style={{ width: '480px', padding: '32px', borderRadius: '24px', background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-card) 100%)', border: '1px solid var(--border)', boxShadow: '0 25px 80px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
              {/* Decorative elements */}
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }} />
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }} />
              
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <X size={16} />
              </button>
              
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} /> 
                </div>
                {editingSaleId ? 'Cập Nhật Chiến Dịch' : 'Tạo Chiến Dịch Mới'}
              </h2>
              
              <form onSubmit={handleCreateSale} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>Tên chiến dịch <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Siêu Sale Nửa Đêm" style={inputStyle} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>Bắt đầu <span style={{ color: '#ef4444' }}>*</span></label>
                    <input required type="datetime-local" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>Kết thúc <span style={{ color: '#ef4444' }}>*</span></label>
                    <input required type="datetime-local" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </div>
                
                <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', padding: '16px', borderRadius: '12px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', color: 'var(--text)', fontWeight: '600' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }} />
                      <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: formData.is_active ? '#3b82f6' : 'var(--border)', transition: 'background 0.3s', position: 'relative' }}>
                        <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: formData.is_active ? '23px' : '3px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                      </div>
                    </div>
                    {formData.is_active ? <span style={{ color: '#3b82f6' }}>Đang kích hoạt</span> : <span>Không kích hoạt</span>}
                  </label>
                  <p style={{ margin: '8px 0 0 56px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Chiến dịch sẽ hiển thị ngay nếu thời gian hợp lệ.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '14px', background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                    HỦY
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59,130,246,0.3)', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)'; }}>
                    {editingSaleId ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ Modal: Quản lý sản phẩm trong Flash Sale ══ */}
      <AnimatePresence>
        {showItemModal && selectedSale && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowItemModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ width: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', background: 'var(--bg-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>
                  📦 Sản phẩm trong "{selectedSale.name}"
                </h2>
                <button onClick={() => setShowItemModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Danh sách sản phẩm đã thêm */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
                  Đã thêm ({selectedSale.items?.length || 0})
                </h3>
                {(!selectedSale.items || selectedSale.items.length === 0) ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '10px', border: '1px dashed var(--border)' }}>
                    Chưa có sản phẩm nào. Tìm và thêm sản phẩm bên dưới.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedSale.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: '600', color: 'var(--text)', fontSize: '14px' }}>
                            {item.sku?.product?.name || item.product_sku_id}
                          </span>
                          {item.sku?.sku_code && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>({item.sku.sku_code})</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{Number(item.flash_price).toLocaleString('vi-VN')}đ</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Đã bán {item.sold}/{item.quantity}</div>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)} style={{ padding: '6px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tìm kiếm & thêm sản phẩm */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>Thêm sản phẩm</h3>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" placeholder="Tìm tên sản phẩm..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); fetchProducts(e.target.value); }}
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                  />
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {products.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      {searchQuery ? 'Không tìm thấy sản phẩm' : 'Nhập tên để tìm kiếm'}
                    </div>
                  ) : products.map(p => (
                    <div key={p.id}>
                      {(p.skus || []).map(sku => {
                        const alreadyAdded = selectedSale.items?.some(i => i.product_sku_id === sku.id);
                        return (
                          <div key={sku.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: alreadyAdded ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)', borderRadius: '8px', border: `1px solid ${alreadyAdded ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, marginBottom: '4px' }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: '600', color: 'var(--text)', fontSize: '13px' }}>{p.name}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>({sku.sku_code})</span>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                                Giá: {Number(sku.price).toLocaleString('vi-VN')}đ • Kho: {sku.stock_quantity}
                              </div>
                            </div>
                            {alreadyAdded ? (
                              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>✓ Đã thêm</span>
                            ) : (
                              <button onClick={() => handleAddItem(sku, p)} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                + Thêm
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ Modal: Thiết lập Giá & Số lượng Flash Sale ══ */}
      <AnimatePresence>
        {addingItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(8px)' }} onClick={() => setAddingItem(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} style={{ width: '400px', padding: '32px', borderRadius: '24px', background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-card) 100%)', border: '1px solid var(--border)', boxShadow: '0 25px 80px rgba(0,0,0,0.5)', position: 'relative' }}>
              <button type="button" onClick={() => setAddingItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 1, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <X size={16} />
              </button>
              
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#ef4444" />
                Thiết lập Flash Sale
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text)' }}>{addingItem.product.name}</strong><br/>
                Phiên bản: {addingItem.sku.sku_code}
              </p>
              
              <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Giá gốc</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)', textDecoration: 'line-through' }}>{Number(addingItem.sku.price).toLocaleString('vi-VN')}đ</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(34,197,94,0.2)' }} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Tồn kho hiện tại</div>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#22c55e' }}>{addingItem.sku.stock_quantity || 0} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>sản phẩm</span></div>
                </div>
              </div>

              <form onSubmit={submitAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>Giá Flash Sale (VNĐ) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="number" min="0" max={addingItem.sku.price} value={itemForm.flash_price} onChange={e => setItemForm({ ...itemForm, flash_price: e.target.value })} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: 'var(--text)' }}>Số lượng suất Flash Sale <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="number" min="1" max={addingItem.sku.stock_quantity || 9999} value={itemForm.quantity} onChange={e => setItemForm({ ...itemForm, quantity: e.target.value })} style={inputStyle} onFocus={e => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setAddingItem(null)} style={{ flex: 1, padding: '14px', background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                    HỦY
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.3)', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,0.3)'; }}>
                    XÁC NHẬN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
