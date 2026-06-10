import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus, ChevronRight, Shield, Truck, RotateCcw, Package, Check, Gift, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/ui/CyberBackground';
import ProductCard from '../components/ui/ProductCard';
import ImageMagnifier from '../components/ui/ImageMagnifier';

/* ─── MOCK PRODUCT DETAIL ─── */
const MOCK_DETAIL = {
  'vga-asus-rog-strix-rtx-4090': {
    id: '1',
    name: 'VGA ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    slug: 'vga-asus-rog-strix-rtx-4090',
    brand: 'ASUS',
    category: 'VGA',
    categorySlug: 'vga',
    rating: 5,
    reviewCount: 128,
    description: `Card đồ họa ASUS ROG Strix GeForce RTX 4090 OC Edition mang đến hiệu năng gaming đỉnh cao với kiến trúc Ada Lovelace mới nhất từ NVIDIA. Được trang bị 24GB bộ nhớ GDDR6X siêu tốc, card đáp ứng mọi nhu cầu từ gaming 4K 144Hz đến render đồ họa chuyên nghiệp.

Hệ thống tản nhiệt Axial-tech thế hệ mới với 3 quạt lớn cùng thiết kế heatsink khổng lồ giúp giữ nhiệt độ luôn ở mức tối ưu ngay cả khi hoạt động ở hiệu năng tối đa. LED Aura Sync RGB tích hợp cho phép đồng bộ ánh sáng với toàn bộ hệ thống.`,
    specifications: {
      'GPU': 'NVIDIA GeForce RTX 4090',
      'Kiến trúc': 'Ada Lovelace',
      'CUDA Cores': '16,384',
      'Bộ nhớ': '24GB GDDR6X',
      'Bus': '384-bit',
      'Xung nhịp Boost': '2,610 MHz (OC Mode)',
      'TDP': '450W',
      'Cổng xuất hình': '3x DisplayPort 1.4a, 2x HDMI 2.1',
      'Kích thước': '357.6 x 149.3 x 70.1 mm',
      'Nguồn yêu cầu': '850W trở lên',
      'Cổng nguồn phụ': '1x 16-pin (12VHPWR)',
    },
    images: [
      'https://product.hstatic.net/200000722513/product/thumb-web-asus-rog-strix-rtx4090_65bed05f84f04c65b0cca5efdcf5e3fd_1024x1024.png',
      'https://product.hstatic.net/200000722513/product/rog-strix-rtx4090-2_f5d8c0b3b3f64c3fa7bf1e8e7c0f95d6_1024x1024.jpg',
      'https://product.hstatic.net/200000722513/product/rog-strix-rtx4090-3_a1c5b37fa5e24b7893b2c8d4e3f6a9e1_1024x1024.jpg',
      'https://product.hstatic.net/200000722513/product/rog-strix-rtx4090-4_d2e6f8a1b3c54d7e9f0a1b2c3d4e5f6a_1024x1024.jpg',
    ],
    skus: [
      { id: 'sku-1', label: 'OC Edition', price: 55000000, originalPrice: 62000000, stock: 5 },
      { id: 'sku-2', label: 'Standard Edition', price: 50000000, originalPrice: 55000000, stock: 12 },
      { id: 'sku-3', label: 'White Edition', price: 58000000, originalPrice: 65000000, stock: 0 },
    ],
    reviews: [
      { id: 'r1', user: 'ProGamer_VN', avatar: null, rating: 5, date: '2026-05-20', content: 'Card quá mạnh, chơi 4K max setting mượt mà. Tản nhiệt rất tốt, nhiệt độ chỉ khoảng 65°C khi full load. Xứng đáng đồng tiền bát gạo!' },
      { id: 'r2', user: 'TechReviewer', avatar: null, rating: 5, date: '2026-05-15', content: 'Render video 4K nhanh gấp 3 lần card cũ. Build quality xuất sắc, LED RGB đẹp. Hơi nặng nhưng hiệu năng bù lại tất cả.' },
      { id: 'r3', user: 'SetupKing', avatar: null, rating: 4, date: '2026-05-10', content: 'Card rất tốt nhưng cần lưu ý nguồn phải đủ 850W trở lên. Mình dùng nguồn 750W bị shutdown liên tục. Sau khi nâng nguồn thì mọi thứ hoàn hảo.' },
    ],
  },
};

/* ─── FALLBACK DETAIL (cho tất cả slug khác) ─── */
const FALLBACK_DETAIL = {
  id: '99',
  name: 'Sản phẩm Gaming Premium',
  slug: 'san-pham-gaming-premium',
  brand: 'EZ4ENCE',
  category: 'Gaming Gear',
  categorySlug: 'gaming-gear',
  rating: 4,
  reviewCount: 42,
  description: 'Sản phẩm gaming cao cấp, chính hãng 100%. Bảo hành 36 tháng, giao hàng siêu tốc trong 2 giờ tại TP.HCM và Hà Nội.',
  specifications: {
    'Thương hiệu': 'Premium',
    'Bảo hành': '36 tháng',
    'Xuất xứ': 'Chính hãng',
  },
  images: [
    'https://product.hstatic.net/200000722513/product/thumb-web-asus-rog-strix-rtx4090_65bed05f84f04c65b0cca5efdcf5e3fd_1024x1024.png',
  ],
  skus: [
    { id: 'sku-f1', label: 'Standard', price: 5000000, originalPrice: 6000000, stock: 10 },
  ],
  reviews: [],
};

