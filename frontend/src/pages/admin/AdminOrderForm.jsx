import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Trash2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { createAdminOrder, getCustomers as getAdminUsers, getAdminProducts, createCustomer } from '../../services/adminApi';

const AdminOrderForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ full_name: '', email: '', phone: '' });
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // States cho User Search
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // States cho Product Search
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  
  // Cart/Form States
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    ward: '',
    district: '',
    city: '',
    payment_method: 'COD',
    payment_status: 'UNPAID',
    shipping_fee: 0,
    discount_amount: 0,
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          getAdminUsers(),
          getAdminProducts()
        ]);
        setUsers(Array.isArray(uRes) ? uRes : (uRes?.data || []));
        setProducts(Array.isArray(pRes) ? pRes : (pRes?.data || []));
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setFormData({
      ...formData,
      full_name: u.full_name || '',
      phone: u.phone || '',
      address_line: '',
      ward: '',
      district: '',
      city: ''
    });
    setShowUserDropdown(false);
    setUserSearch('');
  };

  const handleAddProduct = (sku, productName) => {
    const existing = cartItems.find(i => i.sku_id === sku.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.sku_id === sku.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCartItems([...cartItems, { 
        sku_id: sku.id, 
        product_name: productName,
        sku_code: sku.sku_code,
        price: sku.price, 
        stock: sku.stock,
        quantity: 1 
      }]);
    }
    setShowProductDropdown(false);
    setProductSearch('');
  };

  const updateQuantity = (sku_id, delta) => {
    setCartItems(cartItems.map(i => {
      if (i.sku_id === sku_id) {
        const newQ = i.quantity + delta;
        if (newQ > 0 && newQ <= i.stock) return { ...i, quantity: newQ };
      }
      return i;
    }));
  };

  const removeItem = (sku_id) => {
    setCartItems(cartItems.filter(i => i.sku_id !== sku_id));
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerData.email || !newCustomerData.full_name || !newCustomerData.phone) {
      window.toast.error("Vui lòng điền đủ thông tin!");
      return;
    }
    setIsCreatingCustomer(true);
    try {
      const res = await createCustomer({ ...newCustomerData, password: 'ez4gear_guest' });
      setUsers(prev => [res, ...prev]);
      handleSelectUser(res);
      setIsCustomerModalOpen(false);
      setNewCustomerData({ full_name: '', email: '', phone: '' });
    } catch (err) {
      console.error(err);
      window.toast.error("Lỗi khi thêm khách hàng: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const calculateSubtotal = () => cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const calculateTotal = () => {
    const total = calculateSubtotal() + Number(formData.shipping_fee) - Number(formData.discount_amount);
    return total > 0 ? total : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      window.toast.error("Vui lòng chọn khách hàng!");
      return;
    }
    if (cartItems.length === 0) {
      window.toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: selectedUser.id,
        full_name: formData.full_name || "Guest",
        phone: formData.phone || "000",
        address_line: formData.address_line || "Tại cửa hàng",
        ward: formData.ward || "Không có",
        district: formData.district || "Không có",
        city: formData.city || "Không có",
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        shipping_fee: Number(formData.shipping_fee),
        discount_amount: Number(formData.discount_amount),
        note: formData.note,
        items: cartItems.map(i => ({
          sku_id: i.sku_id,
          quantity: i.quantity,
          custom_price: i.price
        }))
      };

      await createAdminOrder(payload);
      window.toast.success("Tạo đơn hàng thành công!");
      navigate('/admin/orders');
    } catch (error) {
      console.error(error);
      window.toast.error("Có lỗi xảy ra: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = userSearch 
    ? users.filter(u => u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()) || u.phone?.includes(userSearch))
    : users.slice(0, 5);

  let allSkus = [];
  products.forEach(p => {
    p.skus.forEach(s => {
      allSkus.push({ ...s, product_name: p.name });
    });
  });
  const filteredSkus = productSearch
    ? allSkus.filter(s => s.product_name.toLowerCase().includes(productSearch.toLowerCase()) || s.sku_code.toLowerCase().includes(productSearch.toLowerCase()))
    : allSkus.slice(0, 10);

  return (
    <div className="admin-page animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/admin/orders')} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        <h1 className="text-2xl font-bold">Tạo đơn thủ công</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px', position: 'relative', zIndex: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>1. Khách hàng</h2>
              {!selectedUser && (
                <button onClick={() => setIsCustomerModalOpen(true)} type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 220, 255, 0.1)', color: 'var(--cyan)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--cyan)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                  <Plus size={14} /> Thêm mới
                </button>
              )}
            </div>
            
            {!selectedUser ? (
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên, email, sđt..." 
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setShowUserDropdown(true); }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                />
                {showUserDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                      <div key={u.id} onClick={() => handleSelectUser(u)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }} className="export-dropdown-item">
                        <div style={{ fontWeight: 'bold' }}>{u.full_name || 'Chưa cập nhật'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email} • {u.phone || 'Chưa có SĐT'}</div>
                      </div>
                    )) : (
                      <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy khách hàng.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0, 210, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--cyan)' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedUser.full_name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedUser.email} • {selectedUser.phone}</div>
                </div>
                <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Đổi người</button>
              </div>
            )}
            
            {selectedUser && (
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Tên người nhận</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Số điện thoại</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Địa chỉ nhận hàng (Bỏ trống nếu lấy tại kho)</label>
                  <input type="text" value={formData.address_line} onChange={e => setFormData({...formData, address_line: e.target.value})} placeholder="Số nhà, tên đường..." style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                </div>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>2. Sản phẩm</h2>
            
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm theo tên hoặc mã SKU..." 
                value={productSearch}
                onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); }}
                onFocus={() => setShowProductDropdown(true)}
                onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
                style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
              />
              {showProductDropdown && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {filteredSkus.length > 0 ? filteredSkus.map(s => (
                    <div key={s.id} onClick={() => s.stock > 0 && handleAddProduct(s, s.product_name)} style={{ padding: '12px', cursor: s.stock > 0 ? 'pointer' : 'not-allowed', borderBottom: '1px solid var(--border)', opacity: s.stock > 0 ? 1 : 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className={s.stock > 0 ? "export-dropdown-item" : ""}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{s.product_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SKU: {s.sku_code} • Kho: {s.stock}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: 'var(--cyan)' }}>{s.price.toLocaleString()}đ</div>
                    </div>
                  )) : (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm.</div>
                  )}
                </div>
              )}
            </div>

            {cartItems.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '500' }}>Sản phẩm</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '500', width: '150px' }}>Đơn giá</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '500', width: '120px', textAlign: 'center' }}>SL</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: '500', width: '120px', textAlign: 'right' }}>Thành tiền</th>
                    <th style={{ padding: '12px 8px', width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.sku_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: '500' }}>{item.product_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.sku_code}</div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setCartItems(cartItems.map(i => i.sku_id === item.sku_id ? {...i, price: newPrice} : i));
                          }}
                          style={{ width: '100px', padding: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }}
                        />
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button onClick={() => updateQuantity(item.sku_id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.sku_id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>+</button>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button onClick={() => removeItem(item.sku_id)} style={{ color: '#ff1744', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                Chưa có sản phẩm nào.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>3. Thanh toán</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Trạng thái thanh toán</label>
                <select value={formData.payment_status} onChange={e => setFormData({...formData, payment_status: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Phương thức</label>
                <select value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
                  <option value="COD">Thu tiền mặt (COD)</option>
                  <option value="VNPAY">Chuyển khoản (VNPAY)</option>
                  <option value="MOMO">Ví Momo</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Ghi chú</label>
                <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', resize: 'none' }}></textarea>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tạm tính ({cartItems.length} SP):</span>
                <span>{calculateSubtotal().toLocaleString()}đ</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển:</span>
                <input type="number" value={formData.shipping_fee} onChange={e => setFormData({...formData, shipping_fee: e.target.value})} style={{ width: '100px', padding: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', textAlign: 'right' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Giảm giá:</span>
                <input type="number" value={formData.discount_amount} onChange={e => setFormData({...formData, discount_amount: e.target.value})} style={{ width: '100px', padding: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', textAlign: 'right' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed var(--border)' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Tổng cộng:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--cyan)' }}>{calculateTotal().toLocaleString()}đ</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'var(--cyan)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {loading ? 'Đang tạo...' : <><Save size={20} /> Tạo Đơn Hàng</>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Customer Quick Add Modal */}
      {isCustomerModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Thêm khách hàng nhanh</h3>
              <button type="button" onClick={() => setIsCustomerModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Họ và tên *</label>
                <input type="text" value={newCustomerData.full_name} onChange={e => setNewCustomerData({...newCustomerData, full_name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email *</label>
                <input type="email" value={newCustomerData.email} onChange={e => setNewCustomerData({...newCustomerData, email: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Số điện thoại *</label>
                <input type="text" value={newCustomerData.phone} onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </div>
              <button type="button" onClick={handleCreateCustomer} disabled={isCreatingCustomer} style={{ width: '100%', padding: '12px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: isCreatingCustomer ? 'not-allowed' : 'pointer', opacity: isCreatingCustomer ? 0.7 : 1 }}>
                {isCreatingCustomer ? 'Đang thêm...' : 'Lưu khách hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderForm;
