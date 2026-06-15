import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Search } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getInventory();
      setInventory(res.data || res); // Depending on Axios response structure
    } catch (error) {
      console.error('Lỗi lấy tồn kho:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={28} color="#a855f7" /> Theo Dõi Tồn Kho
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Kiểm tra lượng hàng trong kho và các cảnh báo sắp hết.</p>
        </div>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Tìm tên sản phẩm, phân loại..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Sản phẩm</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Phân loại (SKU)</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>Giá bán hiện tại</th>
              <th style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>Tồn kho</th>
              <th style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
            ) : filteredInventory.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Không có dữ liệu</td></tr>
            ) : (
              filteredInventory.map(item => (
                <tr key={item.sku_id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#000', overflow: 'hidden' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>?</div>
                      )}
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{item.product_name}</span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{item.sku_name}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: item.stock === 0 ? '#ef4444' : (item.stock < 5 ? '#eab308' : 'var(--text)') }}>
                    {item.stock}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {item.stock === 0 ? (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                        Hết hàng
                      </span>
                    ) : item.stock < 5 ? (
                      <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', background: 'rgba(234,179,8,0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                        <AlertTriangle size={12} /> Sắp hết
                      </span>
                    ) : (
                      <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold', background: 'rgba(34,197,94,0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                        An toàn
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
