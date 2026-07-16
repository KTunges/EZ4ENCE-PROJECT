import { useState, useEffect, useRef } from 'react';
import { Plus, Eye, Search, X, Download, ChevronDown } from 'lucide-react';
import { getStockReceipts, createStockReceipt, getSuppliers, getInventorySkus, exportReceiptExcel } from '../../services/adminApi';

const SearchableSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue || placeholder}
        </span>
        <ChevronDown size={14} style={{ flexShrink: 0, marginLeft: '8px' }} />
      </div>
      
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
            <input 
              autoFocus
              type="text" 
              placeholder="Tìm kiếm..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ width: '100%', padding: '6px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy</div>
            ) : filteredOptions.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }}
                style={{ padding: '8px', cursor: 'pointer', background: opt.value === value ? 'rgba(0, 229, 255, 0.1)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = opt.value === value ? 'rgba(0, 229, 255, 0.1)' : 'transparent'}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
    setFormData({ 
      type: 'IN', 
      supplier_id: '', 
      note: '', 
      items: [{ sku_id: '', quantity: 1, unit_price: 0 }] 
    });
    setShowModal(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { sku_id: '', quantity: 1, unit_price: 0 }]
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
    
    // Tự động điền giá hiện tại của sản phẩm
    if (field === 'sku_id') {
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

  const getAvailableSkus = () => {
    if (formData.type === 'OUT' || !formData.supplier_id) return skus;
    const supplier = suppliers.find(s => s.id === formData.supplier_id);
    if (!supplier || !supplier.brand_id) return skus;
    return skus.filter(sku => sku.brand_id === supplier.brand_id);
  };
  const availableSkus = getAvailableSkus();

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
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không có phiếu nào</td></tr>
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
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button title="Xuất file Excel (TT133)" onClick={async () => { try { const blob = await exportReceiptExcel(r.id); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${r.receipt_code}.xlsx`; a.click(); window.URL.revokeObjectURL(url); } catch (e) { alert('Lỗi xuất file Excel'); console.error(e); } }} style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', color: '#4caf50', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <Download size={14} /> Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px' }}>
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
                            <SearchableSelect 
                              value={item.sku_id}
                              onChange={val => handleItemChange(index, 'sku_id', val)}
                              options={availableSkus.map(s => ({ value: s.sku_id, label: `[${s.sku_code}] - ${s.product_name}` }))}
                              placeholder="-- Chọn sản phẩm --"
                            />
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
