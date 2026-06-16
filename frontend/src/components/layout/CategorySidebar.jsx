import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Laptop, Gamepad2, Monitor, Cpu, Box, HardDrive, Speaker, Keyboard, Mouse, Headphones, AppWindow, Gamepad, Cable, Gift } from 'lucide-react';

const categories = [
  {
    icon: <Laptop size={18} />, label: 'Laptop', slug: 'Laptop',
    subMenu: [
      { title: 'Thương hiệu', items: ['Laptop ASUS', 'Laptop Acer', 'Laptop MSI', 'Laptop Lenovo', 'Laptop Dell', 'Laptop HP', 'Macbook'] },
      { title: 'Nhu cầu', items: ['Laptop Gaming', 'Laptop Văn phòng', 'Laptop Đồ hoạ', 'Laptop Cảm ứng'] },
      { title: 'Mức giá', items: ['Dưới 15 triệu', '15 - 20 triệu', '20 - 25 triệu', 'Trên 25 triệu'] }
    ]
  },
  {
    icon: <Gamepad2 size={18} />, label: 'Laptop Gaming', slug: 'Laptop Gaming',
    subMenu: [
      { title: 'Thương hiệu', items: ['ASUS ROG/TUF', 'Acer Nitro/Predator', 'MSI Gaming', 'Lenovo Legion', 'Dell Alienware/G-Series', 'HP Omen/Victus'] },
      { title: 'Card Đồ Họa (VGA)', items: ['RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090'] },
      { title: 'Tần số quét', items: ['120Hz', '144Hz', '165Hz', '240Hz', 'Trên 240Hz'] }
    ]
  },
  {
    icon: <Monitor size={18} />, label: 'PC EZ4ENCE', slug: 'PC EZ4ENCE',
    subMenu: [
      { title: 'Theo Nhu Cầu', items: ['PC Gaming', 'PC Đồ họa - Render', 'PC Văn phòng', 'PC Mini', 'PC Custom Nước'] },
      { title: 'Theo Mức Giá', items: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 30 triệu', '30 - 50 triệu', 'Hi-End Trên 50 triệu'] },
      { title: 'Cấu Hình Nổi Bật', items: ['PC Intel Core i5 / i7', 'PC AMD Ryzen 5 / 7', 'PC Full Trắng', 'PC RGB'] }
    ]
  },
  {
    icon: <Cpu size={18} />, label: 'Linh Kiện Máy Tính', slug: 'Linh Kiện Máy Tính',
    subMenu: [
      { title: 'Bo Mạch Chủ (Mainboard)', items: ['Intel', 'AMD', 'ASUS', 'MSI', 'Gigabyte'] },
      { title: 'Vi Xử Lý (CPU)', items: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { title: 'Card Màn Hình (VGA)', items: ['NVIDIA RTX', 'AMD Radeon', 'ASUS', 'Gigabyte', 'MSI'] },
      { title: 'RAM Máy Tính', items: ['DDR4', 'DDR5', 'RAM Laptop', 'RGB'] },
      { title: 'Ổ Cứng', items: ['SATA', 'NVMe PCIe', '1TB', 'HDD'] },
      { title: 'Vỏ Case', items: ['ASUS', 'Corsair', 'NZXT', 'Lianli'] },
      { title: 'Nguồn Máy Tính', items: ['ASUS', 'DeepCool', 'Corsair', '500W', '650W', '850W', '1000W'] },
      { title: 'Tản Nhiệt', items: ['AIO 240mm', 'AIO 360mm', 'Tản nhiệt khí', 'Fan RGB'] }
    ]
  },
  {
    icon: <Monitor size={18} />, label: 'Màn hình', slug: 'Màn hình',
    subMenu: [
      { title: 'Thương hiệu', items: ['ASUS', 'LG', 'Samsung', 'Dell', 'MSI'] },
      { title: 'Nhu cầu', items: ['Gaming', 'Đồ họa', 'Văn phòng', 'Cảm ứng'] },
      { title: 'Tần số quét & Phân giải', items: ['144Hz', '165Hz', '240Hz', '4K', 'Ultrawide'] }
    ]
  },
  {
    icon: <Keyboard size={18} />, label: 'Bàn phím', slug: 'Bàn phím',
    subMenu: [
      { title: 'Thương hiệu', items: ['Akko', 'Razer', 'Corsair', 'Logitech', 'Keychron'] },
      { title: 'Kết nối', items: ['Có dây', 'Không dây', 'Bluetooth'] },
      { title: 'Kích thước', items: ['Fullsize', 'TKL', 'Mini'] }
    ]
  },
  {
    icon: <Mouse size={18} />, label: 'Chuột + Lót chuột', slug: 'Chuột + Lót chuột',
    subMenu: [
      { title: 'Thương hiệu', items: ['Logitech', 'Razer', 'Corsair', 'Zowie', 'Pulsar'] },
      { title: 'Kết nối', items: ['Có dây', 'Không dây', 'Bluetooth'] },
      { title: 'Lót chuột', items: ['Size nhỏ', 'Deskmat', 'RGB', 'Kính'] }
    ]
  },
  {
    icon: <Headphones size={18} />, label: 'Âm thanh - Webcam', slug: 'Âm thanh - Webcam',
    subMenu: [
      { title: 'Tai Nghe', items: ['Over-ear', 'In-ear', 'True Wireless', 'Có dây'] },
      { title: 'Thương Hiệu', items: ['HyperX', 'Logitech', 'Razer', 'Sony', 'Corsair'] },
      { title: 'Loa Máy Tính', items: ['Bluetooth', 'Soundbar', '2.0', '2.1'] },
      { title: 'Webcam', items: ['720p', '1080p', '4K'] },
      { title: 'Microphone', items: ['USB', 'Condenser'] }
    ]
  },
  {
    icon: <AppWindow size={18} />, label: 'Phần mềm, mạng', slug: 'Phần mềm, mạng',
    subMenu: [
      { title: 'Thiết bị mạng', items: ['Router Wifi', 'Bộ phát Wifi Mesh', 'Switch', 'USB Thu Wifi'] },
      { title: 'Phần mềm', items: ['Windows Bản quyền', 'Microsoft Office', 'Phần mềm Diệt Virus', 'Phần mềm Đồ họa'] }
    ]
  },
  {
    icon: <Gamepad size={18} />, label: 'Handheld, Console', slug: 'Console',
    subMenu: [
      { title: 'Máy chơi game', items: ['PS5', 'Xbox Series X/S', 'Nintendo Switch', 'Steam Deck', 'ASUS ROG Ally'] },
      { title: 'Tay cầm', items: ['Tay cầm PS5', 'Tay cầm Xbox', 'Tay cầm PC', 'Vô lăng đua xe'] },
      { title: 'Đĩa Game', items: ['Game PS5', 'Game Nintendo Switch'] }
    ]
  },
  {
    icon: <Cable size={18} />, label: 'Phụ kiện', slug: 'Phụ kiện',
    subMenu: [
      { title: 'Phụ kiện Laptop/PC', items: ['Balo/Túi chống sốc', 'Cáp chuyển đổi (Hub)', 'Đế tản nhiệt Laptop', 'Giá đỡ màn hình (Arm)'] },
      { title: 'Phụ kiện khác', items: ['USB/Thẻ nhớ', 'Pin dự phòng', 'Cáp sạc điện thoại'] }
    ]
  },
  {
    icon: <Gift size={18} />, label: 'Dịch vụ khác', slug: 'Dịch vụ',
    subMenu: [
      { title: 'Dịch vụ', items: ['Vệ sinh PC/Laptop', 'Cài đặt Windows/Phần mềm', 'Bảo hành mở rộng', 'Thu cũ đổi mới'] },
      { title: 'Thanh toán', items: ['Trả góp qua Thẻ tín dụng', 'Trả góp qua Cty Tài chính'] }
    ]
  },
];

export default function CategorySidebar() {
  const [hiddenMenuIdx, setHiddenMenuIdx] = useState(null);

  return (
    <div className="category-sidebar glass-panel">
      <ul className="category-list">
        {categories.map((cat, idx) => (
          <li
            key={idx}
            className="category-item"
            onMouseLeave={() => setHiddenMenuIdx(null)}
          >
            <Link to={`/products?category=${cat.slug}`} className="category-link">
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.label}</span>
              <ChevronRight size={16} className="category-arrow" />
            </Link>

            {/* Mega Menu Flyout */}
            {cat.subMenu && (
              <div
                className="mega-menu glass-panel"
                style={hiddenMenuIdx === idx ? { display: 'none' } : {}}
              >
                <div className="mega-menu-content">
                  {cat.subMenu.map((column, colIdx) => (
                    <div key={colIdx} className="mega-menu-column">
                      <h4 className="mega-menu-title">{column.title}</h4>
                      <ul className="mega-menu-list">
                        {column.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              to={`/products?category=${cat.slug}&sub=${encodeURIComponent(item)}`}
                              className="mega-menu-item"
                              onClick={() => setHiddenMenuIdx(idx)}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
