import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Zap, ShieldCheck, Smartphone, QrCode, Globe } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const mockCartItems = [
  {
    id: 1,
    name: 'VGA ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    price: 55000000,
    quantity: 1,
    image: 'https://via.placeholder.com/80/1a1a2e/00d2ff?text=RTX+4090',
  },
  {
    id: 2,
    name: 'Chuột Logitech G Pro X Superlight 2 Wireless',
    price: 3200000,
    quantity: 2,
    image: 'https://via.placeholder.com/80/1a1a2e/ff0055?text=Superlight',
  }
];

export default function Checkout() {
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 0;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSpecificCheckout = async (method) => {
    if (method === 'vnpay') {
      try {
        const response = await fetch("http://localhost:3000/api/payment/vnpay/create-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount_vnd: total }),
        });
        const data = await response.json();
        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          alert("Không thể tạo URL thanh toán VNPAY.");
        }
      } catch (err) {
        console.error("VNPAY error", err);
        alert("Lỗi kết nối khi tạo giao dịch VNPAY.");
      }
      return;
    }

    // Mock the standard COD/Momo order placement
    navigate('/checkout/success', { state: { method: method, total: total, orderId: Math.floor(100000 + Math.random() * 900000) } });
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
                <div className="form-group col-span-2 md-col-span-1">
                  <label>Họ và Tên</label>
                  <input type="text" className="checkout-input" placeholder="Nhập họ tên của bạn" />
                </div>
                <div className="form-group col-span-2 md-col-span-1">
                  <label>Số điện thoại</label>
                  <input type="tel" className="checkout-input" placeholder="Nhập số điện thoại" />
                </div>
                
                <div className="form-group col-span-2 md-col-span-1">
                  <label>Tỉnh/Thành phố</label>
                  <CustomSelect
                    value={city}
                    onChange={setCity}
                    options={[
                      { value: '', label: 'Chọn Tỉnh/Thành phố' },
                      { value: 'sg', label: 'TP. Hồ Chí Minh' },
                      { value: 'hn', label: 'Hà Nội' },
                      { value: 'dn', label: 'Đà Nẵng' }
                    ]}
                  />
                </div>
                <div className="form-group col-span-2 md-col-span-1">
                  <label>Quận/Huyện</label>
                  <CustomSelect
                    value={district}
                    onChange={setDistrict}
                    options={[
                      { value: '', label: 'Chọn Quận/Huyện' }
                    ]}
                  />
                </div>
                <div className="form-group col-span-2">
                  <label>Địa chỉ cụ thể (Số nhà, đường...)</label>
                  <input type="text" className="checkout-input" placeholder="Nhập địa chỉ nhận hàng" />
                </div>
                <div className="form-group col-span-2">
                  <label>Ghi chú đơn hàng (Tuỳ chọn)</label>
                  <textarea className="checkout-input" rows="3" placeholder="Ghi chú thêm cho shipper hoặc dặn dò..."></textarea>
                </div>

                <div className="form-group col-span-2 save-info-checkbox">
                  <label className="checkbox-container">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">Lưu thông tin giao hàng này cho lần mua sau</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="checkout-panel glass">
              <h2 className="panel-title">2. Phương Thức Vận Chuyển</h2>
              <div className="options-grid">
                <label className={`option-card ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div className="option-content">
                    <div className="option-icon" style={{ color: shippingMethod === 'standard' ? '#007bff' : 'var(--text-muted)' }}><Truck size={24} /></div>
                    <div className="option-details">
                      <h4>Giao hàng tiêu chuẩn</h4>
                      <p>Dự kiến giao trong 2-3 ngày</p>
                    </div>
                    <div className="option-price" style={{ color: shippingMethod === 'standard' ? '#007bff' : 'var(--text-muted)' }}>Miễn phí</div>
                  </div>
                </label>
                
                <label className={`option-card ${shippingMethod === 'express' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <div className="option-content">
                    <div className="option-icon" style={{ color: shippingMethod === 'express' ? '#007bff' : 'var(--text-muted)' }}><Zap size={24} /></div>
                    <div className="option-details">
                      <h4>Giao hàng Hỏa Tốc 2H</h4>
                      <p>Nhận ngay trong vòng 2 giờ</p>
                    </div>
                    <div className="option-price" style={{ color: shippingMethod === 'express' ? '#007bff' : 'var(--text-muted)' }}>50.000 ₫</div>
                  </div>
                </label>
              </div>
            </div>



          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-wrapper">
            <div className="cart-summary glass">
              <h3 className="summary-title">Đơn Hàng Của Bạn</h3>
              
              <div className="checkout-items-mini">
                {mockCartItems.map(item => (
                  <div key={item.id} className="mini-item">
                    <div className="mini-item-img">
                      <img src={item.image} alt={item.name} />
                      <span className="mini-item-qty">{item.quantity}</span>
                    </div>
                    <div className="mini-item-info">
                      <div className="mini-item-name">{item.name}</div>
                      <div className="mini-item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="summary-row">
                <span>Phí giao hàng:</span>
                <span className={shippingMethod === 'express' ? 'text-pink' : 'text-cyan'}>
                  {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>

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
                  createOrder={async (data, actions) => {
                    try {
                      const response = await fetch("http://localhost:3000/api/payment/paypal/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount_vnd: total }),
                      });
                      const orderData = await response.json();
                      if (orderData.paypal_order_id) {
                        return orderData.paypal_order_id;
                      } else {
                        const errorDetail = orderData?.details?.[0];
                        const errorMessage = errorDetail ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})` : JSON.stringify(orderData);
                        throw new Error(errorMessage);
                      }
                    } catch (error) {
                      console.error("Create order failed", error);
                      alert("Không thể tạo đơn hàng PayPal. " + error.message);
                    }
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const response = await fetch(`http://localhost:3000/api/payment/paypal/capture-order`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order_id: data.orderID }),
                      });
                      const orderData = await response.json();
                      const errorDetail = orderData?.details?.[0];
                      
                      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                        return actions.restart();
                      } else if (errorDetail) {
                        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                      } else if (!orderData.success) {
                        throw new Error(JSON.stringify(orderData));
                      } else {
                        navigate('/checkout/success', { state: { method: 'paypal', total: total, orderId: data.orderID } });
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
                    onClick={() => handleSpecificCheckout('cod')}
                  >
                    <Truck size={22} style={{ strokeWidth: 1.5 }} />
                    <span style={{ fontWeight: 500 }}>Cash on Delivery</span>
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
