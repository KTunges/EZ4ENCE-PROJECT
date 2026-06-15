import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, Tag, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ui/ProductCard';
import AuthModal from '../../components/ui/AuthModal';

export default function Cart() {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Fetch recommended products for empty cart state
    if (!cart || cart.items.length === 0) {
      fetch('http://localhost:8000/api/products?limit=8')
        .then(res => res.json())
        .then(data => {
          const mapped = data.filter(item => item.images && item.images.length > 0 && !item.images[0].url.includes('dummy')).slice(0, 4).map(item => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            brand: item.brand?.name || 'Unknown',
            category: item.category?.name || 'Unknown',
            price: item.skus?.[0]?.price || 0,
            originalPrice: item.skus?.[0]?.promotional_price || null,
            image: item.images?.[0]?.url || '',
            rating: item.rating || 5,
            reviewCount: item.review_count || 0,
            badge: item.skus?.[0]?.promotional_price < item.skus?.[0]?.price ? 'HOT' : null,
          }));
          setRecommendedProducts(mapped);
        })
        .catch(console.error);
    }
  }, [cart]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user && !loading) {
      // Optional: uncomment below to auto redirect to login
      // navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleQuantityChange = (id, change, currentQty, maxStock) => {
    const newQuantity = Math.max(1, currentQty + change);
    if (newQuantity <= maxStock) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const items = cart?.items || [];
  const subtotal = cart?.total_amount || 0;
  const shipping = items.length > 0 ? 0 : 0; // Free shipping
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!user) {
    return (
      <div className="cart-page-container fade-in">
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <h2 className="glitch-text text-3xl font-bold" data-text="VUI LÒNG ĐĂNG NHẬP">VUI LÒNG ĐĂNG NHẬP</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Bạn cần đăng nhập để quản lý giỏ hàng của mình.</p>
          <button onClick={() => setShowAuth(true)} className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>ĐĂNG NHẬP NGAY</button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  if (loading && !cart) {
    return <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>;
  }

  return (
    <div className="cart-page-container fade-in">
      <div className="container">
        
        <div className="cart-page-header">
          <h1 className="glitch-text text-3xl font-bold" data-text="GIỎ HÀNG">GIỎ HÀNG</h1>
          <p className="text-muted">{items.length} Sản phẩm trong giỏ hàng</p>
        </div>

        {items.length === 0 ? (
          <div className="cart-page-empty glass" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '60px 20px', textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="text-3xl font-bold">Giỏ hàng của bạn đang trống!</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Có vẻ như bạn chưa chọn sản phẩm nào để nâng cấp góc máy của mình.</p>
            <Link to="/products" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>TIẾP TỤC MUA SẮM</Link>
          </div>
        ) : (
          <div className="cart-grid">
            
            {/* Left Column: Cart Items */}
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className={`cart-page-item glass ${item.stock_quantity === 0 ? 'out-of-stock' : ''}`}>
                  <div className="item-image-wrapper">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>No Img</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <div className="item-title-row">
                      <Link to={`/products/${item.product_slug}`} className="item-name">{item.product_name}</Link>
                      <button className="item-remove-btn" onClick={() => handleRemove(item.id)} title="Xoá khỏi giỏ hàng">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <p className="item-variant">Mã SKU: {item.sku_code}</p>
                    
                    <div className="item-status">
                      {item.stock_quantity > 0 ? (
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
                        <button onClick={() => handleQuantityChange(item.id, -1, item.quantity, item.stock_quantity)} disabled={item.stock_quantity === 0}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1, item.quantity, item.stock_quantity)} disabled={item.quantity >= item.stock_quantity}><Plus size={16} /></button>
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

        {/* Recommended Products (show regardless of empty state but styled distinctly) */}
        {recommendedProducts.length > 0 && (
          <div style={{ marginTop: '60px', paddingBottom: '60px' }}>
            <h3 className="glitch-text text-2xl font-bold" data-text="CÓ THỂ BẠN SẼ THÍCH" style={{ marginBottom: '24px' }}>CÓ THỂ BẠN SẼ THÍCH</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {recommendedProducts.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex' }}>
                  <ProductCard product={item} index={idx} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
