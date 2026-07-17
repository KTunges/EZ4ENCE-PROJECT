import { lazy, Suspense, useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, ChevronRight, Star, Cpu, Laptop, Monitor, MonitorPlay, Keyboard, Mouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarqueeBanner from '../../components/ui/MarqueeBanner';
import ProductCard from '../../components/ui/ProductCard';
import ProductSkeleton from '../../components/ui/ProductSkeleton';
import FlashSaleBlock from '../../components/ui/FlashSaleBlock';
import { mapProduct } from '../../utils/productMapper';
import CyberBackground from '../../components/ui/CyberBackground';
import FullWidthBanner from '../../components/ui/FullWidthBanner';
import HeroSlider from '../../components/ui/HeroSlider';
import { useHackerText } from '../../hooks/useHackerText';

// A wrapper component to handle hover state for hacker text
function HackerFeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const titleText = useHackerText(feature.title, isHovered, 30);
  const descText = useHackerText(feature.desc, isHovered, 15);

  return (
    <div
      className="card feature-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="feature-icon">{feature.icon}</div>
      <h3>{isHovered ? titleText : feature.title}</h3>
      <p>{isHovered ? descText : feature.desc}</p>
    </div>
  );
}

import GamepadScene from '../../components/3d/GamepadScene';
const stats = [
  { number: '10,000+', label: 'Sản phẩm' },
  { number: '50,000+', label: 'Khách hàng' },
  { number: '99.8%', label: 'Hài lòng' },
  { number: '24/7', label: 'Hỗ trợ' },
];

const FEATURED_CATEGORIES = [
  { id: 1, name: 'Laptop Gaming', slug: 'Laptop Gaming', icon: <Laptop size={36} />, color: 'var(--cyan)' },
  { id: 2, name: 'PC EZ4ENCE', slug: 'PC EZ4ENCE', icon: <Monitor size={36} />, color: 'var(--purple)' },
  { id: 3, name: 'Linh Kiện PC', slug: 'Main, CPU, VGA', icon: <Cpu size={36} />, color: 'var(--pink)' },
  { id: 4, name: 'Màn Hình', slug: 'Màn hình', icon: <MonitorPlay size={36} />, color: 'var(--cyan)' },
  { id: 5, name: 'Bàn Phím Cơ', slug: 'Bàn phím', icon: <Keyboard size={36} />, color: 'var(--purple)' },
  { id: 6, name: 'Chuột Gaming', slug: 'Chuột + Lót chuột', icon: <Mouse size={36} />, color: 'var(--pink)' },
];

const PARTNER_BRANDS = [
  { id: 1, name: 'ASUS', logo: 'https://cdn.simpleicons.org/asus/white' },
  { id: 2, name: 'MSI', logo: 'https://cdn.simpleicons.org/msi/white' },
  { id: 3, name: 'Corsair', logo: 'https://cdn.simpleicons.org/corsair/white' },
  { id: 4, name: 'NVIDIA', logo: 'https://cdn.simpleicons.org/nvidia/white' },
  { id: 5, name: 'Intel', logo: 'https://cdn.simpleicons.org/intel/white' },
  { id: 6, name: 'AMD', logo: 'https://cdn.simpleicons.org/amd/white' },
  { id: 7, name: 'Razer', logo: 'https://cdn.simpleicons.org/razer/white' },
  { id: 8, name: 'SteelSeries', logo: 'https://cdn.simpleicons.org/steelseries/white' },
];

