import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Image as ImageIcon, Trash2, Power, PowerOff, UploadCloud, X, Edit, Calendar, Search, ExternalLink, AlertTriangle } from 'lucide-react';
import { uploadAdminImage, getAdminBanners, createBanner, updateBanner, toggleBannerStatus, deleteBanner, getPositionLimits, getLinkTargets } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

// Position labels fallback (in case API hasn't loaded yet)
const POSITION_LABELS = {
  hero_slider: 'Hero Slider (Trang chủ chính)',
  bento_main: 'Bento Main Carousel (Trang sản phẩm)',
  bento_side_top: 'Bento Side - Hình Trên (Trang SP)',
  bento_side_bottom: 'Bento Side - Hình Dưới (Trang SP)',
  bento_bottom_left: 'Bento Bottom - Hình Trái (Trang SP)',
  bento_bottom_middle: 'Bento Bottom - Hình Giữa (Trang SP)',
  bento_bottom_right: 'Bento Bottom - Hình Phải (Trang SP)',
  home_middle: 'Home Middle (Trang chủ - Giữa)',
  home_bottom: 'Home Bottom (Trang chủ - Dưới)',
  sidebar_bottom: 'Sidebar Bottom (Dưới Menu)',
  footer_banner: 'Footer Banner (Chân trang)',
};

