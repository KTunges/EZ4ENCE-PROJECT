import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Trash2, Edit, ShieldCheck, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

export default function AdminStaffs() {
  const { adminUser } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    staff_role: 'SALES',
    is_active: true
  });

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStaffs();
      setStaffs(res.data || res);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu nhân sự:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaffs(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ email: '', fullName: '', password: '', staff_role: 'SALES', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setEditingId(staff.id);
    setFormData({ 
      email: staff.email, 
      fullName: staff.fullName || '', 
      password: '', // Leave blank unless changing
      staff_role: staff.staff_role || 'SALES', 
      is_active: staff.is_active 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản nhân viên này vĩnh viễn?')) {
      try {
        await adminApi.deleteStaff(id);
        fetchStaffs();
      } catch (error) {
        alert(error.response?.data?.detail || 'Lỗi khi xóa nhân viên');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.password) {
      return alert('Vui lòng nhập mật khẩu cho tài khoản mới');
    }
    if (!formData.fullName || !formData.email) {
      return alert('Vui lòng điền đủ thông tin');
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        // Exclude email and conditionally password from update payload
        const payload = { 
          fullName: formData.fullName, 
          staff_role: formData.staff_role, 
          is_active: formData.is_active 
        };
        if (formData.password) payload.password = formData.password;
        await adminApi.updateStaff(editingId, payload);
      } else {
        await adminApi.createStaff(formData);
      }
      setShowModal(false);
      fetchStaffs();
    } catch (error) {
      alert(error.response?.data?.detail || 'Lưu tài khoản thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Trùm cuối' };
      case 'SALES': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Sale & CSKH' };
      case 'INVENTORY': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Thủ kho' };
      default: return { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748b', label: role || 'Nhân viên' };
    }
  };

  if (adminUser?.staff_role !== 'SUPER_ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Bạn không có quyền truy cập trang này.</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCog size={28} color="var(--cyan)" /> Quản lý Nhân sự
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Thêm, phân quyền hoặc tạm khóa tài khoản quản trị viên.</p>
        </div>
        <button onClick={openAddModal} style={{ background: 'var(--cyan)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(6, 182, 212, 0.3)' }}>
          <Plus size={18} /> Thêm Nhân Viên Mới
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Thông tin Nhân viên</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Chức danh (Role)</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)' }}>Ngày tạo</th>
              <th style={{ padding: '16px', textAlign: 'right', color: 'var(--text-muted)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
            ) : staffs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Chưa có nhân sự nào</td></tr>
            ) : (
              staffs.map(staff => (
                <tr key={staff.id} style={{ borderBottom: '1px solid var(--border)', opacity: staff.is_active ? 1 : 0.6 }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {staff.fullName ? staff.fullName.charAt(0) : staff.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{staff.fullName}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: getRoleColor(staff.staff_role).text, background: getRoleColor(staff.staff_role).bg, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> {getRoleColor(staff.staff_role).label}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {staff.is_active ? (
                       <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}><CheckCircle size={16} /> Đang làm việc</span>
                    ) : (
                       <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}><XCircle size={16} /> Đã khóa</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(staff.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => openEditModal(staff)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '6px' }} title="Chỉnh sửa">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(staff.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }} title="Xóa tài khoản">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', color: 'var(--text)' }}>{editingId ? 'Cập nhật Nhân viên' : 'Thêm Nhân Viên Mới'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✖</button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Email đăng nhập *</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', padding: '0 12px' }}>
                  <Mail size={16} color="var(--text-muted)" />
                  <input 
                    type="email" required disabled={!!editingId} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none' }} placeholder="nhanvien@ez4gear.com"
                  />
                </div>
                {editingId && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Không thể đổi email sau khi tạo</span>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Họ và tên *</label>
                <input 
                  type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} placeholder="Tên nhân viên..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Mật khẩu {editingId ? '(Để trống nếu không đổi)' : '*'}</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', padding: '0 12px' }}>
                  <Lock size={16} color="var(--text-muted)" />
                  <input 
                    type="password" required={!editingId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none' }} placeholder="••••••••"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Chức danh / Phân quyền *</label>
                <select 
                  value={formData.staff_role} onChange={e => setFormData({...formData, staff_role: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border-hover)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                >
                  <option value="SALES">Sale & CSKH (Chỉ quản lý Đơn hàng, Khách hàng)</option>
                  <option value="INVENTORY">Thủ kho (Quản lý Sản phẩm, Kho bãi, Đối tác)</option>
                  <option value="SUPER_ADMIN">Trùm cuối (Toàn quyền hệ thống)</option>
                </select>
              </div>

              {editingId && (
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="is_active" style={{ fontSize: '14px', color: 'var(--text)' }}>Cho phép tài khoản này hoạt động</label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'var(--bg)', border: '1px solid var(--border-hover)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Hủy bỏ</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', background: '#38bdf8', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(56, 189, 248, 0.3)' }}>{isSubmitting ? 'Đang xử lý...' : 'Lưu Tài Khoản'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
