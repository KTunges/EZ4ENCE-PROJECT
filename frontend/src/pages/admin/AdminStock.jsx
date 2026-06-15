import React, { useState, useEffect } from 'react';
import { FileText, Plus, ArrowDownToLine, ArrowUpFromLine, Trash2, X } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function AdminStock() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'IN', // 'IN' or 'OUT'
    supplier_id: '',
    note: '',
    items: [] // { sku_id, quantity, unit_price }
  });

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const [resRec, resSup, resInv] = await Promise.all([
        adminApi.getStockReceipts(),
        adminApi.getSuppliers(),
        adminApi.getInventory()
      ]);
      setReceipts(resRec.data || resRec);
      setSuppliers((resSup.data || resSup).filter(s => s.is_active));
      setInventory(resInv.data || resInv);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu phiếu kho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  const openAddModal = () => {
    setFormData({ type: 'IN', supplier_id: '', note: '', items: [] });
    setShowModal(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { sku_id: '', quantity: 1, unit_price: 0 }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm vào phiếu!');
      return;
    }
    // Validation
    for (let item of formData.items) {
      if (!item.sku_id) return alert('Vui lòng chọn sản phẩm!');
      if (item.quantity <= 0) return alert('Số lượng phải lớn hơn 0');
      if (item.unit_price < 0) return alert('Đơn giá không hợp lệ');
    }

    try {
      setIsSubmitting(true);
      const payload = { ...formData };
      if (payload.type === 'OUT') payload.supplier_id = null;

      await adminApi.createStockReceipt(payload);
      setShowModal(false);
      fetchReceipts();
    } catch (error) {
      alert(error.response?.data?.detail || 'Lưu phiếu thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} color="var(--cyan)" /> Phiếu Nhập / Xuất Kho
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Quản lý lịch sử nhập xuất và cập nhật tồn kho.</p>
        </div>
        <button onClick={openAddModal} style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> Tạo Phiếu Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Mã Phiếu</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Loại Phiếu</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Ngày tạo</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Người tạo</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
            ) : receipts.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Chưa có phiếu nào</td></tr>
            ) : (
              receipts.map(rec => (
                <tr key={rec.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>{rec.receipt_code}</td>
                  <td style={{ padding: '16px' }}>
                    {rec.type === 'IN' ? (
                      <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '12px', background: 'rgba(34,197,94,0.1)', padding: '4px 8px', borderRadius: '12px', width: 'max-content' }}>
                        <ArrowDownToLine size={14} /> Nhập Kho
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '12px', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '12px', width: 'max-content' }}>
                        <ArrowUpFromLine size={14} /> Xuất Kho
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(rec.created_at).toLocaleString('vi-VN')}</td>
                  <td style={{ padding: '16px' }}>{rec.created_by}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>{rec.total_amount.toLocaleString('vi-VN')}đ</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '800px', borderRadius: '16px', border: '1px solid var(--border)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', color: 'var(--text)' }}>Tạo Phiếu Kho Mới</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Loại phiếu *</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  >
                    <option value="IN">Phiếu Nhập (Mua hàng)</option>
                    <option value="OUT">Phiếu Xuất (Trả hàng, Hư hỏng...)</option>
                  </select>
                </div>
                {formData.type === 'IN' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Nhà Cung Cấp *</label>
                    <select 
                      required value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                    >
                      <option value="">-- Chọn Nhà cung cấp --</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Ghi chú</label>
                <input 
                  type="text" placeholder="Lý do nhập/xuất..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', margin: 0 }}>Danh sách Sản phẩm</h3>
                  <button type="button" onClick={handleAddItem} style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--cyan)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <Plus size={14} /> Thêm Dòng
                  </button>
                </div>
                
                {formData.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 2 }}>
                      <select 
                        required value={item.sku_id} onChange={e => handleItemChange(index, 'sku_id', e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
                      >
                        <option value="">-- Chọn SKU --</option>
                        {inventory.map(inv => (
                          <option key={inv.sku_id} value={inv.sku_id}>{inv.product_name} - {inv.sku_name} (Tồn: {inv.stock})</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="number" required min="1" placeholder="Số lượng"
                        value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="number" required min="0" placeholder="Đơn giá"
                        value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '8px', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '16px' }}>
                  Tổng tiền: <span style={{ fontWeight: 'bold', color: 'var(--cyan)', fontSize: '20px' }}>
                    {formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg)', border: '1px solid var(--border-hover)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Hủy bỏ</button>
              <button onClick={handleSave} disabled={isSubmitting} style={{ padding: '10px 20px', background: '#38bdf8', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.3)' }}>{isSubmitting ? 'Đang lưu...' : 'Hoàn Tất Phiếu'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
