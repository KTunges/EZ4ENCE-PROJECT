import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getInventorySkus } from '../../services/adminApi';

export default function AdminInventory() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSkus = async () => {
    try {
      setLoading(true);
      const data = await getInventorySkus();
      setSkus(data);
    } catch (error) {
      console.error("Lỗi tải tồn kho:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkus();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy sản phẩm</td></tr>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
