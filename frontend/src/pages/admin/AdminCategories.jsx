import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminApi';

const generateSlug = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({ id: '', name: '', slug: '', description: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', name: '', slug: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setModalMode('edit');
    setFormData({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa danh mục!");
        console.error(error);
      }
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (modalMode === 'add') {
      setFormData(prev => ({ ...prev, name: val, slug: generateSlug(val) }));
    } else {
      setFormData(prev => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await createCategory(formData);
      } else {
        await updateCategory(formData.id, formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert("Lưu thất bại. Có thể slug bị trùng!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // data có thể là tree, cần flatten nếu muốn hiển thị table đơn giản, 
        // hoặc cứ map trực tiếp nếu backend trả list
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <button onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Thêm Danh mục
        </button>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>ID</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', minWidth: '250px' }}>Tên danh mục</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '200px' }}>Đường dẫn (Slug)</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Số sản phẩm</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có danh mục</td></tr>
              ) : filteredCategories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{cat.id.substring(0, 8).toUpperCase()}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{cat.name}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>/{cat.slug}</td>
                  <td style={{ padding: '16px 12px', fontFamily: 'var(--font-mono)' }}>{cat.product_count || 0}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Hiển thị</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenEditModal(cat)} style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa">
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

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass" style={{ width: '400px', padding: '24px', borderRadius: '12px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              {modalMode === 'add' ? 'Thêm Danh mục' : 'Chỉnh sửa Danh mục'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Tên danh mục *</label>
                <input required type="text" value={formData.name} onChange={handleNameChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Slug *</label>
                <input required type="text" value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              </div>
              <button disabled={isSubmitting} type="submit" style={{ padding: '12px', background: 'var(--cyan)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
