import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products] = useState([
    { id: 'PROD-001', name: 'Laptop Gaming HP Victus 16', category: 'Laptop', price: '24.990.000 đ', stock: 15, status: 'active', img: 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=HP' },
    { id: 'PROD-002', name: 'Card Màn Hình ASUS ROG Strix RTX 4070 Ti', category: 'VGA', price: '28.500.000 đ', stock: 5, status: 'active', img: 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=VGA' },
    { id: 'PROD-003', name: 'CPU Intel Core i9-14900K', category: 'CPU', price: '15.200.000 đ', stock: 0, status: 'out_of_stock', img: 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=CPU' },
    { id: 'PROD-004', name: 'RAM Corsair Dominator Platinum RGB 32GB', category: 'RAM', price: '4.500.000 đ', stock: 32, status: 'active', img: 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=RAM' },
    { id: 'PROD-005', name: 'Ổ Cứng SSD Samsung 990 PRO 2TB', category: 'SSD', price: '5.100.000 đ', stock: 20, status: 'active', img: 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=SSD' },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>Đang bán</span>;
      case 'out_of_stock': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>Hết hàng</span>;
      case 'hidden': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e', fontSize: '12px', fontWeight: 'bold' }}>Đã ẩn</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <button 
          onClick={() => navigate('/admin/products/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> Thêm Sản phẩm
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên sản phẩm, mã SKU..." 
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>
            <Filter size={18} /> Danh mục
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>
            Trạng thái
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '60px' }}>Ảnh</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tên sản phẩm</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Danh mục</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Giá bán</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tồn kho</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-card)' }}>
                      <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.id}</div>
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{product.category}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{product.price}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ color: product.stock === 0 ? '#f44336' : 'var(--text)' }}>{product.stock}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(product.status)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Xem chi tiết trên Web">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} 
                        title="Chỉnh sửa"
                      >
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
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <div>Hiển thị 1 - 5 của 240 sản phẩm</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>Trước</button>
            <button style={{ padding: '6px 12px', background: 'var(--cyan)', border: 'none', borderRadius: '4px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>2</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
