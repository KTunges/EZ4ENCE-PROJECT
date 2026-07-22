import { useState, useEffect } from 'react';
import { Search, History, Plus, Minus, X } from 'lucide-react';
import { getInventorySkus, getSkuHistory, createStockReceipt, getSuppliers } from '../../services/adminApi';

export default function AdminInventory() {
  const [skus, setSkus] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [historyModal, setHistoryModal] = useState({ show: false, sku: null, data: [], loading: false });
  const [receiptModal, setReceiptModal] = useState({ show: false, type: 'IN', sku: null, quantity: 1, unit_price: 0, supplier_id: '', note: '' });

  const fetchSkus = async () => {
    try {
      setLoading(true);
      const [skuData, supData] = await Promise.all([getInventorySkus(), getSuppliers()]);
      setSkus(skuData);
      setSuppliers(supData.filter(s => s.is_active));
    } catch (error) {
      console.error("Lỗi tải tồn kho:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkus();
  }, []);

  const openHistory = async (sku) => {
    setHistoryModal({ show: true, sku, data: [], loading: true });
    try {
      const historyData = await getSkuHistory(sku.sku_id);
      setHistoryModal({ show: true, sku, data: historyData, loading: false });
    } catch (error) {
      console.error("Lỗi lấy lịch sử:", error);
      setHistoryModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openReceipt = (sku, type) => {
    setReceiptModal({
      show: true, type, sku, quantity: 1, unit_price: type === 'OUT' ? sku.price : 0, supplier_id: '', note: ''
    });
  };

  const submitReceipt = async (e) => {
    e.preventDefault();
    if (receiptModal.quantity <= 0) return window.toast.info("Số lượng phải lớn hơn 0");
    if (receiptModal.type === 'IN' && !receiptModal.supplier_id) return window.toast.error("Vui lòng chọn nhà cung cấp");

    try {
      const payload = {
        type: receiptModal.type,
        supplier_id: receiptModal.type === 'IN' ? receiptModal.supplier_id : null,
        note: receiptModal.note || (receiptModal.type === 'IN' ? 'Nhập kho nhanh' : 'Xuất kho nhanh'),
        items: [{
          sku_id: receiptModal.sku.sku_id,
          quantity: parseInt(receiptModal.quantity),
          unit_price: parseFloat(receiptModal.unit_price)
        }]
      };
      await createStockReceipt(payload);
      setReceiptModal({ ...receiptModal, show: false });
      fetchSkus(); // refresh inventory
      window.toast.success(`Đã ${receiptModal.type === 'IN' ? 'nhập' : 'xuất'} kho thành công!`);
    } catch (error) {
      window.toast.error("Lỗi khi xử lý phiếu (Kiểm tra lại số lượng tồn kho nếu xuất)");
      console.error(error);
    }
  };

  const filtered = skus.filter(s => 
    s.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.sku_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Theo dõi Tồn kho</h1>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm, mã SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '60px' }}>Ảnh</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Mã SKU</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Sản phẩm</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Giá bán</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tồn kho</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác Nhanh</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy sản phẩm</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.sku_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <img src={s.image_url || 'https://via.placeholder.com/40'} alt={s.sku_code} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#fff' }} />
                  </td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', color: 'var(--cyan)' }}>{s.sku_code}</td>
                  <td style={{ padding: '16px 12px' }}>{s.product_name}</td>
                  <td style={{ padding: '16px 12px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price)}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontSize: '16px', color: s.stock_quantity > 0 ? '#4caf50' : '#f44336' }}>
                    {s.stock_quantity}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    {s.stock_quantity > 10 ? (
                      <span style={{ color: '#4caf50' }}>Còn hàng</span>
                    ) : s.stock_quantity > 0 ? (
                      <span style={{ color: '#ff9800' }}>Sắp hết</span>
                    ) : (
                      <span style={{ color: '#f44336' }}>Hết hàng</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button title="Lịch sử giao dịch" onClick={() => openHistory(s)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <History size={16} />
                      </button>
                      <button title="Nhập kho nhanh" onClick={() => openReceipt(s, 'IN')} style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', color: '#4caf50', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Plus size={16} />
                      </button>
                      <button title="Xuất kho nhanh" onClick={() => openReceipt(s, 'OUT')} style={{ background: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336', color: '#f44336', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Minus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORY MODAL */}
      {historyModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '700px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Lịch sử Tồn kho: {historyModal.sku?.sku_code}</h2>
              <button onClick={() => setHistoryModal({ ...historyModal, show: false })} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              {historyModal.loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải lịch sử...</div>
              ) : historyModal.data.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Chưa có giao dịch nhập xuất nào</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                      <th style={{ padding: '12px' }}>Thời gian</th>
                      <th style={{ padding: '12px' }}>Mã phiếu</th>
                      <th style={{ padding: '12px' }}>Loại</th>
                      <th style={{ padding: '12px' }}>SL</th>
                      <th style={{ padding: '12px' }}>Người tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyModal.data.map((h, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{new Date(h.created_at).toLocaleString('vi-VN')}</td>
                        <td style={{ padding: '12px' }}>{h.receipt_code}</td>
                        <td style={{ padding: '12px' }}>
                          {h.type === 'IN' ? <span style={{ color: '#4caf50', fontWeight: 'bold' }}>+ Nhập</span> : <span style={{ color: '#f44336', fontWeight: 'bold' }}>- Xuất</span>}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{h.quantity}</td>
                        <td style={{ padding: '12px' }}>{h.created_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK RECEIPT MODAL */}
      {receiptModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {receiptModal.type === 'IN' ? 'Nhập kho nhanh' : 'Xuất kho nhanh'}: {receiptModal.sku?.sku_code}
              </h2>
              <button onClick={() => setReceiptModal({ ...receiptModal, show: false })} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={submitReceipt} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Sản phẩm</label>
                <input disabled type="text" value={receiptModal.sku?.product_name} style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)' }} />
              </div>
              
              {receiptModal.type === 'IN' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Nhà cung cấp *</label>
                  <select required value={receiptModal.supplier_id} onChange={e => setReceiptModal({...receiptModal, supplier_id: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}>
                    <option value="">-- Chọn Nhà cung cấp --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Số lượng *</label>
                  <input required type="number" min="1" value={receiptModal.quantity} onChange={e => setReceiptModal({...receiptModal, quantity: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Đơn giá (VNĐ)</label>
                  <input required type="number" min="0" value={receiptModal.unit_price} onChange={e => setReceiptModal({...receiptModal, unit_price: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Ghi chú</label>
                <textarea rows="2" value={receiptModal.note} onChange={e => setReceiptModal({...receiptModal, note: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setReceiptModal({ ...receiptModal, show: false })} style={{ padding: '10px 20px', background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: receiptModal.type === 'IN' ? '#4caf50' : '#f44336', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {receiptModal.type === 'IN' ? 'Nhập kho' : 'Xuất kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
