import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { getAdminNews, createNews, updateNews, deleteNews } from '../../services/adminApi';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image_url: '',
    category: '',
    is_active: true
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAdminNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        slug: item.slug,
        summary: item.summary || '',
        content: item.content,
        image_url: item.image_url || '',
        category: item.category || '',
        is_active: item.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        summary: '',
        content: '',
        image_url: '',
        category: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSlugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateNews(editingId, formData);
      } else {
        const payload = {
          ...formData,
          slug: formData.slug || handleSlugify(formData.title),
          published_at: formData.is_active ? new Date().toISOString() : null
        };
        await createNews(payload);
      }
      closeModal();
      fetchNews();
    } catch (error) {
      alert(error.response?.data?.detail || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tin bài này?')) {
      try {
        await deleteNews(id);
        fetchNews();
      } catch (error) {
        alert('Xóa thất bại');
      }
    }
  };

  const toggleActive = async (item) => {
    try {
      await updateNews(item.id, { is_active: !item.is_active });
      fetchNews();
    } catch (error) {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={28} color="var(--cyan)" /> Quản lý Tin tức
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Thêm, sửa, xóa tin tức công nghệ</p>
        </div>
        <button 
          onClick={() => openModal()}
          style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Thêm Tin Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '120px' }}>Ảnh</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Tiêu đề</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Danh mục</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Ngày đăng</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-cyan"></div></td></tr>
            ) : news.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có tin tức nào</td></tr>
            ) : (
              news.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '80px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#333' }} />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.title}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{item.category || 'Chung'}</td>
                  <td style={{ padding: '16px' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => toggleActive(item)}
                      style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                        border: 'none', cursor: 'pointer',
                        background: item.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: item.is_active ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {item.is_active ? 'Hiển thị' : 'Đã ẩn'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => openModal(item)} title="Sửa" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--cyan)', padding: '8px', borderRadius: '8px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} title="Xóa" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-dark)', width: '100%', maxWidth: '800px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{editingId ? 'Cập nhật Tin tức' : 'Thêm Tin Mới'}</h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Tiêu đề</label>
                  <input type="text" required value={formData.title} onChange={e => {
                    setFormData({...formData, title: e.target.value, slug: handleSlugify(e.target.value)});
                  }} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Slug (URL)</label>
                  <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Danh mục</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Phần Cứng, Laptop..." style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>URL Ảnh Đại Diện</label>
                  <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Tóm tắt (Summary)</label>
                <textarea rows="2" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Nội dung (HTML/Markdown)</label>
                <textarea rows="6" required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
                <input type="checkbox" id="news-active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                <label htmlFor="news-active" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 'bold' }}>Hiển thị ngay lập tức</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--cyan)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Cập nhật' : 'Lưu tin tức'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
