import { motion } from 'framer-motion';

export default function CyberTimeline() {
  const events = [
    { year: "2026", title: "Khởi tạo Hệ thống", desc: "EZ4GEAR ra mắt nền tảng thương mại điện tử công nghệ thế hệ mới." },
    { year: "2027", title: "Trí Tuệ Nhân Tạo", desc: "Tích hợp AI tư vấn cấu hình tự động hóa và tối ưu trải nghiệm người dùng." },
    { year: "2028", title: "Thực Tế Ảo (VR/AR)", desc: "Phát triển hệ sinh thái VR để khách hàng trải nghiệm sản phẩm trực tuyến ngay tại nhà." },
    { year: "2030", title: "Kỷ Nguyên Metaverse", desc: "Tiên phong phân phối thiết bị Neuralink và gia nhập hoàn toàn vào thế giới số hóa." }
  ];

  return (
    <div className="cyber-timeline">
      <div className="timeline-line">
        <motion.div 
          className="timeline-glow"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
      
      {events.map((event, index) => (
        <motion.div 
          key={event.year}
          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.3 }}
        >
          <div className="timeline-content">
            <h3 className="timeline-year text-gradient">{event.year}</h3>
            <h4 className="timeline-title">{event.title}</h4>
            <p className="timeline-desc">{event.desc}</p>
          </div>
          <div className="timeline-node">
            <div className="node-core"></div>
            <div className="node-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
