import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useVietnamProvinces from '../../hooks/useVietnamProvinces';
import CustomSelect from '../ui/CustomSelect';
import { MapPin, Plus, Edit2, Trash2, CheckCircle, Star } from 'lucide-react';

export default function AddressBook() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [wardId, setWardId] = useState('');
  const [wardName, setWardName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const { provinces, districts, wards, fetchDistricts, fetchWards } = useVietnamProvinces();

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  // Handle Province Change
  useEffect(() => {
    if (provinceId) {
      const p = provinces.find(x => x.id === provinceId);
      setProvinceName(p ? p.name : '');
      fetchDistricts(provinceId);
      setDistrictId('');
      setDistrictName('');
      setWardId('');
      setWardName('');
    }
  }, [provinceId]);

  // Handle District Change
  useEffect(() => {
    if (districtId) {
      const d = districts.find(x => x.id === districtId);
      setDistrictName(d ? d.name : '');
      fetchWards(districtId);
      setWardId('');
      setWardName('');
    }
  }, [districtId]);

  // Handle Ward Change
  useEffect(() => {
    if (wardId) {
      const w = wards.find(x => x.id === wardId);
      setWardName(w ? w.name : '');
    }
  }, [wardId]);

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setAddressLine('');
    setProvinceId('');
    setProvinceName('');
    setDistrictId('');
    setDistrictName('');
    setWardId('');
    setWardName('');
    setIsDefault(false);
  };

  const handleEdit = (addr) => {
    setEditingId(addr.id);
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddressLine(addr.address_line);
    // Vấn đề: addr lưu city (string). Để edit mượt ta phải tìm ID. 
    // Tuy nhiên api-tinhthanh lưu tên có cả 'Thành phố', nên tìm match khá khó nếu dữ liệu ko khớp 100%.
    // Tạm thời set string trực tiếp, user sẽ phải chọn lại tỉnh/quận nếu sửa.
    setProvinceName(addr.city);
    setDistrictName(addr.district);
    setWardName(addr.ward || '');
    setIsDefault(addr.is_default);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses/${id}/default`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!provinceName || !districtName || !wardName) {
      alert("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã");
      return;
    }

    const payload = {
      full_name: fullName,
      phone: phone,
      address_line: addressLine,
      city: provinceName,
      district: districtName,
      ward: wardName,
      province_id: provinceId ? parseInt(provinceId) : null,
      district_id: districtId ? parseInt(districtId) : null,
      ward_code: wardId || null,
      is_default: isDefault
    };

    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses/${editingId}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses`;
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchAddresses();
      } else {
        const d = await res.json();
        let errorMsg = "Lỗi lưu địa chỉ";
        if (d.detail) {
          if (Array.isArray(d.detail)) {
            errorMsg = d.detail.map(err => `${err.loc?.[1] || err.loc?.[0]}: ${err.msg}`).join('\n');
          } else {
            errorMsg = d.detail;
          }
        }
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>Sổ Địa Chỉ</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', backgroundColor: 'var(--cyan)', color: '#fff',
            fontWeight: '600', borderRadius: '12px', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 15px var(--cyan-glow)'
          }}
        >
          <Plus size={18} /> Thêm địa chỉ mới
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>
      ) : addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <MapPin size={48} style={{ margin: '0 auto 16px auto', color: 'var(--text-muted)', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>Bạn chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              border: addr.is_default ? '2px solid var(--cyan)' : '1px solid var(--border)', 
              backgroundColor: addr.is_default ? 'var(--cyan-dim)' : 'var(--bg-card)',
              position: 'relative',
              boxShadow: addr.is_default ? '0 4px 20px var(--cyan-glow)' : '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              {addr.is_default && (
                <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '14px', fontWeight: 'bold' }}>
                  <CheckCircle size={18} /> Mặc định
                </div>
              )}
              
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px 0', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {addr.full_name} 
                <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-muted)', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>
                  {addr.phone}
                </span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', margin: 0, color: 'var(--text)' }}>{addr.address_line}</p>
                <p style={{ fontSize: '15px', margin: 0, color: 'var(--text-muted)' }}>{addr.ward}, {addr.district}, {addr.city}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                <button 
                  onClick={() => handleEdit(addr)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Edit2 size={16} /> Chỉnh sửa
                </button>
                <button 
                  onClick={() => handleDelete(addr.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--pink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Trash2 size={16} /> Xoá
                </button>
                {!addr.is_default && (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                  >
                    <Star size={16} /> Đặt làm mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.25)', backdropFilter: 'blur(8px)', padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', width: '100%', maxWidth: '800px', padding: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflowY: 'auto', maxHeight: '90vh'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              {editingId ? 'Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Họ và Tên</label>
                <input required type="text" className="checkout-input" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label>Số điện thoại</label>
                <input required type="tel" className="checkout-input" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label>Tỉnh/Thành phố</label>
                <CustomSelect
                  value={provinceId}
                  onChange={(val) => {
                    const p = provinces.find(x => x.name === val || x.id === val);
                    if (p) setProvinceId(p.id);
                  }}
                  options={[
                    { value: '', label: editingId && provinceName ? provinceName : 'Chọn Tỉnh/Thành phố' },
                    ...provinces.map(p => ({ value: p.id, label: p.name }))
                  ]}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label>Quận/Huyện</label>
                <CustomSelect
                  value={districtId}
                  onChange={(val) => {
                    const d = districts.find(x => x.name === val || x.id === val);
                    if (d) setDistrictId(d.id);
                  }}
                  options={[
                    { value: '', label: editingId && districtName ? districtName : 'Chọn Quận/Huyện' },
                    ...districts.map(d => ({ value: d.id, label: d.name }))
                  ]}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label>Phường/Xã</label>
                <CustomSelect
                  value={wardId}
                  onChange={(val) => {
                    const w = wards.find(x => x.name === val || x.id === val);
                    if (w) setWardId(w.id);
                  }}
                  options={[
                    { value: '', label: editingId && wardName ? wardName : 'Chọn Phường/Xã' },
                    ...wards.map(w => ({ value: w.id, label: w.name }))
                  ]}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                <label>Địa chỉ cụ thể (Số nhà, đường)</label>
                <input required type="text" className="checkout-input" value={addressLine} onChange={e => setAddressLine(e.target.value)} />
              </div>

              <div className="form-group save-info-checkbox mt-2" style={{ gridColumn: 'span 3' }}>
                <label className="checkbox-container">
                  <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Đặt làm địa chỉ mặc định</span>
                </label>
              </div>

              <div className="form-actions" style={{ gridColumn: 'span 3', marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary shadow-glow">Lưu Địa Chỉ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
