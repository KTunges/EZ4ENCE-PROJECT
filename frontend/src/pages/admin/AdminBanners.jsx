import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Trash2, Power, PowerOff, UploadCloud, X, Link as LinkIcon, Calendar, Type } from 'lucide-react';
import { uploadAdminImage, getAdminBanners, createBanner, toggleBannerStatus, deleteBanner } from '../../services/adminApi';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    position: 'hero_slider',
    is_active: true
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getAdminBanners();
      setBanners(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách banner:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Vui lòng chọn hình ảnh banner!');
      return;
    }

    try {
      setIsSubmitting(true);
      // 1. Upload image
      const imageUrl = await uploadAdminImage(imageFile);

      // 2. Create banner record
      await createBanner({
        ...formData,
        image_url: imageUrl
      });
      
      setShowModal(false);
      setFormData({ title: '', link_url: '', position: 'hero_slider', is_active: true });
      setImageFile(null);
      setImagePreview(null);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi tạo banner:', error);
      alert('Tạo banner thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleBannerStatus(id);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi xóa banner:', error);
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={28} color="var(--cyan)" /> Quản lý Banner
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tạo và quản lý các banner quảng cáo trên trang chủ.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Thêm Banner Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '250px' }}>Hình ảnh</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thông tin</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-cyan"></div></td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có banner nào</td></tr>
            ) : (
              banners.map(banner => (
                <tr key={banner.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ width: '200px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                      <img src={banner.image_url} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{banner.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Vị trí: {banner.position}</div>
                    {banner.link_url && <div style={{ fontSize: '12px', color: 'var(--cyan)', marginTop: '4px' }}>{banner.link_url}</div>}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: banner.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: banner.is_active ? '#22c55e' : '#ef4444'
                    }}>
                      {banner.is_active ? 'Đang bật' : 'Đã tắt'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleToggle(banner.id)}
                      title={banner.is_active ? 'Tắt banner' : 'Bật banner'}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: banner.is_active ? '#ef4444' : '#22c55e', padding: '8px', borderRadius: '8px' }}
                    >
                      {banner.is_active ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      title="Xóa banner"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Thêm Banner mới</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '20px' }}>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Ảnh Banner (Tỉ lệ 21:9 khuyên dùng) *</label>
                <div 
                  style={{ 
                    border: '2px dashed var(--border-hover)', borderRadius: '12px', padding: imagePreview ? '0' : '40px', 
                    textAlign: 'center', background: 'var(--bg-card)', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onClick={() => document.getElementById('banner-upload').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      <UploadCloud size={40} style={{ marginBottom: '12px', color: 'var(--cyan)' }} />
                      <p>Nhấn để chọn ảnh</p>
                    </div>
                  )}
                  <input id="banner-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Tiêu đề nội bộ *</label>
                  <div>
                    <input 
                      type="text" required
                      placeholder="VD: Banner Khuyến mãi 10/10"
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Vị trí *</label>
                  <select 
                    value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  >
                    <option value="hero_slider">Hero Slider (Trang chủ chính)</option>
                    <option value="sidebar_bottom">Sidebar Bottom (Dưới Menu Danh mục)</option>
                    <option value="footer_banner">Footer Banner (Chân trang)</option>
                    <option value="bento_main">Bento Main (Trang sản phẩm)</option>
                    <option value="bento_side">Bento Side (Trang sản phẩm)</option>
                    <option value="bento_bottom">Bento Bottom (Trang sản phẩm)</option>
                    <option value="home_middle">Home Middle (Trang chủ - Giữa)</option>
                    <option value="home_bottom">Home Bottom (Trang chủ - Dưới)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Link đích (Tùy chọn)</label>
                <div>
                  <input 
                    type="text" 
                    placeholder="https://... hoặc /products/xyz"
                    value={formData.link_url} onChange={e => setFormData({...formData, link_url: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: 'var(--cyan)', border: 'none', color: 'white', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {isSubmitting ? 'Đang tải lên...' : 'Lưu Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
