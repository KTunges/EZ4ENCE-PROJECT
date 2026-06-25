import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronRight, Shield, Truck, RotateCcw, Package, Check, Gift, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../../components/ui/CyberBackground';
import ProductCard from '../../components/ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Fetch product detail
    setLoading(true);
    fetch(`http://localhost:8000/api/products/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then(data => {
        // Map backend detail to frontend schema
        const mappedProduct = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          brand: data.brand?.name || 'Unknown',
          category: data.category?.name || 'Unknown',
          rating: data.rating || 5,
          reviewCount: data.review_count || 0,
          description: data.description || '',
          specifications: data.specifications || {},
          images: data.images?.length > 0 ? data.images.map(img => img.url) : [],
          skus: data.skus?.length > 0 ? data.skus.map(sku => ({
            id: sku.id,
            label: sku.sku_code || 'Tiêu chuẩn',
            price: sku.price || 0,
            originalPrice: sku.promotional_price,
            stock: sku.stock_quantity || 0
          })) : [{ id: 'default', label: 'Tiêu chuẩn', price: 0, originalPrice: null, stock: 0 }],
          reviews: [] // mock reviews for now as backend doesn't have it
        };
        setProduct(mappedProduct);
        setLoading(false);

        // Save to recently viewed
        try {
          const recentStr = localStorage.getItem('recently_viewed');
          let recentList = recentStr ? JSON.parse(recentStr) : [];
          recentList = recentList.filter(p => p.id !== mappedProduct.id);
          recentList.unshift({
            id: mappedProduct.id,
            slug: mappedProduct.slug,
            name: mappedProduct.name,
            price: mappedProduct.skus[0].price,
            image: mappedProduct.images[0] || '',
            timestamp: Date.now()
          });
          if (recentList.length > 12) recentList = recentList.slice(0, 12);
          localStorage.setItem('recently_viewed', JSON.stringify(recentList));
        } catch(e) { console.error('Lỗi lưu SP đã xem', e); }

        // Fetch related products (same category)
        fetch(`http://localhost:8000/api/products?category_slug=${data.category?.slug}`)
          .then(r => r.json())
          .then(list => {
            const mappedList = list
              .filter(item => item.id !== data.id)
              .map(item => ({
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
                badge: item.skus?.[0]?.promotional_price > item.skus?.[0]?.price ? 'HOT' : null,
                specs: Object.values(item.specifications || {}).slice(0, 4),
                stock: item.skus?.[0]?.stock_quantity || 0
              })).slice(0, 4);
            
            if (mappedList.length > 0) {
              setRelatedProducts(mappedList);
            } else {
              // Nếu không có sản phẩm cùng danh mục, lấy random sản phẩm khác
              fetch(`http://localhost:8000/api/products?limit=5`)
                .then(r => r.json())
                .then(fallbackList => {
                  const mappedFallback = fallbackList
                    .filter(item => item.id !== data.id)
                    .map(item => ({
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
                      badge: item.skus?.[0]?.promotional_price > item.skus?.[0]?.price ? 'HOT' : null,
                      specs: Object.values(item.specifications || {}).slice(0, 4),
                      stock: item.skus?.[0]?.stock_quantity || 0
                    })).slice(0, 4);
                  setRelatedProducts(mappedFallback);
                })
                .catch(e => console.error(e));
            }
          });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSku, setSelectedSku] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const currentSkuId = product?.skus?.[selectedSku]?.id;
  const wishlisted = currentSkuId ? isWishlisted(currentSkuId) : false;
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!product || product.images?.length <= 1 || !isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [product, selectedImage, isAutoPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky cart when scrolled past 600px
      if (window.scrollY > 600) {
        setShowStickyCart(true);
      } else {
        setShowStickyCart(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSku = product?.skus?.[selectedSku];

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const discount = currentSku?.originalPrice
    ? Math.round((1 - currentSku.price / currentSku.originalPrice) * 100)
    : 0;

  if (loading) {
    return <div className="product-detail-page"><div className="container" style={{paddingTop: 100}}>Đang tải thông tin sản phẩm...</div></div>;
  }

  if (error || !product) {
    return <div className="product-detail-page"><div className="container" style={{paddingTop: 100}}>Lỗi: {error || 'Không tìm thấy sản phẩm'}</div></div>;
  }

  return (
    <div className="product-detail-page">
      <CyberBackground />

      {/* ── BREADCRUMB ── */}
      <section className="product-detail-header">
        <div className="container">
          <div className="breadcrumb">

            <Link to="/products">Sản phẩm</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{product.name}</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="container product-detail-main">
        <div className="product-detail-grid">

          {/* LEFT: Image Gallery */}
          <motion.div
            className="product-gallery"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gallery-main-wrapper glass">
              {product.images.length > 0 ? (
                <div className="gallery-slider-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={selectedImage}
                      src={product.images[selectedImage] || product.images[0]} 
                      alt={product.name} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </AnimatePresence>
                  
                  {product.images.length > 1 && (
                    <>
                      <button 
                        className="slider-arrow prev" 
                        onClick={() => { setIsAutoPlaying(false); setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1)); }}
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                      >
                        <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                      </button>
                      <button 
                        className="slider-arrow next" 
                        onClick={() => { setIsAutoPlaying(false); setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1)); }}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', minHeight: '400px', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '18px' }}>Chưa có hình</span>
                </div>
              )}
              {discount > 0 && <span className="gallery-discount-badge">-{discount}%</span>}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`gallery-thumb ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => { setIsAutoPlaying(false); setSelectedImage(idx); }}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Product Info */}
          <motion.div
            className="product-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Brand & Category */}
            <div className="product-info-meta">
              <span className="product-info-brand">{product.brand}</span>
              <span className="product-info-category">{product.category}</span>
            </div>

            {/* Name */}
            <h1 className="product-info-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-info-rating">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={16} fill={s <= product.rating ? 'var(--cyan)' : 'none'} stroke={s <= product.rating ? 'var(--cyan)' : 'var(--text-dim)'} />
              ))}
              <span className="rating-text">{product.rating}/5</span>
              <span className="rating-count">({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="product-info-price-block">
              <span className="product-info-price">{formatPrice(currentSku.price)}</span>
              {currentSku.originalPrice && currentSku.originalPrice > currentSku.price && (
                <>
                  <span className="product-info-original">{formatPrice(currentSku.originalPrice)}</span>
                  <span className="product-info-discount">-{discount}%</span>
                </>
              )}
            </div>

            {/* Promotional Offers */}
            <div className="product-promotions glass-panel">
              <div className="promo-header">
                <Gift size={18} className="text-pink" />
                <strong>Khuyến mãi cực HOT</strong>
              </div>
              <ul className="promo-list">
                <li>Nhập mã <strong>EZ4GEAR50</strong> giảm 50K cho đơn từ 2 triệu</li>
                <li>Tặng lót chuột Gaming XL khi mua kèm Bàn phím / Chuột</li>
                <li>Giảm thêm 5% khi thanh toán qua VNPAY-QR</li>
              </ul>
            </div>

            {/* SKU Selector */}
            {product.skus.length > 1 && (
              <div className="product-sku-selector">
                <label className="sku-label">Phiên bản:</label>
                <div className="sku-options">
                  {product.skus.map((sku, idx) => (
                    <button
                      key={sku.id}
                      className={`sku-btn ${selectedSku === idx ? 'active' : ''} ${sku.stock === 0 ? 'disabled' : ''}`}
                      onClick={() => { if (sku.stock > 0) { setSelectedSku(idx); setQuantity(1); } }}
                      disabled={sku.stock === 0}
                    >
                      {sku.label}
                      {sku.stock === 0 && <span className="sku-oos">Hết hàng</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="product-stock-status">
              {currentSku.stock > 0 ? (
                <span className="stock-available"><Check size={14} /> Còn hàng</span>
              ) : (
                <span className="stock-unavailable">Hết hàng</span>
              )}
            </div>



            {/* Quantity + Add to Cart */}
            <div className="product-action-row">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={currentSku.stock === 0}>
                  <Minus size={16} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(currentSku.stock, q + 1))} disabled={currentSku.stock === 0}>
                  <Plus size={16} />
                </button>
              </div>

              <button 
                className="btn btn-primary btn-add-cart" 
                disabled={currentSku.stock === 0}
                onClick={() => addToCart(currentSku.id, quantity)}
              >
                <ShoppingCart size={18} />
                {currentSku.stock > 0 ? 'Thêm Vào Giỏ Hàng' : 'Tạm Hết Hàng'}
              </button>

              <button
                className={`btn-wishlist-detail ${wishlisted ? 'active' : ''}`}
                onClick={async () => {
                  if (currentSkuId) {
                    await toggleWishlist(currentSkuId);
                  }
                }}
                aria-label="Yêu thích"
              >
                <Heart size={20} fill={wishlisted ? 'var(--pink)' : 'none'} />
              </button>
            </div>

            <Link to="/checkout" className="btn btn-outline btn-buy-now" style={{ width: '100%', textAlign: 'center' }}>
              <ChevronRight size={18} /> MUA NGAY
            </Link>

            {/* Trust Badges */}
            <div className="product-trust-badges">
              <div className="trust-badge">
                <Shield size={18} className="text-cyan" />
                <div>
                  <strong>Bảo hành 36 tháng</strong>
                  <span>Chính hãng 1 đổi 1</span>
                </div>
              </div>
              <div className="trust-badge">
                <Truck size={18} className="text-pink" />
                <div>
                  <strong>Giao hàng 2H</strong>
                  <span>Nội thành HCM & HN</span>
                </div>
              </div>
              <div className="trust-badge">
                <RotateCcw size={18} className="text-purple" />
                <div>
                  <strong>Đổi trả 30 ngày</strong>
                  <span>Miễn phí hoàn tiền</span>
                </div>
              </div>
              <div className="trust-badge">
                <Package size={18} className="text-cyan" />
                <div>
                  <strong>Hàng chính hãng</strong>
                  <span>Tem seal đầy đủ</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY CART BAR ── */}
      <AnimatePresence>
        {showStickyCart && (
          <motion.div 
            className="sticky-cart-bar glass"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container sticky-cart-inner">
              <div className="sticky-cart-info">
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>No img</span>
                  </div>
                )}
                <div className="sticky-cart-text">
                  <div className="sticky-cart-name">{product.name}</div>
                  <div className="sticky-cart-price">{formatPrice(currentSku.price)}</div>
                </div>
              </div>
              <div className="sticky-cart-actions">
                <button 
                  className="btn btn-primary btn-add-cart" 
                  disabled={currentSku.stock === 0}
                  onClick={() => addToCart(currentSku.id, quantity)}
                >
                  <ShoppingCart size={18} />
                  Thêm Vào Giỏ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TABS ── */}
      <section className="container product-tabs-section">
        <div className="product-tabs glass">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
              Mô tả sản phẩm
            </button>
            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
              Thông số kỹ thuật
            </button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Đánh giá ({product.reviews.length})
            </button>
          </div>

          <div className="tabs-content">
            {/* Description */}
            {activeTab === 'description' && (
              <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <div className="product-description-content">
                  {product.description.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Specs */}
            {activeTab === 'specs' && (
              <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {product.reviews.length === 0 ? (
                  <div className="reviews-empty">
                    <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                    <button className="btn btn-outline" style={{ marginTop: 16 }}>Viết đánh giá đầu tiên</button>
                  </div>
                ) : (
                  <div className="reviews-container">
                    <div className="reviews-summary glass-panel">
                      <div className="summary-score">
                        <h2>{product.rating}</h2>
                        <div className="summary-stars">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={18} fill={s <= product.rating ? 'var(--cyan)' : 'none'} stroke={s <= product.rating ? 'var(--cyan)' : 'var(--text-dim)'} />
                          ))}
                        </div>
                        <p>{product.reviewCount} đánh giá</p>
                      </div>
                      <div className="summary-bars">
                        {[5, 4, 3, 2, 1].map(star => {
                          const percent = star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 5 : 0;
                          return (
                            <div key={star} className="bar-row">
                              <span>{star} Sao</span>
                              <div className="progress-bg">
                                <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                              </div>
                              <span className="percent-text">{percent}%</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="summary-action">
                        <button className="btn btn-primary">Viết Đánh Giá</button>
                      </div>
                    </div>

                    <div className="reviews-list">
                      {product.reviews.map(review => (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <div className="review-avatar">{review.user.charAt(0)}</div>
                            <div className="review-meta">
                              <strong className="review-user">{review.user}</strong>
                              <span className="review-date">{review.date}</span>
                            </div>
                            <div className="review-stars">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={13} fill={s <= review.rating ? 'var(--cyan)' : 'none'} stroke={s <= review.rating ? 'var(--cyan)' : 'var(--text-dim)'} />
                              ))}
                            </div>
                          </div>
                          <p className="review-content">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      <section className="container product-related-section">
        <div className="section-header">
          <span className="section-tag">// CÓ THỂ BẠN QUAN TÂM</span>
          <h2 className="section-title glitch-text" data-text="Sản Phẩm Liên Quan">Sản Phẩm Liên Quan</h2>
        </div>
        <div className="products-grid-container grid-view" style={{ maxWidth: '100%' }}>
          {relatedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
