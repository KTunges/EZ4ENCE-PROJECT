import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, MonitorPlay, Power } from 'lucide-react';
import MarqueeBanner from '../components/ui/MarqueeBanner';
import CyberBackground from '../components/ui/CyberBackground';
import CyberTimeline from '../components/ui/CyberTimeline';
import { useHackerText } from '../hooks/useHackerText';

// A wrapper component to handle hover state for hacker text
function HackerSpecCard({ spec, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const titleText = useHackerText(spec.title, isHovered, 30);
  const descText = useHackerText(spec.desc, isHovered, 15);

  return (
    <motion.div
      className="card spec-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="spec-header">
        <span className="spec-id">[{spec.id}]</span>
        <span className="spec-name">{spec.name}</span>
      </div>
      <div className="spec-icon">{spec.icon}</div>
      <h3 className="spec-title">{isHovered ? titleText : spec.title}</h3>
      <p className="spec-desc">{isHovered ? descText : spec.desc}</p>
    </motion.div>
  );
}

export default function About() {
  const specs = [
    {
      id: "CPU",
      name: "CENTRAL PROCESSING",
      icon: <Cpu size={32} />,
      title: "Tốc Độ & Chính Xác",
      desc: "Quy trình xử lý đơn hàng hỏa tốc. Giao hàng và lắp ráp tận nơi trong ngày."
    },
    {
      id: "RAM",
      name: "VOLATILE MEMORY",
      icon: <MemoryStick size={32} />,
      title: "Am Hiểu & Kinh Nghiệm",
      desc: "Đội ngũ kỹ thuật viên dày dặn kinh nghiệm, nắm bắt mọi kiến thức phần cứng mới nhất."
    },
    {
      id: "GPU",
      name: "GRAPHICS PROCESSING",
      icon: <MonitorPlay size={32} />,
      title: "Thẩm Mỹ & Cá Nhân Hóa",
      desc: "Setup những dàn máy không chỉ mạnh mẽ mà còn là tác phẩm nghệ thuật độc bản."
    },
    {
      id: "PSU",
      name: "POWER SUPPLY UNIT",
      icon: <Power size={32} />,
      title: "Bền Bỉ & Uy Tín",
      desc: "Chế độ bảo hành 1 đổi 1. Cam kết đồng hành lâu dài cùng trải nghiệm của bạn."
    }
  ];

  return (
    <div className="about-page relative">
      <CyberBackground />
      
      {/* ── HERO ── */}
      <section className="about-hero container relative z-10" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', paddingTop: '100px' }}>
        <div className="about-hero-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero-content"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}
          >
            <span className="section-tag" style={{ alignSelf: 'center', marginBottom: '20px' }}>// ARCHIVE.SYS</span>
            <h1 className="hero-title glitch-text" data-text="THE ORIGIN" style={{ textAlign: 'center' }}>THE ORIGIN</h1>
            <motion.h2 
              className="about-subtitle" 
              style={{ textAlign: 'center' }}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0 0 0)' }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
            >
              KHỞI NGUỒN CỦA EZ4ENCE
            </motion.h2>
            <motion.p 
              className="about-desc" 
              style={{ margin: '0 auto', textAlign: 'center' }}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0 0 0)' }}
              transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            >
              Khởi nguồn từ đam mê công nghệ và eSports, <strong>EZ4ENCE</strong> được tạo ra không chỉ để bán linh kiện. Chúng tôi là những người kiến tạo, mang đến những hệ thống siêu máy tính cá nhân hóa cho từng game thủ và dân chuyên nghiệp. 
            </motion.p>
          </motion.div>
        </div>
      </section>

      <MarqueeBanner />

      {/* ── CORE SPECS ── */}
      <section className="container relative z-10" style={{ padding: '80px 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
          style={{ marginBottom: '40px' }}
        >
          <span className="section-tag">// SYSTEM_CORE_VALUES</span>
          <h2 className="section-title glitch-text" data-text="Thông Số Cốt Lõi">Thông Số Cốt Lõi</h2>
          <p className="section-desc">Hãy rê chuột vào thẻ để giải mã thông tin.</p>
        </motion.div>

        <div className="specs-grid">
          {specs.map((spec, index) => (
            <HackerSpecCard key={spec.id} spec={spec} index={index} />
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
          style={{ marginBottom: '60px' }}
        >
          <span className="section-tag">// EVOLUTION_LOGS</span>
          <h2 className="section-title glitch-text" data-text="Lịch Trình Phát Triển">Lịch Trình Phát Triển</h2>
        </motion.div>
        <CyberTimeline />
      </section>

      {/* ── TECH PARTNERS ── */}
      <section className="container relative z-10" style={{ padding: '0 28px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-header text-center"
          style={{ marginBottom: '40px' }}
        >
          <span className="section-tag">// STRATEGIC_ALLIANCE</span>
          <h2 className="section-title glitch-text" data-text="Đối Tác Công Nghệ">Đối Tác Công Nghệ</h2>
          <p className="section-desc">Chúng tôi đồng hành cùng các thương hiệu phần cứng hàng đầu thế giới.</p>
        </motion.div>

        <div className="partners-grid">
          {["NVIDIA", "AMD", "INTEL", "ASUS ROG", "GIGABYTE", "CORSAIR"].map((brand, i) => (
            <motion.div
              key={brand}
              className="partner-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="partner-glitch"></div>
              <span>{brand}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
