import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminBrands() {
  const [brands] = useState([
    { id: 'BRD-001', name: 'ASUS', origin: 'Đài Loan', productCount: 120, status: 'active' },
    { id: 'BRD-002', name: 'GIGABYTE', origin: 'Đài Loan', productCount: 95, status: 'active' },
    { id: 'BRD-003', name: 'MSI', origin: 'Đài Loan', productCount: 88, status: 'active' },
    { id: 'BRD-004', name: 'Intel', origin: 'Mỹ', productCount: 45, status: 'active' },
    { id: 'BRD-005', name: 'AMD', origin: 'Mỹ', productCount: 40, status: 'active' },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Thêm Thương hiệu
        </button>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm thương hiệu..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>ID</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Tên thương hiệu</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Xuất xứ</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Số sản phẩm</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Trạng thái</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{brand.id}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{brand.name}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{brand.origin}</td>
                  <td style={{ padding: '16px 12px', fontFamily: 'var(--font-mono)' }}>{brand.productCount}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Hiển thị</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