function getBannerStatus(banner) {
  if (!banner.is_active) return { label: 'Đã tắt', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '🔴' };
  const now = new Date();
  if (banner.start_date && new Date(banner.start_date) > now) return { label: 'Chờ lên sóng', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🟡' };
  if (banner.end_date && new Date(banner.end_date) < now) return { label: 'Đã hết hạn', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: '⚪' };
  return { label: 'Đang chạy', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', icon: '🟢' };
}

function formatDate(dateStr) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ========================
// LINK BUILDER COMPONENT
// ========================
function LinkBuilder({ value, onChange }) {
  const [linkType, setLinkType] = useState('custom');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchQuery || linkType === 'custom') {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await getLinkTargets(linkType, searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, linkType]);

  const handleSelectTarget = (target) => {
    onChange(target.url);
    setSearchQuery(target.name);
    setShowDropdown(false);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Link đích (Tùy chọn)</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {[
          { val: 'custom', label: 'Tự nhập' },
          { val: 'product', label: 'Sản phẩm' },
          { val: 'category', label: 'Danh mục' },
        ].map(opt => (
          <button
            key={opt.val}
            type="button"
            onClick={() => { setLinkType(opt.val); setSearchQuery(''); setSearchResults([]); onChange(''); }}
            style={{
              padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: '1px solid var(--border)',
              background: linkType === opt.val ? 'var(--cyan)' : 'transparent',
              color: linkType === opt.val ? '#000' : 'var(--text)',
              fontWeight: linkType === opt.val ? 'bold' : 'normal'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {linkType === 'custom' ? (
        <input
          type="text"
          placeholder="https://... hoặc /products/xyz"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
        />
      ) : (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={linkType === 'product' ? 'Gõ tên sản phẩm để tìm kiếm...' : 'Gõ tên danh mục để tìm kiếm...'}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
            * Vui lòng gõ tên để tìm kiếm, sau đó chọn từ danh sách xổ xuống. Hệ thống sẽ tự động tạo URL đích.
          </div>
          {showDropdown && searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', zIndex: 50, marginTop: '4px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
              {searchResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectTarget(item)}
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,220,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '14px' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.url}</span>
                </div>
              ))}
            </div>
          )}
          {value && (
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(0,220,255,0.05)', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)' }}>
              <ExternalLink size={14} /> {value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================
// MAIN COMPONENT
// ========================
export default function AdminBanners() {
  const { adminUser } = useAuth();
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [positionConfig, setPositionConfig] = useState([]);
  const [filterPosition, setFilterPosition] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    link_url: '',
    position: 'hero_slider',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  const canDelete = adminUser?.staff_role === 'QUAN_TRI_VIEN';

  const getPositionOptionText = (p) => {
    const now = new Date();
    // Exclude the current editing banner from the count if we are in edit mode
    const count = banners.filter(b => {
      if (modalMode === 'edit' && editingBanner && b.id === editingBanner.id) return false;
      if (b.position !== p.value) return false;
      if (!b.is_active) return false;
      if (b.start_date && new Date(b.start_date) > now) return false;
      if (b.end_date && new Date(b.end_date) < now) return false;
      return true;
    }).length;

    if (p.limit === null || p.limit === undefined) {
      return `${p.label} (${count} đang chạy)`;
    }
    
    const isFull = count >= p.limit;
    return `${p.label} (${count}/${p.limit})${isFull ? ' - ĐÃ ĐẦY' : ''}`;
  };

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

  const fetchPositionConfig = async () => {
    try {
      const data = await getPositionLimits();
      setPositionConfig(data.positions || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchPositionConfig();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingBanner(null);
    setFormData({ title: '', link_url: '', position: 'hero_slider', is_active: true, start_date: '', end_date: '' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setModalMode('edit');
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      link_url: banner.link_url || '',
      position: banner.position,
      is_active: banner.is_active,
      start_date: banner.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '',
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : ''
    });
    setImageFile(null);
    setImagePreview(banner.image_url);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let imageUrl = editingBanner?.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadAdminImage(imageFile);
      } else if (modalMode === 'add') {
        window.toast.error('Vui lòng chọn hình ảnh banner!');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title,
        image_url: imageUrl,
        link_url: formData.link_url || null,
        position: formData.position,
        is_active: formData.is_active,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
      };

      if (modalMode === 'edit' && editingBanner) {
        await updateBanner(editingBanner.id, payload);
      } else {
        await createBanner(payload);
      }

      setShowModal(false);
      fetchBanners();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (detail) {
        window.toast.error(detail);
      } else {
        window.toast.error(modalMode === 'edit' ? 'Cập nhật banner thất bại.' : 'Tạo banner thất bại.');
      }
      console.error('Lỗi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleBannerStatus(id);
      fetchBanners();
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (detail) {
        window.toast.error(detail);
      } else {
        console.error('Lỗi cập nhật trạng thái:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      window.toast.error('Bạn không có quyền xóa banner');
      return;
    }
    if (!await window.customConfirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error('Lỗi xóa banner:', error);
    }
  };

  // Get limit info for selected position
  const getPositionLimitText = (pos) => {
    const cfg = positionConfig.find(p => p.value === pos);
    if (!cfg) return null;
    if (cfg.limit === null) return 'Không giới hạn (Carousel)';
    return `Tối đa ${cfg.limit} banner cùng lúc`;
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={28} color="var(--cyan)" /> Quản lý Banner
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Tạo, lên lịch và quản lý các banner quảng cáo trên website.</p>
        </div>
        <button
          onClick={openAddModal}
          style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={18} /> Thêm Banner Mới
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Lọc theo vị trí:</span>
        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-body)', color: 'var(--text)', outline: 'none', minWidth: '250px' }}
        >
          <option value="all">Tất cả vị trí</option>
          {Object.entries(POSITION_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '220px' }}>Hình ảnh</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>Thông tin</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '200px' }}>Lịch chiếu</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '130px' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', width: '140px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-cyan"></div></td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có banner nào</td></tr>
            ) : (
              banners.filter(b => filterPosition === 'all' || b.position === filterPosition).length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không tìm thấy banner nào ở vị trí này</td></tr>
              ) : (
                banners.filter(b => filterPosition === 'all' || b.position === filterPosition).map(banner => {
                  const status = getBannerStatus(banner);
                return (
                  <tr key={banner.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ width: '200px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                        <img src={banner.image_url} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{banner.title}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        Vị trí: {POSITION_LABELS[banner.position] || banner.position}
                      </div>
                      {banner.link_url && (
                        <div style={{ fontSize: '12px', color: 'var(--cyan)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ExternalLink size={12} /> {banner.link_url}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          <span style={{ color: 'var(--text-muted)' }}>Từ:</span>
                          <span>{formatDate(banner.start_date)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          <span style={{ color: 'var(--text-muted)' }}>Đến:</span>
                          <span>{formatDate(banner.end_date)}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                        background: status.bg, color: status.color, whiteSpace: 'nowrap', display: 'inline-block'
                      }}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(banner)}
                          title="Chỉnh sửa"
                          style={{ background: 'rgba(0, 210, 255, 0.1)', border: 'none', cursor: 'pointer', color: 'var(--cyan)', padding: '8px', borderRadius: '8px' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggle(banner.id)}
                          title={banner.is_active ? 'Tắt banner' : 'Bật banner'}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: banner.is_active ? '#ef4444' : '#22c55e', padding: '8px', borderRadius: '8px' }}
                        >
                          {banner.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(banner.id)}
                            title="Xóa banner"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Create / Edit Banner */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '650px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                {modalMode === 'edit' ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>

              {/* Image Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Ảnh Banner (Tỉ lệ 21:9 khuyên dùng) {modalMode === 'add' ? '*' : ''}</label>
                <div
                  style={{
                    border: '2px dashed var(--border-hover)', borderRadius: '12px', padding: imagePreview ? '0' : '40px',
                    textAlign: 'center', background: 'var(--bg-card)', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onClick={() => document.getElementById('banner-upload').click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)' }}>
                      <UploadCloud size={40} style={{ marginBottom: '12px', color: 'var(--cyan)' }} />
                      <p>Nhấn để chọn ảnh</p>
                    </div>
                  )}
                  <input id="banner-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
              </div>

              {/* Title + Position */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Tiêu đề nội bộ *</label>
                  <input
                    type="text" required
                    placeholder="VD: Banner Khuyến mãi 10/10"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Vị trí *</label>
                  <select
                    value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  >
                    {(positionConfig.length > 0 ? positionConfig : Object.entries(POSITION_LABELS).map(([v, l]) => ({ value: v, label: l, limit: v.includes('hero') || v.includes('main') ? null : 1 }))).map(p => {
                      const text = getPositionOptionText(p);
                      const isFull = text.includes('ĐÃ ĐẦY');
                      return (
                        <option key={p.value} value={p.value} style={{ color: isFull ? '#ef4444' : 'inherit' }}>
                          {text}
                        </option>
                      );
                    })}
                  </select>
                  {getPositionLimitText(formData.position) && (
                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> {getPositionLimitText(formData.position)}
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Bắt đầu (Tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Kết thúc (Tùy chọn)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Link Builder */}
              <div style={{ marginBottom: '24px' }}>
                <LinkBuilder value={formData.link_url} onChange={(v) => setFormData({...formData, link_url: v})} />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: 'var(--cyan)', border: 'none', color: 'white', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {isSubmitting ? 'Đang lưu...' : (modalMode === 'edit' ? 'Cập nhật Banner' : 'Lưu Banner')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
