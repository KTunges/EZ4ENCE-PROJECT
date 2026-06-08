import { lazy, Suspense } from 'react';
import { ArrowRight, Zap, Shield, Cpu, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const GamepadScene = lazy(() => import('../components/3d/GamepadScene'));


const stats = [
  { number: '10,000+', label: 'Sản phẩm' },
  { number: '50,000+', label: 'Khách hàng' },
  { number: '99.8%', label: 'Hài lòng' },
  { number: '24/7', label: 'Hỗ trợ' },
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
  return (
    <div className="home-page">

      {/* ── HERO (split layout) ── */}
      <section className="hero hero-split">
        <div className="container hero-split-inner">

          {/* Left: text */}
          <div className="hero-text">
            <div className="hero-badge">
              <Star size={12} />
              <span>GAMING &amp; TECH STORE #1 VIỆT NAM</span>
            </div>

            <h1 className="hero-title">
              Nâng Tầm Trải Nghiệm
              <span className="highlight">Gaming Của Bạn</span>
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
          </div>

          {/* Right: DualSense 3D từ GLB */}
          <div className="hero-3d">
            <Suspense fallback={
              <div className="hero-3d-loading">
                <div className="hero-3d-spinner" />
              </div>
            }>
              <GamepadScene />
            </Suspense>
          </div>

        </div>

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
      <section className="container" style={{ padding: '80px 28px' }}>
        <div className="section-header">
          <span className="section-tag">// TẠI SAO CHỌN EZ4ENCE</span>
          <h2 className="section-title">Cam Kết Của Chúng Tôi</h2>
          <p className="section-desc">Chúng tôi không chỉ bán hàng — chúng tôi xây dựng trải nghiệm.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="card feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS placeholder ── */}
      <section className="container" style={{ padding: '0 28px 100px' }}>
        <div className="section-header">
          <span className="section-tag">// HOT DEAL</span>
          <h2 className="section-title">Sản Phẩm Bán Chạy</h2>
          <p className="section-desc">Những sản phẩm được game thủ yêu thích nhất tháng này.</p>
        </div>
        <div className="products-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card product-placeholder">
              [Product {item}]
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
