import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, DownloadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminProducts, deleteProduct } from '../../services/adminApi';
import { downloadReport } from '../../utils/exportUtils';
import { useAuth } from '../../context/AuthContext';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { adminUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for pagination and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  // Optional: keep unique categories statically or fetch them if needed
  // Since we don't have all products, we might need a separate API for categories, 
  // but for simplicity we can fallback to just text input or let the user type, 
  // or fetch categories. For now we will keep standard categories.
  const uniqueCategories = [
    ['ALL', 'Tất cả danh mục'],
    ['bo-mach-chu', 'Mainboard'],
    ['bo-vi-xu-ly', 'CPU'],
    ['card-man-hinh', 'VGA'],
    ['vo-may-tinh', 'Vỏ Case'],
    ['nguon-may-tinh', 'Nguồn'],
    ['tan-nhiet', 'Tản nhiệt'],
    ['bo-nho-trong', 'RAM'],
    ['o-cung-ssd', 'SSD'],
    ['man-hinh', 'Màn hình'],
    ['ban-phim', 'Bàn phím'],
    ['chuot', 'Chuột'],
    ['tai-nghe', 'Tai nghe']
  ];

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts({
        page,
        limit,
        search: debouncedSearch || undefined,
        category_id: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      
      // Assume API returns { data, total, page, limit, total_pages }
      if (data && data.data) {
        setProducts(data.data);
        setTotalPages(data.total_pages);
        setTotalItems(data.total);
      } else {
        // Fallback if backend hasn't fully updated yet
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, categoryFilter, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (adminUser?.staff_role !== 'QUAN_TRI_VIEN') {
      window.toast.error("Bạn không có quyền xóa sản phẩm");
      return;
    }
    if (await window.customConfirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        window.toast.error(error.response?.data?.detail || "Lỗi khi xóa sản phẩm");
      }
    }
  };

  const getStatusBadge = (isPub) => {
    if (isPub) return <span style={{ padding: '4px 10px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Đang hiển thị</span>;
    return <span style={{ padding: '4px 10px', background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-muted)', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Đã ẩn</span>;
  };

  // Permissions
  const canEdit = adminUser?.staff_role === 'QUAN_TRI_VIEN' || adminUser?.staff_role === 'THU_KHO';
  const canDelete = adminUser?.staff_role === 'QUAN_TRI_VIEN';

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--cyan)' }}>Sản phẩm</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Quản lý kho hàng, cập nhật giá và số lượng.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => downloadReport(products, 'Danh_sach_san_pham')} style={{ background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <DownloadCloud size={18} /> Xuất Excel
          </button>
          
          {canEdit && (
            <button onClick={() => navigate('/admin/products/new')} style={{ background: 'var(--cyan)', color: 'black', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 210, 255, 0.3)' }}>
              <Plus size={18} /> Thêm Sản Phẩm Mới
            </button>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm theo tên, mã SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '0 12px', color: 'var(--text-muted)' }}><Filter size={18} /></div>
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '10px 16px 10px 4px', outline: 'none', cursor: 'pointer', appearance: 'none', maxWidth: '200px' }}
            >
              {uniqueCategories.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
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
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-cyan"></div></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</td></tr>
              ) : products.map((product) => {
                const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url || 'https://via.placeholder.com/40/1a1a2e/00d2ff?text=No+Img';
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
                      {canEdit && (
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} 
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDelete(product.id)} style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '14px', borderTop: '1px solid var(--border)' }}>
          <div>Hiển thị trang {page} / {totalPages || 1} (Tổng {totalItems} sản phẩm)</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: page <= 1 ? 'var(--border)' : 'var(--text)', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              Trước
            </button>
            <button style={{ padding: '6px 12px', background: 'var(--cyan)', border: 'none', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>{page}</button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: page >= totalPages ? 'var(--border)' : 'var(--text)', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
