import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, Tag, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ui/ProductCard';
import AuthModal from '../../components/ui/AuthModal';
import PageSkeleton from '../../components/ui/PageSkeleton';

export default function Cart() {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  useEffect(() => {
    if (cart?.items && !hasInitializedSelection) {
      setSelectedItems(cart.items.filter(item => item.stock_quantity > 0).map(i => i.id));
      setHasInitializedSelection(true);
    }
  }, [cart, hasInitializedSelection]);

  useEffect(() => {
    // Fetch recommended products for empty cart state
    if (!cart || cart.items.length === 0) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?limit=8`)
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
    setSelectedItems(prev => prev.filter(i => i !== id));
  };

  const items = cart?.items || [];
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const availableItems = items.filter(i => i.stock_quantity > 0);
  const handleSelectAll = () => {
    if (selectedItems.length === availableItems.length && availableItems.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(availableItems.map(i => i.id));
    }
  };

  const activeItems = items.filter(item => selectedItems.includes(item.id));
  const subtotal = activeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeshipEligible = subtotal >= 2000000;
  const finalShippingFee = isFreeshipEligible ? 0 : (shippingCalculated ? shippingFee : 0);
  
  const discountAmount = appliedPromo ? appliedPromo.final_discount : 0;
  const total = subtotal + finalShippingFee - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/promotions/apply`, {
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

  useEffect(() => {
    // Fetch default shipping fee if user has a default address
    if (user && token && items.length > 0) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const defaultAddr = data.find(a => a.is_default) || (data.length > 0 ? data[0] : null);
        if (defaultAddr) {
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/shipping/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              city: String(defaultAddr.city), 
              district: String(defaultAddr.district_id || defaultAddr.district), 
              ward: String(defaultAddr.ward_code || defaultAddr.ward), 
              weight_grams: 1000,
              province_name: defaultAddr.city,
              district_name: defaultAddr.district,
              ward_name: defaultAddr.ward
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.options && data.options.length > 0) {
              const cheapest = [...data.options].sort((a,b) => a.fee - b.fee)[0];
              setShippingFee(cheapest.fee);
              setShippingCalculated(true);
            }
          })
          .catch(console.error);
        } else {
          setShippingCalculated(false);
        }
      })
      .catch(console.error);
    }
  }, [user, token, items.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!user) {
    return (
      <div className="cart-page-container fade-in">
        <div className="container" style={{ textAlign: 'center', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <h2 className="glitch-text text-3xl font-bold" data-text="VUI LÒNG ĐĂNG NHẬP">VUI LÒNG ĐĂNG NHẬP</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Bạn cần đăng nhập để quản lý giỏ hàng của mình.</p>
          <button onClick={() => setShowAuth(true)} className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>ĐĂNG NHẬP NGAY</button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  if (loading && !cart) {
    return <PageSkeleton variant="cart" />;
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
              <div className="cart-select-all glass" style={{ padding: '16px 20px', marginBottom: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === availableItems.length && availableItems.length > 0}
                  onChange={handleSelectAll}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 'bold' }}>Chọn tất cả ({availableItems.length} sản phẩm)</span>
              </div>
              
              {items.map(item => (
                <div key={item.id} className={`cart-page-item glass ${item.stock_quantity === 0 ? 'out-of-stock' : ''}`} style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
                  <div style={{ marginRight: '16px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      disabled={item.stock_quantity === 0}
                      style={{ width: '18px', height: '18px', cursor: item.stock_quantity === 0 ? 'not-allowed' : 'pointer' }}
                    />
                  </div>
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
                  <span>Tạm tính ({totalQuantity} SP):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span className="text-cyan">
                    {activeItems.length === 0 ? '0 ₫' : (isFreeshipEligible ? 'Miễn phí' : (shippingCalculated ? formatPrice(shippingFee) : 'Tính khi thanh toán'))}
                  </span>
                </div>

                <div className="summary-divider"></div>

                <div className="promo-code-container">
                  <div className="promo-input-wrapper">
                    <Tag size={18} className="promo-icon" />
                    <input 
                      type="text" 
                      placeholder="Nhập mã giảm giá" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={promoLoading || appliedPromo}
                    />
                  </div>
                  {appliedPromo ? (
                    <button className="btn btn-outline promo-btn" onClick={() => { setAppliedPromo(null); setPromoCode(''); }} style={{ borderColor: '#ef4444', color: '#ef4444' }}>HỦY</button>
                  ) : (
                    <button className="btn btn-outline promo-btn" onClick={handleApplyPromo} disabled={promoLoading || !promoCode.trim()}>
                      {promoLoading ? '...' : 'ÁP DỤNG'}
                    </button>
                  )}
                </div>
                {promoError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>{promoError}</p>}
                {appliedPromo && <p style={{ color: '#22c55e', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>{appliedPromo.message}</p>}

                <div className="summary-divider"></div>

                {appliedPromo && (
                  <div className="summary-row" style={{ color: '#22c55e' }}>
                    <span>Giảm giá ({appliedPromo.code}):</span>
                    <span>-{formatPrice(appliedPromo.final_discount)}</span>
                  </div>
                )}

                <div className="summary-total-row">
                  <span className="total-label">Tổng cộng:</span>
                  <span className="total-value">{formatPrice(total)}</span>
                </div>
                <p className="tax-note">(Đã bao gồm VAT nếu có)</p>

                <Link 
                  to="/checkout" 
                  state={{ 
                    initialPromoCode: appliedPromo?.code || (promoCode && !promoError ? promoCode : ''),
                    selectedItems: selectedItems
                  }} 
                  className={`btn btn-primary btn-checkout ${selectedItems.length === 0 ? 'disabled' : ''}`}
                  onClick={(e) => { if (selectedItems.length === 0) e.preventDefault(); }}
                  style={selectedItems.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
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
