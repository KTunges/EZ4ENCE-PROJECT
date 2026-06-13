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
      province_id: provinceId,
      district_id: districtId,
      ward_code: wardId,
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
        alert(d.detail || "Lỗi lưu địa chỉ");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div className="tab-header flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sổ Địa Chỉ</h2>
        <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={16} /> Thêm địa chỉ mới
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center p-10 bg-white/5 rounded-lg border border-white/10">
          <MapPin size={40} className="mx-auto text-cyan mb-4 opacity-50" />
          <p>Bạn chưa có địa chỉ nào.</p>
        </div>
      ) : (
        <div className="address-list flex flex-col gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`address-card p-4 rounded-lg border ${addr.is_default ? 'border-cyan bg-cyan/5' : 'border-white/10 bg-white/5'} relative`}>
              {addr.is_default && (
                <div className="absolute top-4 right-4 text-cyan flex items-center gap-1 text-sm font-bold">
                  <CheckCircle size={16} /> Mặc định
                </div>
              )}
              <h3 className="font-bold text-lg mb-1">{addr.full_name} <span className="text-muted font-normal text-sm ml-2">{addr.phone}</span></h3>
              <p className="text-muted text-sm mb-1">{addr.address_line}</p>
              <p className="text-muted text-sm">{addr.ward}, {addr.district}, {addr.city}</p>
              
              <div className="mt-4 flex gap-3">
                <button className="text-sm text-cyan hover:underline flex items-center gap-1" onClick={() => handleEdit(addr)}>
                  <Edit2 size={14} /> Chỉnh sửa
                </button>
                <button className="text-sm text-pink hover:underline flex items-center gap-1" onClick={() => handleDelete(addr.id)}>
                  <Trash2 size={14} /> Xoá
                </button>
                {!addr.is_default && (
                  <button className="text-sm text-white hover:text-cyan ml-auto flex items-center gap-1" onClick={() => handleSetDefault(addr.id)}>
                    <Star size={14} /> Đặt làm mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}</h3>
            <form onSubmit={handleSave} className="form-grid">
              <div className="form-group col-span-2 md-col-span-1">
                <label>Họ và Tên</label>
                <input required type="text" className="checkout-input" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="form-group col-span-2 md-col-span-1">
                <label>Số điện thoại</label>
                <input required type="tel" className="checkout-input" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              
              <div className="form-group col-span-2 md-col-span-1">
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
              <div className="form-group col-span-2 md-col-span-1">
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
              <div className="form-group col-span-2 md-col-span-1">
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
              <div className="form-group col-span-2">
                <label>Địa chỉ cụ thể (Số nhà, đường)</label>
                <input required type="text" className="checkout-input" value={addressLine} onChange={e => setAddressLine(e.target.value)} />
              </div>

              <div className="form-group col-span-2 save-info-checkbox mt-2">
                <label className="checkbox-container">
                  <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Đặt làm địa chỉ mặc định</span>
                </label>
              </div>

              <div className="form-actions col-span-2 mt-4 flex gap-4 justify-end">
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
