import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminProducts, deleteProduct } from '../../services/adminApi';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await getAdminProducts({ limit: 1000 });
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa");
      }
    }
  };

  const getStatusBadge = (is_published) => {
    if (is_published) return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>Đang bán</span>;
    return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e', fontSize: '12px', fontWeight: 'bold' }}>Đã ẩn</span>;
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
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', minWidth: '250px' }}>Tên sản phẩm</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Danh mục</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Giá bán</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '100px' }}>Tồn kho</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '140px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Chưa có sản phẩm nào</td></tr>
              ) : products.map((product) => {
                const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=No+Img';
                // Lấy giá từ SKU đầu tiên
                const price = product.skus && product.skus.length > 0 ? product.skus[0].price : 0;
                const stock = product.skus ? product.skus.reduce((sum, sku) => sum + (sku.stock_quantity || 0), 0) : 0;
                
                return (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-black/5">
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-card)' }}>
                      <img src={primaryImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.slug}</div>
                  </td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{product.category?.name || '---'}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ color: stock === 0 ? '#f44336' : 'var(--text)' }}>{stock}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(product.is_published)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => window.open(`/products/${product.slug}`, '_blank')} style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Xem trên Web">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} 
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <div>Hiển thị 1 - {Math.min(50, products.length)} của {products.length} sản phẩm</div>
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
