import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Laptop, Gamepad2, Monitor, Cpu, Box, HardDrive, Speaker, Keyboard, Mouse, Headphones, AppWindow, Gamepad, Cable, Gift } from 'lucide-react';

export const categories = [
  {
    icon: <Laptop size={18} />, label: 'Laptop', slug: 'Laptop',
    subMenu: [
      { title: 'Thương hiệu', items: ['Laptop ASUS', 'Laptop Acer', 'Laptop MSI', 'Laptop Lenovo', 'Laptop Dell', 'Laptop HP', 'Macbook'] },
      { title: 'Nhu cầu', items: ['Laptop Văn phòng', 'Laptop Đồ hoạ', 'Laptop Cảm ứng', 'Laptop Mỏng nhẹ'] },
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
    icon: <Cpu size={18} />, label: 'Main, CPU, VGA', slug: 'Main, CPU, VGA',
    subMenu: [
      { title: 'Bo Mạch Chủ Intel', items: ['Z890', 'Z790', 'B760', 'H610'] },
      { title: 'Bo Mạch Chủ AMD', items: ['X870', 'X670', 'B650', 'A620'] },
      { title: 'CPU Intel', items: ['Intel Core Ultra', 'Intel Core i9', 'Intel Core i7', 'Intel Core i5', 'Intel Core i3'] },
      { title: 'CPU AMD', items: ['AMD Ryzen 9', 'AMD Ryzen 7', 'AMD Ryzen 5'] },
      { title: 'VGA NVIDIA', items: ['RTX 4090', 'RTX 4080 Super', 'RTX 4070 Ti Super', 'RTX 4070 Super', 'RTX 4060 Ti', 'RTX 4060', 'RTX 3060'] },
      { title: 'VGA AMD', items: ['RX 7900 XTX', 'RX 7800 XT', 'RX 7700 XT', 'RX 7600'] }
    ]
  },
  {
    icon: <Box size={18} />, label: 'Case, Nguồn, Tản', slug: 'Case, Nguồn, Tản',
    subMenu: [
      { title: 'Vỏ Case', items: ['ASUS', 'Corsair', 'NZXT', 'Lian Li', 'Montech', 'DeepCool'] },
      { title: 'Nguồn Máy Tính', items: ['Corsair', 'ASUS', 'MSI', 'Gigabyte', 'DeepCool', '500W - 650W', '750W - 850W', '1000W+'] },
      { title: 'Tản Nhiệt AIO', items: ['AIO 240mm', 'AIO 360mm', 'AIO Có Màn Hình'] },
      { title: 'Tản Nhiệt Khí & Fan', items: ['Tản Khí Đơn', 'Tản Khí Đôi', 'Fan RGB'] }
    ]
  },
  {
    icon: <HardDrive size={18} />, label: 'Ổ cứng, RAM, Thẻ nhớ', slug: 'Ổ cứng, RAM, Thẻ nhớ',
    subMenu: [
      { title: 'Dung Lượng RAM', items: ['8GB', '16GB', '32GB', '64GB'] },
      { title: 'Loại RAM & Hãng', items: ['DDR4', 'DDR5', 'Corsair', 'Kingston', 'G.Skill'] },
      { title: 'Dung Lượng SSD', items: ['256GB', '512GB', '1TB', '2TB', 'Trên 2TB'] },
      { title: 'Loại Ổ Cứng & Hãng', items: ['SSD NVMe PCIe', 'SSD SATA', 'HDD 1TB - 4TB', 'Samsung', 'WD'] }
    ]
  },
  {
    icon: <Speaker size={18} />, label: 'Loa, Micro, Webcam', slug: 'Loa, Micro, Webcam',
    subMenu: [
      { title: 'Thương Hiệu Loa', items: ['Edifier', 'Logitech', 'Razer', 'SoundMax'] },
      { title: 'Kiểu Loa', items: ['Loa vi tính', 'Loa Bluetooth', 'Loa Soundbar'] },
      { title: 'Microphone', items: ['Micro HyperX', 'Micro USB', 'Micro Condenser'] },
      { title: 'Webcam', items: ['Độ phân giải 4K', 'Độ phân giải 1080p', 'Độ phân giải 720p'] }
    ]
  },
  {
    icon: <Monitor size={18} />, label: 'Màn hình', slug: 'Màn hình',
    subMenu: [
      { title: 'Thương hiệu', items: ['ASUS', 'LG', 'Samsung', 'Dell', 'MSI', 'Gigabyte', 'AOC'] },
      { title: 'Tần số quét', items: ['144Hz', '165Hz', '240Hz', '360Hz', '540Hz'] },
      { title: 'Độ phân giải', items: ['Full HD', '2K 1440p', '4K UHD', 'Ultrawide'] },
      { title: 'Kích thước', items: ['24 Inch', '27 Inch', '32 Inch', 'Cong (Curved)'] }
    ]
  },
  {
    icon: <Keyboard size={18} />, label: 'Bàn phím', slug: 'Bàn phím',
    subMenu: [
      { title: 'Thương hiệu', items: ['Akko', 'Razer', 'Corsair', 'Logitech', 'Keychron', 'Leopold', 'SteelSeries'] },
      { title: 'Kết nối', items: ['Bluetooth', 'Wireless', 'Có Dây'] },
      { title: 'Loại Bàn Phím', items: ['Rapid Trigger', 'Cơ (Mechanical)', 'Fullsize', 'TKL', 'Mini'] }
    ]
  },
  {
    icon: <Mouse size={18} />, label: 'Chuột + Lót chuột', slug: 'Chuột + Lót chuột',
    subMenu: [
      { title: 'Thương hiệu Chuột', items: ['Logitech', 'Razer', 'Corsair', 'Zowie', 'Pulsar', 'ASUS', 'SteelSeries'] },
      { title: 'Kết nối & Loại', items: ['Không dây (Wireless)', 'Có dây', 'Siêu nhẹ (Superlight)'] },
      { title: 'Lót chuột', items: ['Pad Size Nhỏ', 'Pad Deskmat (Lớn)', 'Pad Kính / Cứng', 'Pad Mềm'] }
    ]
  },
  {
    icon: <Headphones size={18} />, label: 'Tai nghe', slug: 'Tai nghe',
    subMenu: [
      { title: 'Thương Hiệu', items: ['HyperX', 'Logitech', 'Razer', 'Sony', 'Corsair', 'SteelSeries', 'ASUS'] },
      { title: 'Kiểu Tai Nghe', items: ['Over-ear', 'In-ear', 'True Wireless'] },
      { title: 'Kết nối', items: ['Không dây (Wireless)', 'Bluetooth', 'Có dây'] }
    ]
  },
  {
    icon: <Gamepad size={18} />, label: 'Ghế - Bàn', slug: 'Ghế - Bàn',
    subMenu: [
      { title: 'Ghế Gaming', items: ['Corsair', 'Warrior', 'E-Dra', 'DXRacer', 'Cougar'] },
      { title: 'Ghế Công Thái Học', items: ['Sihoo', 'Warrior', 'E-Dra'] },
      { title: 'Bàn Gaming', items: ['Bàn Nâng Hạ', 'Bàn Chữ Z', 'Bàn Chữ L'] }
    ]
  },
  {
    icon: <AppWindow size={18} />, label: 'Phần mềm, mạng', slug: 'Phần mềm, mạng',
    subMenu: [
      { title: 'Router Wi-Fi', items: ['ASUS', 'TP-Link', 'Router Gaming', 'Router Mesh Pack', 'Router Wi-Fi 6'] },
      { title: 'Card Mạng & USB', items: ['Card Wi-Fi PCIe', 'USB Thu Wi-Fi'] },
      { title: 'Phần Mềm', items: ['Windows 11 Home', 'Windows 11 Pro', 'Microsoft Office', 'Diệt Virus'] }
    ]
  },
  {
    icon: <Gamepad size={18} />, label: 'Handheld, Console', slug: 'Handheld, Console',
    subMenu: [
      { title: 'Handheld PC', items: ['ASUS ROG Ally', 'MSI Claw', 'Lenovo Legion Go', 'Steam Deck'] },
      { title: 'Sony Playstation', items: ['Máy PS5 Chính Hãng', 'Tay Cầm PS5', 'Đĩa Game PS5'] },
      { title: 'Phụ kiện Gaming', items: ['Tay cầm PC', 'Tay cầm Xbox', 'Vô lăng đua xe'] }
    ]
  },
  {
    icon: <Cable size={18} />, label: 'Phụ kiện (Hub, sạc, cáp..)', slug: 'Phụ kiện',
    subMenu: [
      { title: 'Hub, Sạc, Cáp', items: ['Hub chuyển đổi', 'Dây cáp kết nối', 'Củ sạc', 'Sạc dự phòng'] },
      { title: 'Phụ kiện khác', items: ['Quạt mini', 'Phụ kiện Elgato', 'Giá đỡ điện thoại'] }
    ]
  },
  {
    icon: <Gift size={18} />, label: 'Dịch vụ và thông tin khác', slug: 'Dịch vụ',
    subMenu: [
      { title: 'Dịch vụ', items: ['Dịch vụ kỹ thuật tại nhà', 'Thu cũ đổi mới', 'Dịch vụ sửa chữa', 'Vệ sinh PC/Laptop'] },
      { title: 'Chính sách', items: ['Chính sách bảo hành', 'Chính sách đổi trả', 'Chính sách giao hàng'] }
    ]
  },
];

export default function CategorySidebar() {
  const [hiddenMenuIdx, setHiddenMenuIdx] = useState(null);
  const [sidebarBanner, setSidebarBanner] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/marketing/banners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const banner = data.find(b => b.position === 'sidebar_bottom');
          if (banner) setSidebarBanner(banner);
        }
      })
      .catch(err => console.error('Error fetching sidebar banner:', err));
  }, []);

  return (
    <div className="category-sidebar-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="category-sidebar glass-panel">
        <ul className="category-list">
        {categories.map((cat, idx) => (
          <li
            key={idx}
            className="category-item"
            onMouseLeave={() => setHiddenMenuIdx(null)}
          >
            <Link to={`/products?category=${encodeURIComponent(cat.slug)}`} className="category-link">
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
                        {column.items.map((item, itemIdx) => {
                          let linkTo = `/products?category=${encodeURIComponent(cat.slug)}&sub=${encodeURIComponent(column.title + ': ' + item)}`;
                          if (item === 'Thu cũ đổi mới') linkTo = '/policy/thu-cu-doi-moi';
                          else if (item === 'Dịch vụ kỹ thuật tại nhà') linkTo = '/policy/dich-vu-ky-thuat-tai-nha';
                          else if (item === 'Chính sách bảo hành') linkTo = '/policy/chinh-sach-bao-hanh';
                          else if (item === 'Chính sách đổi trả') linkTo = '/policy/chinh-sach-doi-tra';
                          else if (item === 'Chính sách giao hàng') linkTo = '/policy/chinh-sach-giao-hang';
                          else if (item === 'Dịch vụ sửa chữa') linkTo = '/policy/dich-vu-sua-chua';
                          else if (item === 'Vệ sinh PC/Laptop') linkTo = '/policy/ve-sinh-mien-phi';

                          return (
                            <li key={itemIdx}>
                              <Link
                                to={linkTo}
                                className="mega-menu-item"
                                onClick={() => setHiddenMenuIdx(idx)}
                              >
                                {item}
                              </Link>
                            </li>
                          );
                        })}
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

      {/* Sidebar Banner */}
      {sidebarBanner && (
        <a 
          href={sidebarBanner.link_url || '#'} 
          className="sidebar-banner glass-panel"
          style={{
            display: 'block',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            transition: 'var(--transition)'
          }}
          target={sidebarBanner.link_url?.startsWith('http') ? "_blank" : "_self"}
          rel="noopener noreferrer"
        >
          <img 
            src={sidebarBanner.image_url} 
            alt={sidebarBanner.title || "Khuyến mãi"} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </a>
      )}
    </div>
  );
}
