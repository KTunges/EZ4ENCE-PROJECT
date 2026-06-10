import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Zap, ShieldCheck, Smartphone, QrCode, Globe } from 'lucide-react';
import CustomSelect from '../components/ui/CustomSelect';

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
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 0;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
                    <div className="option-icon text-cyan"><Truck size={24} /></div>
                    <div className="option-details">
                      <h4>Giao hàng tiêu chuẩn</h4>
                      <p>Dự kiến giao trong 2-3 ngày</p>
                    </div>
                    <div className="option-price text-cyan">Miễn phí</div>
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
                    <div className="option-icon text-pink"><Zap size={24} /></div>
                    <div className="option-details">
                      <h4>Giao hàng Hỏa Tốc 2H</h4>
                      <p>Nhận ngay trong vòng 2 giờ</p>
                    </div>
                    <div className="option-price text-pink">50.000 ₫</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-panel glass">
              <h2 className="panel-title">3. Phương Thức Thanh Toán</h2>
              <div className="options-grid payment-methods-grid">
                <label className={`option-card payment-cod ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="option-content">
                    <div className="option-icon text-cyan"><Truck size={24} /></div>
                    <div className="option-details">
                      <h4>Thanh toán khi nhận hàng (COD)</h4>
                      <p>Thanh toán bằng tiền mặt khi nhận</p>
                    </div>
                  </div>
                </label>
                
                <label className={`option-card payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="option-content">
                    <div className="option-icon text-purple"><CreditCard size={24} /></div>
                    <div className="option-details">
                      <h4>Thẻ Tín Dụng / Ghi Nợ</h4>
                      <p>Hỗ trợ Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </label>

                <label className={`option-card payment-vnpay ${paymentMethod === 'vnpay' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                  />
                  <div className="option-content">
                    <div className="option-icon" style={{color: '#005BAA'}}><QrCode size={24} /></div>
                    <div className="option-details">
                      <h4>VNPAY-QR</h4>
                      <p>Quét mã QR qua ứng dụng ngân hàng</p>
                    </div>
                  </div>
                </label>

                <label className={`option-card payment-momo ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={() => setPaymentMethod('momo')}
                  />
                  <div className="option-content">
                    <div className="option-icon" style={{color: '#A50064'}}><Smartphone size={24} /></div>
                    <div className="option-details">
                      <h4>Ví điện tử MoMo</h4>
                      <p>Thanh toán siêu tốc qua ứng dụng MoMo</p>
                    </div>
                  </div>
                </label>

                <label className={`option-card payment-paypal ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <div className="option-content">
                    <div className="option-icon" style={{color: '#003087'}}><Globe size={24} /></div>
                    <div className="option-details">
                      <h4>PayPal</h4>
                      <p>Thanh toán quốc tế an toàn</p>
                    </div>
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

              <button className="btn btn-primary btn-place-order">
                ĐẶT HÀNG NGAY
              </button>

              <div className="security-note">
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
