import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronRight, Shield, Truck, RotateCcw, Package, Check, Gift, MapPin, Search, Share2, RefreshCcw, Image as ImageIcon, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../../components/ui/CyberBackground';
import ProductCard from '../../components/ui/ProductCard';
import ProductDetailSkeleton from '../../components/ui/ProductDetailSkeleton';
import ShareButton from '../../components/ui/ShareButton';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

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
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products/${slug}`)
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
          soldCount: data.sold_count || 0,
          description: data.description || '',
          specifications: data.specifications || {},
          images: data.images?.length > 0 ? data.images.map(img => img.url) : [],
          skus: data.skus?.length > 0 ? data.skus.map(sku => ({
            id: sku.id,
            label: sku.sku_code || 'Tiêu chuẩn',
            price: sku.promotional_price || sku.price || 0,
            originalPrice: sku.promotional_price ? sku.price : null,
            stock: sku.stock_quantity || 0
          })) : [{ id: 'default', label: 'Tiêu chuẩn', price: 0, originalPrice: null, stock: 0 }],
          reviews: data.skus?.length > 0 
            ? data.skus.flatMap(sku => sku.reviews || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
            : []
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
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?category_slug=${data.category?.slug}`)
          .then(r => r.json().then(d => d.data || d))
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
              fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?limit=5`)
                .then(r => r.json().then(d => d.data || d))
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
  const [activeTab, setActiveTab] = useState('specs');
  const navigate = useNavigate();
  const currentSkuId = product?.skus?.[selectedSku]?.id;
  const wishlisted = currentSkuId ? isWishlisted(currentSkuId) : false;
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play gallery images
  useEffect(() => {
    let interval;
    if (isAutoPlaying && product?.images?.length > 1) {
      interval = setInterval(() => {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, product?.images?.length]);
  
  const { user, token } = useAuth();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);

  const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
          window.toast.info('Chỉ được phép chọn tối đa 5 ảnh!');
          return;
      }
      setReviewImages(files);
  };

  const handleSubmitReview = async () => {
    if (!token) return;
    if (!reviewComment.trim()) {
        setReviewError('Vui lòng nhập nội dung đánh giá');
        return;
    }
    setIsSubmittingReview(true);
    setReviewError('');
    try {
      const formData = new FormData();
      formData.append('sku_id', currentSkuId);
      formData.append('rating', reviewRating);
      formData.append('comment', reviewComment);
      reviewImages.forEach(img => formData.append('images', img));

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Lỗi gửi đánh giá');
      
      setProduct(prev => {
         const newCount = prev.reviewCount + 1;
         const newRating = ((prev.rating * prev.reviewCount) + reviewRating) / newCount;
         return {
            ...prev,
            reviews: [data, ...prev.reviews],
            reviewCount: newCount,
            rating: Number(newRating.toFixed(1))
         };
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewImages([]);
      setShowReviewForm(false);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
      if (!token) {
          window.toast.error('Vui lòng đăng nhập để đánh giá hữu ích!');
          return;
      }
      try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/reviews/${reviewId}/like`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setProduct(prev => {
                  const newReviews = prev.reviews.map(r => 
                      r.id === reviewId ? { ...r, is_liked_by_user: data.is_liked, helpful_count: data.helpful_count } : r
                  );
                  return { ...prev, reviews: newReviews };
              });
          }
      } catch (err) {
          console.error(err);
      }
  };

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

  const handleBuyNow = () => {
    if (!currentSku) return;
    if (currentSku.stock === 0) {
      window.toast.error('Sản phẩm tạm hết hàng!');
      return;
    }
    // Navigate to checkout with specific item state
    navigate('/checkout', { 
      state: { 
        buyNowItem: {
          sku_id: currentSku.id,
          product_name: product.name,
          sku_code: currentSku.sku_code,
          price: currentSku.price,
          quantity: quantity,
          image_url: product.images?.[0]
        }
      } 
    });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <div className="product-detail-page"><div className="container" style={{paddingTop: '20px'}}>Lỗi: {error || 'Không tìm thấy sản phẩm'}</div></div>;
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
              {product.soldCount > 0 && (
                <span className="rating-count" style={{ marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border)' }}>Đã bán {product.soldCount}</span>
              )}
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

              <ShareButton productName={product.name} productSlug={product.slug} />
            </div>

            <button 
              onClick={handleBuyNow} 
              className="btn btn-outline btn-buy-now" 
              style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              disabled={!currentSku || currentSku.stock === 0}
            >
              <ChevronRight size={18} /> MUA NGAY
            </button>

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
                    
                    <div className="summary-action">
                      {user ? (
                         <button className="btn btn-primary" onClick={() => setShowReviewForm(!showReviewForm)}>
                           {showReviewForm ? 'Hủy' : 'Viết Đánh Giá'}
                         </button>
                      ) : (
                         <Link to="/login" className="btn btn-outline">Đăng nhập để đánh giá</Link>
                      )}
                    </div>
                  </div>

                  {showReviewForm && (
                     <div className="review-form-container glass-panel" style={{ marginTop: '24px', padding: '28px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Star size={20} fill="var(--cyan)" stroke="var(--cyan)" />
                          Viết đánh giá của bạn
                        </h3>
                        {reviewError && <div style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px', padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{reviewError}</div>}
                        
                        <div style={{ marginBottom: '20px' }}>
                           <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Chọn số sao</label>
                           <div style={{ display: 'flex', gap: '6px' }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                 <Star 
                                    key={s} 
                                    size={32} 
                                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                    fill={s <= reviewRating ? '#38bdf8' : 'none'} 
                                    stroke={s <= reviewRating ? '#38bdf8' : 'var(--text-dim)'}
                                    onClick={() => setReviewRating(s)}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                 />
                              ))}
                           </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                           <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Nhận xét</label>
                           <textarea 
                              className="checkout-input"
                              rows="4" 
                              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                              value={reviewComment}
                              onChange={e => setReviewComment(e.target.value)}
                              style={{ width: '100%', resize: 'vertical', minHeight: '100px' }}
                           ></textarea>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                           <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
                             <ImageIcon size={16} /> Đính kèm ảnh (Tối đa 5)
                           </label>
                           <label style={{ 
                             display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                             background: 'rgba(56, 189, 248, 0.08)', border: '1px dashed rgba(56, 189, 248, 0.3)', 
                             borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: '#38bdf8', 
                             fontWeight: '500', transition: 'all 0.2s ease'
                           }}
                             onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)'; }}
                             onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; }}
                           >
                             <ImageIcon size={18} /> Chọn ảnh
                             <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                           </label>
                           {reviewImages.length > 0 && (
                               <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                                   {reviewImages.map((img, i) => (
                                       <div key={i} style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '6px', color: 'var(--text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', border: '1px solid var(--border)' }}>{img.name}</div>
                                   ))}
                               </div>
                           )}
                        </div>

                        <button 
                           className="btn btn-primary" 
                           onClick={handleSubmitReview}
                           disabled={isSubmittingReview}
                           style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 'bold' }}
                        >
                           {isSubmittingReview ? 'Đang gửi...' : '✦ Gửi Đánh Giá'}
                        </button>
                     </div>
                  )}

                  <div className="reviews-list" style={{ marginTop: '30px' }}>
                    {product.reviews.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                         <Star size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} stroke="var(--text-dim)" />
                         <p style={{ fontSize: '16px' }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                       </div>
                    ) : (
                       product.reviews.map(review => {
                           const initial = review.user_name ? review.user_name.charAt(0).toUpperCase() : 'K';
                           const date = new Date(review.created_at).toLocaleDateString('vi-VN');
                           return (
                             <div key={review.id} style={{ padding: '24px', borderBottom: '1px solid var(--border)', marginBottom: '0', transition: 'background 0.2s' }}
                               onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                               onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                             >
                               <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                 <div style={{ 
                                   width: '44px', height: '44px', borderRadius: '50%', 
                                   background: 'rgba(56, 189, 248, 0.1)', border: '2px solid rgba(56, 189, 248, 0.3)', 
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                   fontWeight: 'bold', color: '#38bdf8', fontSize: '16px', flexShrink: 0,
                                   overflow: 'hidden'
                                 }}>
                                    {review.user_avatar ? <img src={review.user_avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : initial}
                                 </div>
                                 <div style={{ flex: 1 }}>
                                   <strong style={{ display: 'block', fontSize: '15px', marginBottom: '2px' }}>{review.user_name || 'Khách hàng'}</strong>
                                   <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{date}</span>
                                 </div>
                                 <div style={{ display: 'flex', gap: '3px' }}>
                                   {[1, 2, 3, 4, 5].map(s => (
                                     <Star key={s} size={14} fill={s <= review.rating ? '#38bdf8' : 'none'} stroke={s <= review.rating ? '#38bdf8' : 'var(--text-dim)'} />
                                   ))}
                                 </div>
                               </div>
                               <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '14px', marginBottom: '0' }}>{review.comment}</p>
                               
                               {review.images && review.images.length > 0 && (
                                   <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                                       {review.images.map((img, idx) => (
                                           <img key={idx} src={img.url} alt="Review" 
                                             style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }} 
                                             onClick={() => window.open(img.url, '_blank')} 
                                             onMouseOver={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                             onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; }}
                                           />
                                       ))}
                                   </div>
                               )}
                               
                               <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                   <button 
                                       onClick={() => handleLikeReview(review.id)}
                                       style={{ 
                                         display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', 
                                         background: review.is_liked_by_user ? 'rgba(56, 189, 248, 0.1)' : 'transparent', 
                                         border: `1px solid ${review.is_liked_by_user ? 'rgba(56, 189, 248, 0.3)' : 'var(--border)'}`, 
                                         color: review.is_liked_by_user ? '#38bdf8' : 'var(--text-muted)', 
                                         padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', 
                                         transition: 'all 0.2s ease', fontWeight: '500'
                                       }}
                                       onMouseOver={(e) => { if (!review.is_liked_by_user) { e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.color = '#38bdf8'; }}}
                                       onMouseOut={(e) => { if (!review.is_liked_by_user) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                                   >
                                       <ThumbsUp size={14} fill={review.is_liked_by_user ? "currentColor" : "none"} /> 
                                       {review.helpful_count > 0 ? `Hữu ích (${review.helpful_count})` : 'Hữu ích'}
                                   </button>
                               </div>

                               {review.admin_reply && (
                                   <div style={{ marginTop: '16px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.15)', padding: '16px', borderRadius: '12px' }}>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                           <Shield size={14} style={{ color: '#38bdf8' }} />
                                           <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>Phản hồi từ EZ4ENCE</span>
                                       </div>
                                       <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>{review.admin_reply}</p>
                                   </div>
                               )}
                             </div>
                           );
                       })
                    )}
                  </div>
                </div>
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