const features = [
  {
    icon: <Cpu size={28} color="var(--cyan)" />,
    title: 'Linh Kiện Chính Hãng',
    desc: 'Toàn bộ sản phẩm nhập khẩu trực tiếp từ nhà sản xuất, có đầy đủ tem, seal và hóa đơn hợp lệ.',
  },
  {
    icon: <Zap size={28} color="var(--cyan)" />,
    title: 'Giao Hàng Siêu Tốc',
    desc: 'Ship hỏa tốc trong ngày tại TP.HCM và Hà Nội. Toàn quốc từ 1-3 ngày làm việc.',
  },
  {
    icon: <Shield size={28} color="var(--cyan)" />,
    title: 'Bảo Hành 36 Tháng',
    desc: 'Cam kết 1 đổi 1 trong 30 ngày. Bảo hành chính hãng tại tất cả TTBH toàn quốc.',
  },
];

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/news?limit=4`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => setNewsList(data))
      .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?sort=popular&limit=10`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => {
        setBestSellers(data.map(mapProduct));
      })
      .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?sort=newest&limit=10`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => {
        setNewProducts(data.map(mapProduct));
      })
      .catch(console.error);
  }, []);
  return (
    <div className="home-page relative">
      <CyberBackground />
      <HeroSlider />

      {/* ── HERO (split layout) ── */}
      <section className="hero hero-split">
        <div className="container hero-split-inner">

          {/* Left: text */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="hero-badge">
              <Star size={12} />
              <span>GAMING &amp; TECH STORE #1 VIỆT NAM</span>
            </div>

            <h1 className="hero-title glitch-text" data-text="Nâng Tầm Trải Nghiệm">
              Nâng Tầm Trải Nghiệm
              <br />
              <span className="highlight glitch-text" data-text="Gaming Của Bạn">Gaming Của Bạn</span>
            </h1>

            <p className="hero-subtitle">
              Cung cấp linh kiện, PC, Laptop và Gaming Gear cao cấp chính hãng.
              Build PC theo yêu cầu — bảo hành tận nơi, tư vấn tận tâm.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                <span>Khám Phá Ngay</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/build-pc" className="btn btn-outline">
                Tự Build PC <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Right: DualSense 3D từ GLB */}
          <motion.div
            className="hero-3d"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <GamepadScene />
          </motion.div>

        </div>

        <MarqueeBanner />

        {/* Stats bar */}
        <div className="container">
          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="hero-stat-number">{s.number}</span>
                <p className="hero-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="container relative z-10" style={{ padding: '40px 28px 80px' }}>
        <div
          className="section-header"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '8px' }}
        >
          <span className="section-tag">// TẠI SAO CHỌN EZ4GEAR</span>
          <h2 className="section-title glitch-text" data-text="Cam Kết Của Chúng Tôi">Cam Kết Của Chúng Tôi</h2>
          <p className="section-desc">Chúng tôi không chỉ bán hàng — chúng tôi xây dựng trải nghiệm.</p>
        </div>
        <div className="features-grid">
          {features.map((f, index) => (
            <HackerFeatureCard key={f.title} feature={f} index={index} />
          ))}
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <div
          className="section-header"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '8px' }}
        >
          <span className="section-tag">// EXPLORE</span>
          <h2 className="section-title glitch-text" data-text="Danh Mục Nổi Bật">Danh Mục Nổi Bật</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          {FEATURED_CATEGORIES.map((cat, index) => (
            <div key={cat.id}>
              <Link to={`/products?category=${encodeURIComponent(cat.slug)}`} className="glass-premium neon-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', borderRadius: '16px', textDecoration: 'none', height: '100%' }}>
                <div className="neon-icon" style={{ color: cat.color, marginBottom: '16px', transition: 'all 0.3s ease' }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', textAlign: 'center', margin: 0 }}>{cat.name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARALLAX BANNER (Giữa trang) ── */}
      <FullWidthBanner
        position="home_middle"
        fallbackImage="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80"
        fallbackTitle="SETUP MƠ ƯỚC"
        fallbackDesc="Trải nghiệm không gian giải trí đỉnh cao với các thiết bị Gaming Gear xịn xò nhất từ EZ4GEAR."
      />

      {/* ── FLASH SALE ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 40px' }}>
        <FlashSaleBlock />
      </section>

      {/* ── NEW PRODUCTS ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <div
          className="section-header"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '8px' }}
        >
          <span className="section-tag">// MỚI RA MẮT</span>
          <h2 className="section-title glitch-text" data-text="Sản Phẩm Mới">Sản Phẩm Mới</h2>
          <p className="section-desc">Những siêu phẩm công nghệ vừa cập bến EZ4ENCE.</p>
        </div>
        <div className="products-grid">
          {newProducts.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} style={{ display: 'flex' }}>
                  <ProductSkeleton index={i} />
                </div>
              ))
            : newProducts.map((item, index) => (
                <div key={item.id} style={{ display: 'flex' }}>
                  <ProductCard product={item} index={index} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── FEATURED PRODUCTS placeholder ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <div
          className="section-header"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '8px' }}
        >
          <span className="section-tag">// HOT DEAL</span>
          <h2 className="section-title glitch-text" data-text="Sản Phẩm Bán Chạy">Sản Phẩm Bán Chạy</h2>
          <p className="section-desc">Những sản phẩm được game thủ yêu thích nhất tháng này.</p>
        </div>
        <div className="products-grid">
          {bestSellers.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} style={{ display: 'flex' }}>
                  <ProductSkeleton index={i} />
                </div>
              ))
            : bestSellers.map((item, index) => (
                <div key={item.id} style={{ display: 'flex' }}>
                  <ProductCard product={item} index={index} />
                </div>
              ))
          }
        </div>
      </section>


      {/* ── PARTNER BRANDS ── */}
      <section className="brand-marquee-container relative z-10" style={{ marginBottom: '100px' }}>
        <div className="container" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {/* Fading edges on the container are handled by CSS linear-gradient */}
        </div>
        <div className="brand-marquee-track">
          {/* Double the list for infinite scroll effect */}
          {[...PARTNER_BRANDS, ...PARTNER_BRANDS].map((brand, index) => (
            <img key={`${brand.id}-${index}`} src={brand.logo} alt={brand.name} className="brand-logo" />
          ))}
        </div>
      </section>

      {/* ── PARALLAX BANNER (Dưới cùng) ── */}
      <FullWidthBanner
        position="home_bottom"
        fallbackImage="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1920&q=80"
        fallbackTitle="BÙNG NỔ ƯU ĐÃI"
        fallbackDesc="Săn ngay các voucher cực khủng dành riêng cho thành viên của EZ4GEAR. Số lượng có hạn!"
      />

      {/* ── TECHNOLOGY NEWS ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <div
          className="section-header"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px', gap: '8px' }}
        >
          <span className="section-tag">// LATEST NEWS</span>
          <h2 className="section-title glitch-text" data-text="Tin Tức Công Nghệ">Tin Tức Công Nghệ</h2>
          <Link to="#" className="view-all-btn">Xem tất cả tin <ChevronRight size={16} /></Link>
        </div>

        <div className="news-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {newsList.map((news) => (
            <div key={news.id} className="news-card glass-panel">
              <Link to={`/news/${news.slug}`} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', transition: 'all 0.3s ease', height: '100%' }}>
                <div className="news-image-wrapper" style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  <img src={news.image_url || news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <span className="news-category-badge" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--cyan)', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{news.category || 'Chung'}</span>
                </div>
                <div className="news-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span className="news-date" style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '8px' }}>{new Date(news.published_at || news.date || news.created_at).toLocaleDateString('vi-VN')}</span>
                  <h3 className="news-title" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-color)', lineHeight: '1.4', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
