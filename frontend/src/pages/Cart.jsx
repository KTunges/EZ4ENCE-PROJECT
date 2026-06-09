import { useState } from 'react';
import { Trash2, Plus, Minus, Tag, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialCartItems = [
  {
    id: 1,
    name: 'VGA ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    variant: 'Màu: Đen | Bản: OC Edition',
    price: 55000000,
    quantity: 1,
    stock: true,
    image: 'https://via.placeholder.com/150/1a1a2e/00d2ff?text=RTX+4090',
  },
  {
    id: 2,
    name: 'Chuột Logitech G Pro X Superlight 2 Wireless',
    variant: 'Màu: Trắng | Switch: Quang học',
    price: 3200000,
    quantity: 2,
    stock: true,
    image: 'https://via.placeholder.com/150/1a1a2e/ff0055?text=Superlight',
  },
  {
    id: 3,
    name: 'Bàn phím cơ Razer Huntsman V2 Analog',
    variant: 'Layout: US | Switch: Analog Optical',
    price: 4500000,
    quantity: 1,
    stock: true,
    image: 'https://via.placeholder.com/150/1a1a2e/7000ff?text=Huntsman',
  }
];

export default function Cart() {
  const [items, setItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 0 : 0; // Free shipping
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="cart-page-container fade-in">
      <div className="container">
        
        <div className="cart-page-header">
          <h1 className="glitch-text text-3xl font-bold" data-text="GIỎ HÀNG">GIỎ HÀNG</h1>
          <p className="text-muted">{items.length} Sản phẩm trong giỏ hàng</p>
        </div>

        {items.length === 0 ? (
          <div className="cart-page-empty glass">
            <h2>Giỏ hàng của bạn đang trống!</h2>
            <p className="text-muted">Có vẻ như bạn chưa chọn sản phẩm nào để nâng cấp góc máy của mình.</p>
            <Link to="/products" className="btn btn-primary mt-4">Tiếp Tục Mua Sắm</Link>
          </div>
        ) : (
          <div className="cart-grid">
            
            {/* Left Column: Cart Items */}
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className={`cart-page-item glass ${!item.stock ? 'out-of-stock' : ''}`}>
                  <div className="item-image-wrapper">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <div className="item-title-row">
                      <Link to={`/products/${item.id}`} className="item-name">{item.name}</Link>
                      <button className="item-remove-btn" onClick={() => handleRemove(item.id)} title="Xoá khỏi giỏ hàng">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <p className="item-variant">{item.variant}</p>
                    
                    <div className="item-status">
                      {item.stock ? (
                        <span className="status-in-stock"><ShieldCheck size={14} /> Còn hàng</span>
                      ) : (
                        <span className="status-out-stock">Hết hàng</span>
                      )}
                    </div>
                    
                    <div className="item-price-row">
                      <div className="item-price">
                        {formatPrice(item.price)}
                      </div>
                      
                      <div className="item-quantity">
                        <button onClick={() => handleQuantityChange(item.id, -1)} disabled={!item.stock}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)} disabled={!item.stock}><Plus size={16} /></button>
                      </div>
                      
                      <div className="item-total-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="cart-actions-bottom">
                <Link to="/products" className="btn btn-outline">
                  Tiếp Tục Mua Sắm
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-wrapper">
              <div className="cart-summary glass">
                <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>
                
                <div className="summary-row">
                  <span>Tạm tính ({items.length} SP):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span className="text-cyan">{items.length > 0 ? 'Miễn phí' : '0 ₫'}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="promo-code-container">
                  <div className="promo-input-wrapper">
                    <Tag size={18} className="promo-icon" />
                    <input 
                      type="text" 
                      placeholder="Nhập mã giảm giá" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-outline promo-btn">ÁP DỤNG</button>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span className="total-label">Tổng cộng:</span>
                  <span className="total-value">{formatPrice(total)}</span>
                </div>
                <p className="tax-note">(Đã bao gồm VAT nếu có)</p>

                <Link to="/checkout" className="btn btn-primary btn-checkout">
                  TIẾN HÀNH THANH TOÁN <ChevronRight size={20} />
                </Link>
                
                <div className="checkout-features">
                  <div className="feature-item">
                    <ShieldCheck size={16} className="text-cyan" /> 
                    <span>Bảo hành chính hãng</span>
                  </div>
                  <div className="feature-item">
                    <Truck size={16} className="text-pink" /> 
                    <span>Giao hàng hoả tốc 2H</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
