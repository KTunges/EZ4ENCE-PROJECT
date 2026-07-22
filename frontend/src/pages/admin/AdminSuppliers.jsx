import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, seedSuppliers, getBrands } from '../../services/adminApi';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '', contact_name: '', phone: '', email: '', address: '', is_active: true, brand_id: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const [supData, brandData] = await Promise.all([getSuppliers(), getBrands()]);
      setSuppliers(supData);
      setBrands(brandData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateNew = () => {
    setEditId(null);
    setFormData({ name: '', contact_name: '', phone: '', email: '', address: '', is_active: true, brand_id: '' });
    setShowModal(true);
  };

  const handleEdit = (sup) => {
    setEditId(sup.id);
    setFormData({
      name: sup.name || '',
      contact_name: sup.contact_name || '',
      phone: sup.phone || '',
      email: sup.email || '',
      address: sup.address || '',
      is_active: sup.is_active,
      brand_id: sup.brand_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (await window.customConfirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
      } catch (error) {
        window.toast.error("Lỗi khi xóa nhà cung cấp");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateSupplier(editId, formData);
      } else {
        await createSupplier(formData);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      window.toast.error("Lỗi khi lưu nhà cung cấp");
    }
  };

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.contact_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone || '').includes(searchQuery)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Nhà cung cấp</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {suppliers.length === 0 && (
            <button onClick={async () => { try { const res = await seedSuppliers(); window.toast.info(res.message); fetchSuppliers(); } catch (e) { window.toast.error('Lỗi tạo dữ liệu mẫu'); } }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--bg-card)', color: 'var(--cyan)', borderRadius: '8px', fontWeight: 'bold', border: '1px solid var(--cyan)', cursor: 'pointer' }}>
              Tạo dữ liệu mẫu
            </button>
          )}
          <button onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            <Plus size={18} /> Thêm NCC
          </button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, liên hệ, SĐT..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tên NCC</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Hãng đại diện</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Người liên hệ</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>SĐT</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Email</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Chưa có nhà cung cấp</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '16px 12px' }}>
                    {brands.find(b => b.id === s.brand_id)?.name || <span style={{color: 'var(--text-muted)'}}>Chưa gán</span>}
                  </td>
                  <td style={{ padding: '16px 12px' }}>{s.contact_name || '-'}</td>
                  <td style={{ padding: '16px 12px' }}>{s.phone || '-'}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--cyan)' }}>{s.email || '-'}</td>
                  <td style={{ padding: '16px 12px' }}>
                    {s.is_active ? 
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px' }}>Hoạt động</span> :
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', fontSize: '12px' }}>Ngừng</span>
                    }
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(s)} style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: '4px' }}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} style={{ background: 'transparent', border: 'none', color: '#f44336', cursor: 'pointer', padding: '4px', marginLeft: '8px' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{editId ? 'Sửa Nhà cung cấp' : 'Thêm Nhà cung cấp mới'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Tên NCC *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Hãng (Brand) *</label>
                  <select required value={formData.brand_id} onChange={e => setFormData({...formData, brand_id: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }}>
                    <option value="">-- Chọn Hãng --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Người liên hệ</label>
                  <input type="text" value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Số điện thoại</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Địa chỉ</label>
                <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)' }} />
              </div>
              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} style={{ width: '16px', height: '16px' }} />
                <label htmlFor="is_active" style={{ fontSize: '14px', cursor: 'pointer' }}>Đang hoạt động</label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--cyan)', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{editId ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
