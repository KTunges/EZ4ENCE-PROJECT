import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, DownloadCloud, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminProducts, deleteProduct } from '../../services/adminApi';
import { downloadReport } from '../../utils/exportUtils';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await getAdminProducts();
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

  const uniqueCategories = Array.from(new Map(products.filter(p => p.category).map(p => [p.category.id, p.category.name])).entries());
  const filteredProducts = products.filter(p => {
    const matchSearch = searchQuery.trim() === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.skus && p.skus.some(s => s.sku && s.sku.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchCategory = categoryFilter === 'ALL' || (p.category && p.category.id === categoryFilter);
    const matchStatus = statusFilter === 'ALL' || 
                        (statusFilter === 'VISIBLE' ? p.is_published === true : 
                        (statusFilter === 'HIDDEN' ? p.is_published === false : true));
    return matchSearch && matchCategory && matchStatus;
  });

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
        <h1 className="text-2xl font-bold">Danh sách Sản phẩm</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowExport(!showExport)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              <DownloadCloud size={18} /> Xuất dữ liệu <ChevronDown size={14} />
            </button>
            {showExport && (
              <div className="glass" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', borderRadius: '12px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('admin_token');
                    downloadReport(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/reports/products/export?format=csv`, token, 'Products_Report.csv');
                    setShowExport(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(128,128,128,0.15)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  <DownloadCloud size={16} /> Xuất File CSV
                </button>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('admin_token');
                    downloadReport(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/admin/reports/products/export?format=xlsx`, token, 'Products_Report.xlsx');
                    setShowExport(false);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '6px', fontWeight: '500', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(128,128,128,0.15)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  <DownloadCloud size={16} /> Xuất File Excel
                </button>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/admin/products/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1, zIndex: 10 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên sản phẩm, mã SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => { 
                e.target.style.background = 'var(--bg-card-hover)'; 
                e.target.style.borderColor = 'var(--cyan)'; 
                e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)';
                setShowSuggestions(true);
              }}
              onBlur={(e) => { 
                e.target.style.background = 'var(--bg-card)'; 
                e.target.style.borderColor = 'var(--border)'; 
                e.target.style.boxShadow = 'none';
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none', transition: 'all 0.2s' }}
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && filteredProducts.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                marginTop: '8px',
                padding: '8px 0',
                zIndex: 9999,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {filteredProducts.slice(0, 5).map(p => {
                  const primaryImage = p.images?.find(img => img.is_primary)?.url || p.images?.[0]?.url || '/images/placeholder.jpg';
                  const price = p.skus && p.skus.length > 0 ? p.skus[0].price : 0;
                  return (
                  <div 
                    key={p.id} 
                    onClick={() => {
                      navigate(`/admin/products/edit/${p.id}`);
                      setShowSuggestions(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 16px',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={primaryImage} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', background: '#fff', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--cyan)' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/products/${p.slug}`, '_blank');
                        setShowSuggestions(false);
                      }}
                      style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Xem trên Web"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )})}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '0 12px', color: 'var(--text-muted)' }}><Filter size={18} /></div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '10px 16px 10px 4px', outline: 'none', cursor: 'pointer', appearance: 'none', maxWidth: '200px' }}
            >
              <option value="ALL">Tất cả danh mục</option>
              {uniqueCategories.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '10px 16px', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="VISIBLE">Đang hiển thị</option>
              <option value="HIDDEN">Đã ẩn</option>
            </select>
          </div>
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
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Chưa có sản phẩm nào</td></tr>
              ) : filteredProducts.map((product) => {
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
