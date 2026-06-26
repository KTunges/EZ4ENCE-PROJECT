import { useState, useEffect } from 'react';
import { Plus, Eye, Search, X } from 'lucide-react';
import { getStockReceipts, createStockReceipt, getSuppliers, getInventorySkus } from '../../services/adminApi';

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // For Modal
  const [showModal, setShowModal] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [skus, setSkus] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'IN',
    supplier_id: '',
    note: '',
    items: [] // { sku_id, quantity, unit_price }
  });

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await getStockReceipts();
      setReceipts(data);
    } catch (error) {
      console.error("Lỗi tải phiếu nhập/xuất:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDependencies = async () => {
    try {
      const [supData, skuData] = await Promise.all([getSuppliers(), getInventorySkus()]);
      setSuppliers(supData.filter(s => s.is_active));
      setSkus(skuData);
    } catch (error) {
      console.error("Lỗi tải data phụ:", error);
    }
  };

  useEffect(() => {
    fetchReceipts();
    loadDependencies();
  }, []);

  const handleCreateNew = () => {
    setFormData({ type: 'IN', supplier_id: '', note: '', items: [] });
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (skus.length === 0) return;
    setFormData({
      ...formData,
      items: [...formData.items, { sku_id: skus[0].sku_id, quantity: 1, unit_price: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Tự động điền giá nếu xuất kho
    if (field === 'sku_id' && formData.type === 'OUT') {
      const selectedSku = skus.find(s => s.sku_id === value);
      if (selectedSku) {
        newItems[index].unit_price = selectedSku.price;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm vào phiếu");
      return;
    }
    try {
      await createStockReceipt(formData);
      setShowModal(false);
      fetchReceipts();
    } catch (error) {
      alert("Lỗi khi lưu phiếu (Kiểm tra xem số lượng tồn kho có đủ xuất không)");
      console.error(error);
    }
  };

  const filtered = receipts.filter(r => {
    const matchSearch = r.receipt_code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (r.created_by || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'ALL' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Phiếu Nhập/Xuất kho</h1>
        <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Tạo phiếu mới
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo mã phiếu, người tạo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '10px 16px', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="ALL">Tất cả loại phiếu</option>
              <option value="IN">Phiếu Nhập</option>
              <option value="OUT">Phiếu Xuất</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Mã phiếu</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Loại</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tổng tiền</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Người tạo</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có phiếu nào</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{r.receipt_code}</td>
                  <td style={{ padding: '16px 12px' }}>
                    {r.type === 'IN' ? (
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>NHẬP KHO</span>
                    ) : (
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 152, 0, 0.2)', color: '#ff9800', fontSize: '12px', fontWeight: 'bold' }}>XUẤT KHO</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 12px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(r.total_amount)}</td>
                  <td style={{ padding: '16px 12px' }}>{r.created_by}</td>
                  <td style={{ padding: '16px 12px' }}>{new Date(r.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Tạo Phiếu Mới</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Loại phiếu</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value, supplier_id: ''})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}>
                    <option value="IN">Nhập kho (Mua hàng)</option>
                    <option value="OUT">Xuất kho (Khác)</option>
                  </select>
                </div>
                {formData.type === 'IN' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Nhà cung cấp</label>
                    <select required value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}>
                      <option value="">-- Chọn Nhà cung cấp --</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 'bold' }}>Danh sách sản phẩm</label>
                  <button type="button" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    <Plus size={14} /> Thêm dòng
                  </button>
                </div>
                
                {formData.items.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                    Chưa có sản phẩm nào
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-page)', fontSize: '12px' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Sản phẩm (SKU)</th>
                        <th style={{ padding: '8px', width: '100px' }}>Số lượng</th>
                        <th style={{ padding: '8px', width: '150px' }}>Đơn giá</th>
                        <th style={{ padding: '8px', width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px' }}>
                            <select value={item.sku_id} onChange={e => handleItemChange(index, 'sku_id', e.target.value)} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }}>
                              {skus.map(s => (
                                <option key={s.sku_id} value={s.sku_id}>[{s.sku_code}] - {s.product_name}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }} />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <input type="number" min="0" required value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }} />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <button type="button" onClick={() => handleRemoveItem(index)} style={{ color: '#f44336', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Ghi chú</label>
                <textarea rows="2" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--cyan)', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Tạo Phiếu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