/* ─── RELATED PRODUCTS ─── */
const RELATED_PRODUCTS = [
  { id: '2', slug: 'chuot-logitech-g-pro-x-superlight-2', name: 'Chuột Logitech G Pro X Superlight 2', brand: 'Logitech', price: 3200000, originalPrice: 3500000, image: 'https://product.hstatic.net/200000722513/product/thumbweb_superlight_2_white_b01eaed5e34e4e5fb000b731f61f4430_1024x1024.png', rating: 5, reviewCount: 256, badge: 'HOT' },
  { id: '3', slug: 'ban-phim-razer-huntsman-v3-pro', name: 'Bàn Phím Cơ Razer Huntsman V3 Pro TKL', brand: 'Razer', price: 4500000, originalPrice: 5200000, image: 'https://product.hstatic.net/200000722513/product/huntsman-v3-pro-tkl-1_d8f5be6db21e41ac833c1e5e0bb2b1cd_1024x1024.png', rating: 4, reviewCount: 89, badge: 'NEW' },
  { id: '4', slug: 'tai-nghe-steelseries-arctis-nova-pro', name: 'Tai Nghe SteelSeries Arctis Nova Pro Wireless', brand: 'SteelSeries', price: 9200000, originalPrice: 10500000, image: 'https://product.hstatic.net/200000722513/product/thumbweb_arctis_nova_pro_wireless_47e9e52c6c2b444aa89e70d5a6c39e94_1024x1024.png', rating: 5, reviewCount: 67, badge: 'HOT' },
  { id: '5', slug: 'cpu-intel-core-i9-14900k', name: 'CPU Intel Core i9-14900K', brand: 'Intel', price: 14500000, originalPrice: 16000000, image: 'https://product.hstatic.net/200000722513/product/cpu-intel-core-i9-14900k_afef37e07d704ee0a70c201497a8b26a_1024x1024.png', rating: 5, reviewCount: 203, badge: 'HOT' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const product = MOCK_DETAIL[slug] || { ...FALLBACK_DETAIL, slug };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSku, setSelectedSku] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [deliveryRegion, setDeliveryRegion] = useState('hcm');

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

  const currentSku = product.skus[selectedSku];

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const discount = currentSku.originalPrice
    ? Math.round((1 - currentSku.price / currentSku.originalPrice) * 100)
    : 0;

  const relatedProducts = RELATED_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

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
              <ImageMagnifier 
                src={product.images[selectedImage]} 
                alt={product.name} 
                zoomLevel={2}
                magnifierWidth={200}
                magnifierHeight={200}
              />
              {discount > 0 && <span className="gallery-discount-badge">-{discount}%</span>}
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`gallery-thumb ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
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
                <li>Nhập mã <strong>EZ4ENCE50</strong> giảm 50K cho đơn từ 2 triệu</li>
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
                <span className="stock-available"><Check size={14} /> Còn hàng ({currentSku.stock} sản phẩm)</span>
              ) : (
                <span className="stock-unavailable">Hết hàng</span>
              )}
            </div>

            {/* Delivery Estimation */}
            <div className="delivery-estimation">
              <div className="delivery-header">
                <MapPin size={16} className="text-cyan" />
                <span>Giao hàng tới:</span>
                <select 
                  className="delivery-select"
                  value={deliveryRegion}
                  onChange={(e) => setDeliveryRegion(e.target.value)}
                >
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="hn">Hà Nội</option>
                  <option value="other">Tỉnh thành khác</option>
                </select>
              </div>
              <div className="delivery-result">
                <Truck size={14} />
                <span>
                  {deliveryRegion === 'hcm' && 'Giao siêu tốc 2H (Nội thành)'}
                  {deliveryRegion === 'hn' && 'Giao siêu tốc 2H (Nội thành)'}
                  {deliveryRegion === 'other' && 'Giao hàng tiêu chuẩn 2-4 ngày'}
                </span>
              </div>
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

              <button className="btn btn-primary btn-add-cart" disabled={currentSku.stock === 0}>
                <ShoppingCart size={18} />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                className={`btn-wishlist-detail ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Yêu thích"
              >
                <Heart size={20} fill={isWishlisted ? 'var(--pink)' : 'none'} />
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
                <img src={product.images[0]} alt={product.name} />
                <div className="sticky-cart-text">
                  <div className="sticky-cart-name">{product.name}</div>
                  <div className="sticky-cart-price">{formatPrice(currentSku.price)}</div>
                </div>
              </div>
              <div className="sticky-cart-actions">
                <button className="btn btn-primary btn-add-cart" disabled={currentSku.stock === 0}>
                  <ShoppingCart size={18} />
                  <span>Thêm Vào Giỏ</span>
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
