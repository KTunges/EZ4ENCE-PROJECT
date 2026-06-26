import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[70vh] flex-col text-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AlertTriangle size={80} className="text-pink mx-auto mb-6" />
        <h1 className="text-6xl font-bold mb-4 glitch-text" data-text="404">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Không tìm thấy trang</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không thể truy cập.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
          <Home size={20} /> Về trang chủ
        </Link>
      </motion.div>
    </div>
  );
}
