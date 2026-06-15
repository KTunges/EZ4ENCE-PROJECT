import React, { useState, useEffect } from 'react';
import { Plus, Truck, Edit2, Trash2, Mail, Phone, MapPin, X } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', contact_name: '', phone: '', email: '', address: '', is_active: true
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSuppliers();
      setSuppliers(res);
    } catch (error) {
      console.error('Lỗi lấy danh sách nhà cung cấp:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', contact_name: '', phone: '', email: '', address: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (sup) => {
    setEditingId(sup.id);
    setFormData({
      name: sup.name, contact_name: sup.contact_name || '', phone: sup.phone || '',
      email: sup.email || '', address: sup.address || '', is_active: sup.is_active
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingId) {
        await adminApi.updateSupplier(editingId, formData);
      } else {
        await adminApi.createSupplier(formData);
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      alert('Đã có lỗi xảy ra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn xóa nhà cung cấp này?')) return;
    try {
      await adminApi.deleteSupplier(id);
      fetchSuppliers();
    } catch (error) {
      alert('Không thể xóa. Có thể nhà cung cấp này đã có giao dịch.');
    }
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={28} color="var(--cyan)" /> Nhà Cung Cấp
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Quản lý đối tác và nhà phân phối hàng hóa.</p>
        </div>
        <button onClick={openAddModal} style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Tên NCC</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Liên hệ</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
            ) : suppliers.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Chưa có dữ liệu</td></tr>
            ) : (
              suppliers.map(sup => (
                <tr key={sup.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{sup.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    {sup.contact_name && <div>Người đại diện: <span style={{color: 'var(--text)'}}>{sup.contact_name}</span></div>}
                    {sup.phone && <div><Phone size={12}/> {sup.phone}</div>}
                    {sup.email && <div><Mail size={12}/> {sup.email}</div>}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: sup.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: sup.is_active ? '#22c55e' : '#ef4444' }}>
                      {sup.is_active ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => openEditModal(sup)} style={{ background: 'transparent', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: '8px' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(sup.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>{editingId ? 'Sửa' : 'Thêm'} Nhà Cung Cấp</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Tên Nhà Cung Cấp *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="Nhập tên nhà cung cấp..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Người liên hệ</label>
                  <input type="text" value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="Tên người đại diện..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Số điện thoại</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="09xxxxxxx..." />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="contact@supplier.com..." />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Địa chỉ</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="Địa chỉ kho/nhà cung cấp..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg)', border: '1px solid var(--border-hover)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Hủy bỏ</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: '#38bdf8', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.3)' }}>{isSubmitting ? 'Đang lưu...' : 'Lưu lại'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
