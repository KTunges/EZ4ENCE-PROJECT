import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, Zap, ShieldCheck } from 'lucide-react';
import CustomSelect from '../../components/ui/CustomSelect';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import useVietnamProvinces from '../../hooks/useVietnamProvinces';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart, loading: cartLoading } = useCart();
  const { user, token } = useAuth();
  
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingId, setSelectedShippingId] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [wardId, setWardId] = useState('');
  const [wardName, setWardName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);

  // Thêm state cho mã giảm giá
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  
  const { provinces, districts, wards, fetchDistricts, fetchWards } = useVietnamProvinces();

  useEffect(() => {
    if (!user && !cartLoading) {
      navigate('/login');
    } else if (token) {
      // Fetch user addresses
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setSavedAddresses(data);
        const defaultAddr = data.find(a => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      })
      .catch(err => console.error("Error fetching addresses:", err));
    }
  }, [user, cartLoading, navigate, token]);

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

  // Fetch Shipping Options when Address changes
  useEffect(() => {
    let c = '', d = '', wCode = '';
    let pName = '', dName = '', wName = '';

    if (selectedAddressId === 'new') {
      c = provinceName; // In old code this was provinceName but actually passed as city (ID)
      d = districtId;
      wCode = wardId;
      pName = provinceName;
      dName = districtName;
      wName = wardName;
    } else {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        c = addr.city;
        d = addr.district_id || addr.district; // Fallback
        wCode = addr.ward_code || addr.ward; // Fallback
        pName = addr.city;
        dName = addr.district;
        wName = addr.ward;
      }
    }

    if (c && d) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/shipping/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          city: String(c), 
          district: String(d), 
          ward: String(wCode), 
          weight_grams: 1000,
          province_name: pName,
          district_name: dName,
          ward_name: wName
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.options && data.options.length > 0) {
          setShippingOptions(data.options);
          // Auto select cheapest
          const cheapest = [...data.options].sort((a,b) => a.fee - b.fee)[0];
          setSelectedShippingId(cheapest.id);
        }
      })
      .catch(console.error);
    } else {
      setShippingOptions([]);
      setSelectedShippingId('');
    }
  }, [selectedAddressId, provinceName, districtName, savedAddresses]);

  const items = cart?.items || [];
  const subtotal = cart?.total_amount || 0;
  
  const selectedShipping = shippingOptions.find(o => o.id === selectedShippingId);
  const rawShippingFee = selectedShipping ? selectedShipping.fee : 0;
  const isFreeshipEligible = subtotal >= 2000000;
  const shippingFee = isFreeshipEligible ? 0 : rawShippingFee;
  
  const discountAmount = appliedPromo ? appliedPromo.final_discount : 0;
  const total = subtotal + shippingFee - discountAmount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/marketing/promotions/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase(), order_value: subtotal })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedPromo(data);
      } else {
        setPromoError(data.detail || 'Mã giảm giá không hợp lệ');
        setAppliedPromo(null);
      }
    } catch (err) {
      setPromoError('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSpecificCheckout = async (method) => {
    if (selectedAddressId === 'new') {
      if (!fullName || !phone || !provinceName || !districtName || !wardName || !addressLine) {
        alert('Vui lòng điền đầy đủ thông tin giao hàng!');
        return;
      }
    }
    
    setLoading(true);
    try {
      const payload = selectedAddressId !== 'new' ? {
        address_id: selectedAddressId,
        payment_method: method.toUpperCase(),
        shipping_fee: shippingFee,
        shipping_provider: selectedShipping ? selectedShipping.id : null,
        note: note,
        promotion_id: appliedPromo ? appliedPromo.id : null
      } : {
        full_name: fullName,
        phone: phone,
        address_line: addressLine,
        ward: wardName,
        district: districtName,
        city: provinceName,
        province_id: provinceId,
        district_id: districtId,
        ward_code: wardId,
        payment_method: method.toUpperCase(),
        shipping_fee: shippingFee,
        shipping_provider: selectedShipping ? selectedShipping.id : null,
        note: note,
        promotion_id: appliedPromo ? appliedPromo.id : null
      };

      // Nếu người dùng chọn lưu địa chỉ
      if (selectedAddressId === 'new' && saveAddress) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            full_name: fullName, phone, address_line: addressLine,
            ward: wardName, district: districtName, city: provinceName,
            province_id: provinceId, district_id: districtId, ward_code: wardId,
            is_default: false
          })
        }).catch(err => console.error(err));
      }

      // 1. Tạo đơn hàng
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.detail || 'Lỗi tạo đơn hàng');
      }

      await fetchCart(); // Clear cart state

      if (method === 'vnpay') {
        const payRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payment/vnpay/create-url`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ order_id: orderData.id }),
        });
        const payData = await payRes.json();
        if (payData.payment_url) {
          window.location.href = payData.payment_url;
        } else {
          alert("Không thể tạo URL thanh toán VNPAY.");
        }
        return;
      }

      // COD
      navigate('/checkout/success', { state: { method: method, total: total, orderId: orderData.id } });
    } catch (err) {
      console.error("Checkout error", err);
      alert("Lỗi thanh toán: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-container fade-in">
      <div className="container">
        <div className="checkout-header-actions">
          <Link to="/cart" className="back-to-cart-link">
            <ChevronLeft size={20} /> Trở về giỏ hàng
          </Link>
        </div>

        <div className="cart-page-header">
          <h1 className="glitch-text text-3xl font-bold" data-text="THANH TOÁN">THANH TOÁN</h1>
          <p className="text-muted">Hoàn tất thủ tục để nâng cấp không gian giải trí của bạn.</p>
        </div>

        <div className="checkout-grid">
          {/* Left Column: Form Info */}
          <div className="checkout-form-column">
            
            {/* Contact & Shipping Address */}
            <div className="checkout-panel glass">
              <h2 className="panel-title">1. Thông Tin Giao Hàng</h2>
              
              <div className="form-grid">
                
                {/* Select Saved Address */}
                {savedAddresses.length > 0 && (
                  <div className="form-group col-span-2 mb-4">
                    <label>Sổ địa chỉ</label>
                    <CustomSelect
                      value={selectedAddressId}
                      onChange={setSelectedAddressId}
                      options={[
                        ...savedAddresses.map(a => ({ value: a.id, label: `${a.full_name} - ${a.address_line}, ${a.ward}, ${a.district}, ${a.city}` })),
                        { value: 'new', label: '+ Nhập địa chỉ mới' }
                      ]}
                    />
                  </div>
                )}

                {selectedAddressId === 'new' && (
                  <>
                    <div className="form-group col-span-2 md-col-span-1">
                      <label>Họ và Tên</label>
                      <input type="text" className="checkout-input" placeholder="Nhập họ tên của bạn" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div className="form-group col-span-2 md-col-span-1">
                      <label>Số điện thoại</label>
                      <input type="tel" className="checkout-input" placeholder="Nhập số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
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
                          { value: '', label: 'Chọn Tỉnh/Thành phố' },
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
                          { value: '', label: 'Chọn Quận/Huyện' },
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
                          { value: '', label: 'Chọn Phường/Xã' },
                          ...wards.map(w => ({ value: w.id, label: w.name }))
                        ]}
                      />
                    </div>
                    <div className="form-group col-span-2">
                      <label>Địa chỉ cụ thể (Số nhà, đường...)</label>
                      <input type="text" className="checkout-input" placeholder="Nhập địa chỉ nhận hàng" value={addressLine} onChange={e => setAddressLine(e.target.value)} />
                    </div>

                    <div className="form-group col-span-2 save-info-checkbox">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">Lưu thông tin giao hàng này cho lần mua sau</span>
                      </label>
                    </div>
                  </>
                )}
                
                <div className="form-group col-span-2 mt-4">
                  <label>Ghi chú đơn hàng (Tuỳ chọn)</label>
                  <textarea className="checkout-input" rows="3" placeholder="Ghi chú thêm cho shipper hoặc dặn dò..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="checkout-panel glass">
              <h2 className="panel-title">2. Phương Thức Vận Chuyển</h2>
              {shippingOptions.length === 0 ? (
                <div className="text-muted p-4 border border-white/10 rounded-md bg-white/5">
                  Vui lòng chọn địa chỉ giao hàng để xem phí vận chuyển.
                </div>
              ) : (
                <div className="options-grid">
                  {shippingOptions.map(option => (
                    <label key={option.id} className={`option-card ${selectedShippingId === option.id ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="shipping" 
                        value={option.id}
                        checked={selectedShippingId === option.id}
                        onChange={() => setSelectedShippingId(option.id)}
                      />
                      <div className="option-content">
                        <div className="option-icon" style={{ borderRadius: '4px', overflow: 'hidden', width: '40px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={option.logo} alt={option.provider} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div className="option-details">
                          <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{option.provider} <span style={{ fontSize: '12px', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', padding: '2px 6px', borderRadius: '4px' }}>{option.service_name}</span></h4>
                          <p>Dự kiến giao: <strong className="text-white">{option.estimated_delivery}</strong></p>
                        </div>
                        <div className="option-price" style={{ color: selectedShippingId === option.id ? '#00d2ff' : 'var(--text-muted)' }}>
                          {isFreeshipEligible ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ textDecoration: 'line-through', color: 'var(--text-dim)', fontSize: '12px' }}>{formatPrice(option.fee)}</span>
                              <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>0 đ</span>
                            </div>
                          ) : (
                            formatPrice(option.fee)
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>



          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-wrapper">
            <div className="cart-summary glass">
              <h3 className="summary-title">Đơn Hàng Của Bạn</h3>
              
              <div className="checkout-items-mini">
                {items.map(item => (
                  <div key={item.id} className="mini-item">
                    <div className="mini-item-img">
                      <img src={item.image_url || 'https://via.placeholder.com/80/1a1a2e/00d2ff?text=Img'} alt={item.product_name} />
                      <span className="mini-item-qty">{item.quantity}</span>
                    </div>
                    <div className="mini-item-info">
                      <div className="mini-item-name">{item.product_name}</div>
                      <div className="mini-item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

                <div className="summary-divider"></div>

                {/* Promo Code Input */}
                <div className="mb-4 mt-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="checkout-input flex-1 uppercase" 
                      placeholder="Mã giảm giá (VD: EZ4GEAR)" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={promoLoading || appliedPromo}
                    />
                    {appliedPromo ? (
                      <button 
                        className="btn btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                      >
                        Hủy
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                      >
                        {promoLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </button>
                    )}
                  </div>
                  {promoError && <p className="text-red-400 text-sm mt-2">{promoError}</p>}
                  {appliedPromo && <p className="text-green-400 text-sm mt-2">{appliedPromo.message}</p>}
                </div>
                
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span className="text-cyan">
                    {shippingFee === 0 ? (shippingOptions.length === 0 ? '--' : 'Miễn phí') : formatPrice(shippingFee)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="summary-row text-green-400">
                    <span>Giảm giá ({appliedPromo.code}):</span>
                    <span>-{formatPrice(appliedPromo.final_discount)}</span>
                  </div>
                )}
  
                <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span className="total-label">Tổng cộng:</span>
                <span className="total-value">{formatPrice(total)}</span>
              </div>

              <div className="checkout-payment-buttons mt-6 mb-6">
                
                <div className="relative flex items-center py-2 mb-4 mt-2">
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                  <span className="flex-shrink-0 mx-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Thanh toán nội địa</span>
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                </div>

                <div className="flex flex-col gap-4 mb-2">
                  <button 
                    className="w-full flex items-center justify-center gap-1 transition-all duration-200 ease-out hover:brightness-95 active:scale-[0.99]" 
                    style={{ 
                      backgroundColor: '#005BAA', 
                      borderRadius: '4px', 
                      height: '45px',
                      color: '#fff',
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSpecificCheckout('vnpay')}
                  >
                    <span style={{ fontWeight: 600, marginRight: '2px' }}>Pay with</span>
                    <img src="/vnpay-logo.png" alt="VNPAY" style={{ height: '26px', filter: 'brightness(0) invert(1)' }} />
                  </button>

                  <button 
                    className="w-full flex items-center justify-center gap-1 transition-all duration-200 ease-out hover:brightness-95 active:scale-[0.99]" 
                    style={{ 
                      backgroundColor: '#A50064', 
                      borderRadius: '4px', 
                      height: '45px',
                      color: '#fff',
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSpecificCheckout('momo')}
                  >
                    <span style={{ fontWeight: 600, marginRight: '4px' }}>Pay with</span>
                    <img src="https://developers.momo.vn/v3/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png" alt="MoMo" style={{ height: '28px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)' }} />
                  </button>
                </div>

                <div className="relative flex items-center py-2 mb-4 mt-4">
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                  <span className="flex-shrink-0 mx-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Thanh toán quốc tế</span>
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                </div>

                <div className="w-full mb-4">
                  <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  createOrder={async () => {
                    if (selectedAddressId === 'new') {
                      if (!fullName || !phone || !provinceName || !districtName || !wardName || !addressLine) {
                        alert('Vui lòng điền đầy đủ thông tin giao hàng trước khi thanh toán PayPal!');
                        return null;
                      }
                    }
                    try {
                      const payload = selectedAddressId !== 'new' ? {
                        address_id: selectedAddressId,
                        payment_method: "PAYPAL",
                        shipping_fee: shippingFee,
                        shipping_provider: selectedShipping ? selectedShipping.id : null,
                        note: note
                      } : {
                        full_name: fullName, phone, address_line: addressLine, 
                        ward: wardName, district: districtName, city: provinceName,
                        province_id: provinceId, district_id: districtId, ward_code: wardId,
                        payment_method: "PAYPAL", 
                        shipping_fee: shippingFee,
                        shipping_provider: selectedShipping ? selectedShipping.id : null,
                        note: note
                      };

                      // Tạo đơn EZ4GEAR
                      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
                        method: "POST",
                        headers: { 
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(payload),
                      });
                      const orderData = await orderRes.json();
                      if (!orderRes.ok) throw new Error(orderData.detail || 'Lỗi tạo đơn');

                      // Xoá giỏ
                      await fetchCart();

                      // Gọi PayPal backend proxy
                      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payment/paypal/create-order`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify({ order_id: orderData.id }),
                      });
                      const ppData = await response.json();
                      if (ppData.paypal_order_id) {
                        return ppData.paypal_order_id;
                      } else {
                        throw new Error("Không thể khởi tạo PayPal Order");
                      }
                    } catch (error) {
                      console.error("Create order failed", error);
                      alert("Không thể tạo đơn hàng PayPal. " + error.message);
                    }
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payment/paypal/capture-order`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify({ order_id: data.orderID }),
                      });
                      const orderData = await response.json();
                      
                      if (orderData.success) {
                        navigate('/checkout/success', { state: { method: 'paypal', total: total, orderId: data.orderID } });
                      } else {
                        throw new Error("Capture failed");
                      }
                    } catch (error) {
                      console.error("Capture order failed", error);
                      alert("Thanh toán thất bại. " + error.message);
                    }
                  }}
                />
                </PayPalScriptProvider>
                </div>

                <div className="relative flex items-center py-2 mb-4 mt-4">
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                  <span className="flex-shrink-0 mx-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Thanh toán tiền mặt</span>
                  <div className="flex-grow border-t border-white/10" style={{ borderColor: 'var(--border-color)' }}></div>
                </div>

                <div className="flex flex-col gap-4 mb-2">
                  <button 
                    className="w-full flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:brightness-95 active:scale-[0.99]" 
                    style={{ 
                      backgroundColor: '#2d2d2d', 
                      borderRadius: '4px', 
                      height: '45px',
                      color: '#fff',
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '16px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    disabled={loading}
                    onClick={() => handleSpecificCheckout('cod')}
                  >
                    <Truck size={22} style={{ strokeWidth: 1.5 }} />
                    <span style={{ fontWeight: 500 }}>{loading ? 'Đang xử lý...' : 'Cash on Delivery'}</span>
                  </button>
                </div>
              </div>
              <div className="security-note mt-2">
                <ShieldCheck size={18} className="text-cyan" />
                <span>Thông tin của bạn được mã hóa an toàn 256-bit SSL.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
