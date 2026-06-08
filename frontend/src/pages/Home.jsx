import { lazy, Suspense, useState } from 'react';
import { ArrowRight, Zap, Shield, ChevronRight, Star, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MarqueeBanner from '../components/ui/MarqueeBanner';
import CyberBackground from '../components/ui/CyberBackground';
import { useHackerText } from '../hooks/useHackerText';

// A wrapper component to handle hover state for hacker text
function HackerFeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const titleText = useHackerText(feature.title, isHovered, 30);
  const descText = useHackerText(feature.desc, isHovered, 15);

  return (
    <motion.div
      className="card feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="feature-icon">{feature.icon}</div>
      <h3>{isHovered ? titleText : feature.title}</h3>
      <p>{isHovered ? descText : feature.desc}</p>
    </motion.div>
  );
}

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
    <div className="home-page relative">
      <CyberBackground />

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
            <Suspense fallback={
              <div className="hero-3d-loading">
                <div className="hero-3d-spinner" />
              </div>
            }>
              <GamepadScene />
            </Suspense>
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
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">// TẠI SAO CHỌN EZ4ENCE</span>
          <h2 className="section-title glitch-text" data-text="Cam Kết Của Chúng Tôi">Cam Kết Của Chúng Tôi</h2>
          <p className="section-desc">Chúng tôi không chỉ bán hàng — chúng tôi xây dựng trải nghiệm.</p>
        </motion.div>
        <div className="features-grid">
          {features.map((f, index) => (
            <HackerFeatureCard key={f.title} feature={f} index={index} />
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS placeholder ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-tag">// HOT DEAL</span>
          <h2 className="section-title glitch-text" data-text="Sản Phẩm Bán Chạy">Sản Phẩm Bán Chạy</h2>
          <p className="section-desc">Những sản phẩm được game thủ yêu thích nhất tháng này.</p>
        </motion.div>
        <div className="products-grid">
          {[1, 2, 3, 4].map((item, index) => (
            <motion.div 
              key={item} 
              className="card product-placeholder"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              [Product {item}]
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
