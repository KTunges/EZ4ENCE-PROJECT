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
    icon: <Monitor size={18} />, label: 'PC EZ4GEAR', slug: 'PC',
    subMenu: [
      { title: 'Theo Nhu Cầu', items: ['PC Gaming', 'PC Đồ họa - Render', 'PC Văn phòng', 'PC Mini', 'PC Custom Nước'] },
      { title: 'Theo Mức Giá', items: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 30 triệu', '30 - 50 triệu', 'Hi-End Trên 50 triệu'] },
      { title: 'Cấu Hình Nổi Bật', items: ['PC Intel Core i5 / i7', 'PC AMD Ryzen 5 / 7', 'PC Full Trắng', 'PC RGB'] }
    ]
  },
  {
    icon: <Cpu size={18} />, label: 'Main, CPU, VGA', slug: 'Mainboard',
    subMenu: [
      { title: 'Bo Mạch Chủ (Mainboard)', items: ['Mainboard Intel', 'Mainboard AMD', 'Mainboard ASUS', 'Mainboard MSI', 'Mainboard Gigabyte'] },
      { title: 'Vi Xử Lý (CPU)', items: ['CPU Intel Core i3/i5', 'CPU Intel Core i7/i9', 'CPU AMD Ryzen 3/5', 'CPU AMD Ryzen 7/9'] },
      { title: 'Card Màn Hình (VGA)', items: ['VGA NVIDIA (RTX)', 'VGA AMD (Radeon)', 'VGA ASUS', 'VGA Gigabyte', 'VGA MSI'] }
    ]
  },
  {
    icon: <Box size={18} />, label: 'Case, Nguồn, Tản', slug: 'Case',
    subMenu: [
      { title: 'Case - Theo hãng', items: ['Case ASUS', 'Case Corsair', 'Case Lianli', 'Case NZXT', 'Case Jonsbo', 'Xem tất cả'] },
      { title: 'Case - Theo giá', items: ['Dưới 1 triệu', 'Từ 1 triệu đến 2 triệu', 'Trên 2 triệu', 'Xem tất cả'] },
      { title: 'Nguồn - Theo Hãng', items: ['Nguồn ASUS', 'Nguồn DeepCool', 'Nguồn Corsair', 'Nguồn NZXT', 'Nguồn MSI', 'Xem tất cả'] },
      { title: 'Nguồn - Theo công suất', items: ['Từ 400w - 500w', 'Từ 500w - 600w', 'Từ 700w - 800w', 'Trên 1000w', 'Xem tất cả'] },
      { title: 'Phụ kiện PC', items: ['Dây LED', 'Dây rise - Dựng VGA', 'Giá đỡ VGA', 'Keo tản nhiệt', 'Xem tất cả'] },
      { title: 'Loại tản nhiệt', items: ['Tản nhiệt AIO 240mm', 'Tản nhiệt AIO 280mm', 'Tản nhiệt AIO 360mm', 'Tản nhiệt AIO 420mm', 'Tản nhiệt khí', 'Fan RGB', 'Xem tất cả'] }
    ]
  },
  {
    icon: <HardDrive size={18} />, label: 'Ổ cứng, RAM', slug: 'RAM',
    subMenu: [
      { title: 'RAM Máy Tính', items: ['RAM DDR4', 'RAM DDR5', 'RAM Laptop', 'RAM Có LED RGB'] },
      { title: 'Ổ Cứng Thể Rắn (SSD)', items: ['SSD 2.5 inch SATA', 'SSD M.2 NVMe PCIe', 'SSD Dung lượng 256GB-512GB', 'SSD Dung lượng 1TB+'] },
      { title: 'Ổ Cứng Cơ (HDD)', items: ['HDD 1TB', 'HDD 2TB', 'HDD 4TB+'] }
    ]
  },
  {
    icon: <Speaker size={18} />, label: 'Loa, Webcam', slug: 'Loa',
    subMenu: [
      { title: 'Loa', items: ['Loa Bluetooth', 'Loa Soundbar', 'Loa Vi Tính 2.0/2.1', 'Loa Gaming'] },
      { title: 'Webcam', items: ['Webcam 720p', 'Webcam 1080p', 'Webcam 4K', 'Webcam Livestream'] },
      { title: 'Microphone', items: ['Microphone USB', 'Microphone Condenser', 'Arm/Stand Kẹp Mic'] }
    ]
  },
  {
    icon: <Monitor size={18} />, label: 'Màn hình', slug: 'Màn hình',
    subMenu: [
      { title: 'Thương hiệu', items: ['Màn hình ASUS', 'Màn hình LG', 'Màn hình Samsung', 'Màn hình Dell', 'Màn hình MSI'] },
      { title: 'Nhu cầu', items: ['Màn hình Gaming', 'Màn hình Đồ họa', 'Màn hình Văn phòng', 'Màn hình Cảm ứng'] },
      { title: 'Thông số', items: ['Màn hình 144Hz+', 'Màn hình 240Hz+', 'Màn hình 4K', 'Màn hình Ultrawide'] }
    ]
  },
  {
    icon: <Keyboard size={18} />, label: 'Bàn phím', slug: 'Bàn phím',
    subMenu: [
      { title: 'Thương hiệu', items: ['Bàn phím Akko', 'Bàn phím Razer', 'Bàn phím Corsair', 'Bàn phím Logitech', 'Bàn phím Keychron'] },
      { title: 'Loại bàn phím', items: ['Bàn phím Cơ', 'Bàn phím Giả cơ', 'Bàn phím Không dây', 'Bàn phím Custom'] },
      { title: 'Size', items: ['Fullsize (104 phím)', 'TKL (87 phím)', 'Mini (60-65%)'] }
    ]
  },
  {
    icon: <Mouse size={18} />, label: 'Chuột + Lót chuột', slug: 'Chuột',
    subMenu: [
      { title: 'Chuột Gaming', items: ['Logitech G', 'Razer', 'Corsair', 'Zowie', 'Pulsar'] },
      { title: 'Chuột Văn phòng', items: ['Chuột Không dây', 'Chuột Bluetooth', 'Chuột Ergonomic'] },
      { title: 'Lót chuột', items: ['Lót chuột Size nhỏ', 'Lót chuột Size lớn (Deskmat)', 'Lót chuột RGB', 'Lót chuột Kính/Nhôm'] }
    ]
  },
  {
    icon: <Headphones size={18} />, label: 'Tai Nghe', slug: 'Tai nghe',
    subMenu: [
      { title: 'Loại Tai Nghe', items: ['Tai nghe Over-ear', 'Tai nghe In-ear', 'Tai nghe True Wireless', 'Tai nghe Có dây'] },
      { title: 'Nhu Cầu', items: ['Tai nghe Gaming', 'Tai nghe Âm nhạc/Studio', 'Tai nghe Thể thao'] },
      { title: 'Thương Hiệu', items: ['HyperX', 'Logitech', 'Razer', 'Sony', 'Corsair'] }
    ]
  },
  {
    icon: <AppWindow size={18} />, label: 'Phần mềm, mạng', slug: 'Phần mềm',
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
