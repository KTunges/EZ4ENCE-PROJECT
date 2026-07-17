import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Cpu, HardDrive, MemoryStick, Monitor, Zap, Plus, X, Upload } from 'lucide-react';
import { createProduct, updateProduct, getAdminProductById, getCategories, getBrands, uploadAdminImage } from '../../services/adminApi';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    stock: '',
    status: 'ACTIVE',
    description: '',
    imageUrl: '',
    additionalImages: [],
    specs: {}
  });

  const specTemplates = {
    'Mặc định': [
      { name: 'Kích thước', label: 'Kích thước', options: ['Nhỏ', 'Vừa', 'Lớn', 'XL'] },
      { name: 'Trọng lượng', label: 'Trọng lượng', options: ['Dưới 200g', '200g - 500g', '500g - 1kg', '1kg - 3kg', 'Trên 3kg'] },
      { name: 'Màu sắc', label: 'Màu sắc', options: ['Đen', 'Trắng', 'Xám', 'Bạc', 'Đỏ', 'Xanh', 'Hồng', 'Vàng'] },
      { name: 'Chất liệu', label: 'Chất liệu', options: ['Nhựa ABS', 'Nhựa PC', 'Nhôm', 'Thép', 'Gỗ', 'Vải'] },
      { name: 'Bảo hành', label: 'Bảo hành', options: ['6 Tháng', '12 Tháng', '24 Tháng', '36 Tháng'] },
    ],
    'PC / Laptop': [
      { name: 'cpu', label: 'CPU', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Core Ultra 5', 'Intel Core Ultra 7', 'Intel Core Ultra 9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'] },
      { name: 'ram', label: 'RAM', options: ['4GB', '8GB', '16GB', '32GB', '64GB', '128GB'] },
      { name: 'vga', label: 'VGA (Card Màn Hình)', options: ['NVIDIA RTX 4090', 'NVIDIA RTX 4080 Super', 'NVIDIA RTX 4080', 'NVIDIA RTX 4070 Ti Super', 'NVIDIA RTX 4070 Ti', 'NVIDIA RTX 4070 Super', 'NVIDIA RTX 4070', 'NVIDIA RTX 4060 Ti', 'NVIDIA RTX 4060', 'NVIDIA RTX 3060', 'NVIDIA RTX 3050', 'AMD Radeon RX 7900 XTX', 'AMD Radeon RX 7800 XT', 'AMD Radeon RX 7600', 'Intel Iris Xe Graphics', 'Intel UHD Graphics', 'Card Onboard'] },
      { name: 'storage', label: 'Ổ cứng (SSD/HDD)', options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '4TB SSD', '1TB HDD', '2TB HDD'] },
      { name: 'mainboard', label: 'Bo mạch chủ (Mainboard)', options: ['H610', 'B760', 'Z790', 'Z890', 'A620', 'B650', 'X670', 'X870'] },
      { name: 'psu', label: 'Nguồn (PSU)', options: ['450W', '500W', '550W', '650W', '750W', '850W', '1000W', '1200W'] },
      { name: 'case', label: 'Vỏ Case', options: ['Mid Tower', 'Full Tower', 'Mini ITX', 'Micro ATX'] },
    ],
    'CPU': [
      { name: 'Dòng CPU', label: 'Dòng CPU', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Core Ultra 5', 'Intel Core Ultra 7', 'Intel Core Ultra 9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'AMD Ryzen Threadripper'] },
      { name: 'Socket', label: 'Socket', options: ['LGA 1700', 'LGA 1851', 'LGA 1200', 'AM5', 'AM4'] },
      { name: 'Số nhân', label: 'Số nhân', options: ['4 nhân', '6 nhân', '8 nhân', '10 nhân', '12 nhân', '14 nhân', '16 nhân', '20 nhân', '24 nhân'] },
      { name: 'Số luồng', label: 'Số luồng', options: ['8 luồng', '12 luồng', '16 luồng', '20 luồng', '24 luồng', '28 luồng', '32 luồng'] },
      { name: 'Xung nhịp', label: 'Xung nhịp cơ bản', options: ['2.5 GHz', '3.0 GHz', '3.5 GHz', '3.8 GHz', '4.0 GHz', '4.2 GHz', '4.5 GHz', '5.0 GHz', '5.5 GHz'] },
      { name: 'Bộ nhớ đệm', label: 'Bộ nhớ đệm (Cache)', options: ['12MB', '16MB', '20MB', '24MB', '30MB', '32MB', '36MB', '64MB', '128MB'] },
    ],
    'VGA': [
      { name: 'Chipset GPU', label: 'Chipset GPU', options: ['RTX 4060', 'RTX 4060 Ti', 'RTX 4070', 'RTX 4070 Super', 'RTX 4070 Ti', 'RTX 4070 Ti Super', 'RTX 4080 Super', 'RTX 4080', 'RTX 4090', 'RX 7600', 'RX 7700 XT', 'RX 7800 XT', 'RX 7900 GRE', 'RX 7900 XT', 'RX 7900 XTX'] },
      { name: 'Dung lượng VRAM', label: 'Dung lượng VRAM', options: ['8GB GDDR6', '12GB GDDR6X', '16GB GDDR6X', '24GB GDDR6X', '16GB GDDR6', '20GB GDDR6X'] },
      { name: 'Cổng xuất hình', label: 'Cổng xuất hình', options: ['1x HDMI 2.1, 3x DisplayPort 1.4', '2x HDMI 2.1, 2x DisplayPort 2.1', '1x HDMI 2.1, 3x DisplayPort 2.1'] },
      { name: 'Nguồn đề xuất', label: 'Nguồn đề xuất', options: ['550W', '650W', '750W', '850W', '1000W', '1200W'] },
      { name: 'TDP', label: 'Công suất TDP (W)', options: ['115W', '160W', '200W', '220W', '250W', '285W', '320W', '350W', '450W'] },
    ],
    'Mainboard': [
      { name: 'Socket', label: 'Socket', options: ['LGA 1700', 'LGA 1851', 'AM5', 'AM4'] },
      { name: 'Chipset', label: 'Chipset', options: ['H610', 'B660', 'H770', 'Z690', 'B760', 'H770', 'Z790', 'Z890', 'B850', 'X870', 'A620', 'B650', 'X670', 'X870E'] },
      { name: 'Kích thước', label: 'Kích thước (Form Factor)', options: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'] },
      { name: 'Số khe RAM', label: 'Số khe RAM', options: ['2 khe', '4 khe', '8 khe'] },
      { name: 'Hỗ trợ RAM', label: 'Hỗ trợ RAM', options: ['DDR4', 'DDR5', 'DDR4 / DDR5'] },
    ],
    'RAM': [
      { name: 'Dung lượng', label: 'Dung lượng', options: ['8GB (1x8GB)', '16GB (1x16GB)', '16GB (2x8GB)', '32GB (2x16GB)', '32GB (1x32GB)', '64GB (2x32GB)', '64GB (4x16GB)'] },
      { name: 'Chuẩn RAM', label: 'Chuẩn RAM', options: ['DDR4', 'DDR5'] },
      { name: 'Tốc độ Bus', label: 'Tốc độ Bus', options: ['3200 MHz', '3600 MHz', '4000 MHz', '4800 MHz', '5200 MHz', '5600 MHz', '6000 MHz', '6400 MHz', '7200 MHz'] },
      { name: 'Độ trễ', label: 'Độ trễ (Cas)', options: ['CL14', 'CL16', 'CL18', 'CL30', 'CL32', 'CL34', 'CL36'] },
      { name: 'Tản nhiệt', label: 'Tản nhiệt', options: ['Không có tản nhiệt', 'Tản nhiệt nhôm', 'Tản nhiệt RGB', 'Tản nhiệt nước (Hybrid)'] },
    ],
    'SSD': [
      { name: 'Dung lượng', label: 'Dung lượng', options: ['128GB', '256GB', '480GB', '512GB', '960GB', '1TB', '2TB', '4TB', '8TB'] },
      { name: 'Chuẩn kết nối', label: 'Chuẩn kết nối', options: ['SATA 3', 'PCIe Gen 3.0 x4 (NVMe)', 'PCIe Gen 4.0 x4 (NVMe)', 'PCIe Gen 5.0 x4 (NVMe)'] },
      { name: 'Form Factor', label: 'Form Factor', options: ['2.5 inch SATA', 'M.2 2280', 'M.2 2242', 'PCIe Add-in Card'] },
      { name: 'Tốc độ đọc', label: 'Tốc độ đọc (MB/s)', options: ['540 MB/s', '3,500 MB/s', '5,000 MB/s', '7,000 MB/s', '10,000 MB/s', '12,000 MB/s', '14,000 MB/s'] },
      { name: 'Tốc độ ghi', label: 'Tốc độ ghi (MB/s)', options: ['500 MB/s', '3,000 MB/s', '4,500 MB/s', '6,500 MB/s', '9,500 MB/s', '11,500 MB/s'] },
    ],
    'PSU': [
      { name: 'Công suất', label: 'Công suất', options: ['450W', '500W', '550W', '600W', '650W', '750W', '850W', '1000W', '1200W', '1600W'] },
      { name: 'Chuẩn 80 Plus', label: 'Chuẩn 80 Plus', options: ['80 Plus White', '80 Plus Bronze', '80 Plus Silver', '80 Plus Gold', '80 Plus Platinum', '80 Plus Titanium'] },
      { name: 'Kích thước', label: 'Kích thước', options: ['ATX (150 x 86 x 140mm)', 'SFX (125 x 63.5 x 100mm)', 'SFX-L (130 x 63.5 x 130mm)'] },
      { name: 'Cáp', label: 'Loại cáp', options: ['Cáp cố định (Non-Modular)', 'Cáp bán rời (Semi-Modular)', 'Cáp rời hoàn toàn (Full-Modular)'] },
    ],
    'Case': [
      { name: 'Mainboard hỗ trợ', label: 'Mainboard hỗ trợ', options: ['Mini-ITX', 'Micro-ATX, Mini-ITX', 'ATX, Micro-ATX, Mini-ITX', 'E-ATX, ATX, Micro-ATX, Mini-ITX'] },
      { name: 'Chất liệu', label: 'Chất liệu', options: ['Thép SPCC', 'Thép SPCC + Kính cường lực', 'Nhôm + Kính cường lực', 'Thép SPCC + Kính acrylic'] },
      { name: 'Kích thước', label: 'Kích thước Case', options: ['Mini-ITX Tower', 'Micro-ATX Tower', 'Mid Tower', 'Full Tower', 'Super Tower'] },
      { name: 'Vị trí PSU', label: 'Vị trí PSU', options: ['Dưới (Bottom)', 'Trên (Top)'] },
      { name: 'Số khe mở rộng', label: 'Số khe mở rộng', options: ['2 khe', '4 khe', '7 khe', '8 khe', '10 khe'] },
    ],
    'Tản nhiệt': [
      { name: 'Loại tản nhiệt', label: 'Loại tản nhiệt', options: ['Tản nhiệt khí (Air Cooler)', 'Tản nhiệt nước AIO 120mm', 'Tản nhiệt nước AIO 240mm', 'Tản nhiệt nước AIO 280mm', 'Tản nhiệt nước AIO 360mm', 'Tản nhiệt nước Custom (CLCs)'] },
      { name: 'Socket hỗ trợ', label: 'Socket hỗ trợ', options: ['LGA 1700 / AM5', 'LGA 1700 / LGA 1200 / AM5 / AM4', 'Đa socket (Universal)'] },
      { name: 'Kích thước Fan', label: 'Kích thước Fan', options: ['92mm', '120mm', '140mm', '2x 120mm', '3x 120mm', '2x 140mm', '3x 140mm'] },
      { name: 'TDP hỗ trợ', label: 'TDP tối đa hỗ trợ', options: ['Dưới 150W', '150W - 250W', '250W - 350W', 'Trên 350W'] },
    ],
    'Chuột': [
      { name: 'Mắt đọc', label: 'Mắt đọc (Sensor)', options: ['Optical (Quang học)', 'Laser', 'PixArt PAW3212', 'PixArt PAW3370', 'PixArt PAW3395', 'PixArt PAW3950', 'Logitech HERO 25K', 'Logitech HERO 2 40K', 'Razer Focus Pro 30K', 'Razer Focus X 6250 DPI'] },
      { name: 'DPI', label: 'DPI tối đa', options: ['6,200 DPI', '8,000 DPI', '12,000 DPI', '16,000 DPI', '20,000 DPI', '25,600 DPI', '30,000 DPI', '40,000 DPI'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Có dây (Wired - USB)', 'Có dây (Wired - Type-C)', 'Không dây (Wireless 2.4Ghz)', 'Bluetooth 5.1', 'Bluetooth 5.2', 'Wireless 2.4Ghz + Bluetooth'] },
      { name: 'Trọng lượng', label: 'Trọng lượng', options: ['Dưới 60g (Ultralight)', '60g - 70g (Superlight)', '70g - 90g (Nhẹ)', '90g - 110g (Trung bình)', 'Trên 110g'] },
      { name: 'Switch', label: 'Loại Switch nút bấm', options: ['Huano 60M', 'Kailh GM 8.0', 'Omron D2FC', 'Optical Switch (Razer)', 'Optical Switch (ASUS)', 'LK Optical', 'TTC Gold'] },
      { name: 'Polling Rate', label: 'Polling Rate (Hz)', options: ['125 Hz', '500 Hz', '1000 Hz', '4000 Hz', '8000 Hz'] },
      { name: 'Pin', label: 'Thời lượng Pin', options: ['Dưới 50 giờ', '50 - 100 giờ', '100 - 200 giờ', 'Trên 200 giờ'] },
    ],
    'Lót chuột': [
      { name: 'Kích thước', label: 'Kích thước', options: ['Nhỏ (320 x 270 mm)', 'Vừa (450 x 400 mm)', 'Lớn (900 x 400 mm)', 'XL (900 x 450 mm)', 'XXL (1200 x 600 mm)'] },
      { name: 'Độ dày', label: 'Độ dày', options: ['2 mm', '3 mm', '4 mm', '5 mm', '6 mm'] },
      { name: 'Bề mặt', label: 'Loại bề mặt', options: ['Control (Tốc độ chậm, chính xác)', 'Speed (Tốc độ nhanh, trơn)', 'Hybrid (Cân bằng)', 'Glass (Kính)'] },
      { name: 'Viền', label: 'Loại viền', options: ['Không có viền', 'Viền may chắc chắn', 'Viền silicon'] },
    ],
    'Bàn phím': [
      { name: 'Loại Switch', label: 'Loại Switch', options: ['Akko CS Jelly Pink', 'Akko CS Jelly Purple', 'Gateron Yellow', 'Gateron Red', 'Gateron Brown', 'Gateron Blue', 'Cherry MX Red', 'Cherry MX Blue', 'Cherry MX Brown', 'Kailh Box Red', 'TTC Red', 'Blue Switch', 'Red Switch', 'Brown Switch', 'Silver Switch', 'Silent Red Switch', 'Optical Switch', 'Membrane (Giả cơ)'] },
      { name: 'Kích thước', label: 'Kích thước (Layout)', options: ['Fullsize 100% (104 phím)', 'TKL 87% (87 phím)', '75% (83 phím)', '65% (68 phím)', '60% (61 phím)', '40%'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Có dây (USB-A)', 'Có dây (Type-C)', '3 Modes (USB + 2.4Ghz + Bluetooth)', 'Không dây 2.4Ghz', 'Bluetooth 5.0', 'Bluetooth 5.1', 'Bluetooth 5.3'] },
      { name: 'Keycap', label: 'Chất liệu Keycap', options: ['ABS Double-shot', 'PBT Double-shot', 'PBT Dye-sub', 'PBT Pudding'] },
      { name: 'LED', label: 'Đèn nền (LED)', options: ['RGB Per-key', 'RGB Underglow', 'RGB Full', 'Đơn sắc Trắng', 'Đơn sắc Xanh', 'Không có LED'] },
      { name: 'Gasket Mount', label: 'Kiểu gắn PCB', options: ['Tray Mount', 'Top Mount', 'Bottom Mount', 'Gasket Mount', 'Leaf Spring Mount'] },
      { name: 'Pin', label: 'Thời lượng Pin', options: ['Dưới 1000 mAh', '1000 mAh - 2000 mAh', '2000 mAh - 5000 mAh', 'Trên 5000 mAh'] },
    ],
    'Tai nghe': [
      { name: 'Kiểu dáng', label: 'Kiểu dáng', options: ['Over-ear / Circumaural (Chụp tai)', 'On-ear / Supra-aural (Áp tai)', 'In-ear (Nhét tai)', 'True Wireless (TWS)', 'Neckband (Đeo cổ)'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Jack 3.5mm', 'USB-A', 'USB-C', 'Không dây 2.4Ghz', 'Bluetooth 5.0', 'Bluetooth 5.2', 'Bluetooth 5.3', 'Multi-device (Kết nối nhiều thiết bị)'] },
      { name: 'Microphone', label: 'Microphone', options: ['Không có Mic', 'Có Mic tháo rời', 'Có Mic gắn liền có thể lật lên', 'Có Mic tích hợp (Boom Arm)', 'Mic trong tai (TWS)'] },
      { name: 'Tần số đáp ứng', label: 'Tần số đáp ứng', options: ['20Hz - 20kHz', '15Hz - 20kHz', '12Hz - 28kHz', '5Hz - 40kHz'] },
      { name: 'Trở kháng', label: 'Trở kháng (Ohm)', options: ['16 Ohm', '32 Ohm', '50 Ohm', '64 Ohm', '150 Ohm', '250 Ohm'] },
      { name: 'Driver', label: 'Kích thước Driver', options: ['6mm', '10mm', '13mm', '40mm', '50mm', '53mm'] },
      { name: 'Pin', label: 'Thời lượng Pin', options: ['Không có pin (có dây)', 'Dưới 10 giờ', '10 - 20 giờ', '20 - 40 giờ', 'Trên 40 giờ'] },
    ],
    'Loa': [
      { name: 'Công suất', label: 'Công suất (W RMS)', options: ['5W', '10W', '15W', '20W', '30W', '50W', '100W', '200W', 'Trên 200W'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Bluetooth 5.0', 'Bluetooth 5.1', 'Bluetooth 5.3', 'Jack 3.5mm', 'USB', 'Optical (Toslink)', 'RCA', 'Bluetooth + AUX'] },
      { name: 'Cấu hình', label: 'Cấu hình loa', options: ['2.0 (2 loa)', '2.1 (2 loa + sub)', '5.1 (Surround)', '7.1 (Surround)', 'Đơn (1 loa)'] },
      { name: 'Kích thước', label: 'Kích thước loa sub', options: ['Không có sub', 'Sub 3 inch', 'Sub 4 inch', 'Sub 5.5 inch', 'Sub 6.5 inch', 'Sub 8 inch'] },
      { name: 'Dải tần', label: 'Dải tần', options: ['50Hz - 20kHz', '35Hz - 20kHz', '20Hz - 20kHz'] },
    ],
    'Màn hình': [
      { name: 'Kích thước', label: 'Kích thước', options: ['21.5 inch', '23.8 inch', '24 inch', '24.5 inch', '27 inch', '31.5 inch', '32 inch', '34 inch Ultrawide', '38 inch Ultrawide', '42 inch', '45 inch Ultrawide', '49 inch Super Ultrawide'] },
      { name: 'Độ phân giải', label: 'Độ phân giải', options: ['FHD 1080p (1920x1080)', 'WFHD (2560x1080)', 'QHD 1440p (2560x1440)', 'QHD+ (3440x1440) Ultrawide', '4K UHD (3840x2160)', '4K UWQHD (5120x2160)', '8K (7680x4320)'] },
      { name: 'Tần số quét', label: 'Tần số quét (Hz)', options: ['60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '160Hz', '165Hz', '170Hz', '180Hz', '240Hz', '260Hz', '280Hz', '360Hz', '540Hz'] },
      { name: 'Tấm nền', label: 'Loại tấm nền', options: ['IPS', 'Fast IPS', 'Nano IPS', 'VA', 'TN', 'OLED', 'AMOLED', 'Mini-LED', 'QLED', 'WOLED'] },
      { name: 'Độ sáng', label: 'Độ sáng (Nits)', options: ['250 nits', '300 nits', '350 nits', '400 nits', 'HDR400 (400 nits)', 'HDR600 (600 nits)', 'HDR1000 (1000 nits)', 'HDR1400 (1400 nits)'] },
      { name: 'Cổng kết nối', label: 'Cổng kết nối', options: ['1x HDMI 2.0, 1x DisplayPort 1.4', '1x HDMI 2.1, 1x DisplayPort 1.4', '2x HDMI 2.0, 1x DisplayPort 1.4', '2x HDMI 2.1, 2x DisplayPort 1.4', '1x HDMI 2.1, 2x DisplayPort 2.1', '1x HDMI 2.1, 1x DisplayPort 1.4, 1x USB-C'] },
      { name: 'Thời gian phản hồi', label: 'Thời gian phản hồi (ms)', options: ['0.03ms (GtG)', '0.1ms (GtG)', '0.5ms (GtG)', '1ms (GtG)', '1ms (MPRT)', '4ms (GtG)'] },
    ],
    'Ghế / Bàn': [
      { name: 'Loại', label: 'Loại', options: ['Ghế Gaming', 'Ghế công thái học (Ergonomic)', 'Bàn Gaming', 'Bàn nâng hạ điện (Standing Desk)'] },
      { name: 'Chất liệu bề mặt', label: 'Chất liệu bề mặt', options: ['Da PU', 'Da thật (Full Grain Leather)', 'Vải lưới (Mesh)', 'Vải nỉ (Fabric)', 'Gỗ MDF', 'Mặt kính cường lực'] },
      { name: 'Khung', label: 'Chất liệu khung', options: ['Khung thép', 'Khung nhôm', 'Khung hợp kim'] },
      { name: 'Trọng tải tối đa', label: 'Trọng tải tối đa', options: ['Dưới 100 kg', '100 kg', '120 kg', '150 kg', '180 kg', '200 kg', 'Trên 200 kg'] },
      { name: 'Kê tay', label: 'Kê tay (Armrest)', options: ['Không có kê tay', 'Kê tay cố định 1D', 'Kê tay 2D', 'Kê tay 3D', 'Kê tay 4D (có thể xoay)'] },
      { name: 'Kích thước', label: 'Kích thước bàn (cm)', options: ['80 x 60 cm', '100 x 60 cm', '120 x 60 cm', '140 x 70 cm', '160 x 70 cm', '180 x 80 cm', '200 x 80 cm'] },
    ],
    'Console': [
      { name: 'Hãng / Dòng máy', label: 'Hãng / Dòng máy', options: ['PlayStation 5 Standard', 'PlayStation 5 Digital Edition', 'PlayStation 5 Slim', 'Xbox Series X', 'Xbox Series S', 'Nintendo Switch OLED', 'Nintendo Switch Lite', 'Steam Deck OLED', 'ASUS ROG Ally X', 'Lenovo Legion Go'] },
      { name: 'Dung lượng', label: 'Dung lượng (Bộ nhớ)', options: ['256GB', '512GB', '1TB', '2TB', 'Có thể mở rộng'] },
      { name: 'Độ phân giải', label: 'Độ phân giải tối đa', options: ['720p (HD)', '1080p (Full HD)', '1440p (QHD)', '4K (Ultra HD)', '8K (hỗ trợ qua output)'] },
      { name: 'FPS tối đa', label: 'FPS tối đa', options: ['30 FPS', '60 FPS', '120 FPS', '144 FPS'] },
      { name: 'Kết nối', label: 'Kết nối mạng', options: ['Wi-Fi 5 (802.11ac)', 'Wi-Fi 6 (802.11ax)', 'Wi-Fi 6E', 'Wi-Fi 6 + Ethernet Gigabit', 'Wi-Fi 6E + Bluetooth 5.1'] },
      { name: 'Loại đĩa', label: 'Ổ đĩa', options: ['Không có ổ đĩa (Digital)', 'Ổ đĩa Blu-ray 4K', 'Ổ đĩa Blu-ray thông thường'] },
    ]
  };

  const getTemplateForCategory = (catName) => {
    if (!catName) return 'PC / Laptop';
    const lower = catName.toLowerCase();
    
    // Linh kiện tách biệt (Check first to avoid overlaps like "Vỏ máy tính", "Nguồn máy tính")
    if (lower.includes('vga') || lower.includes('card màn hình')) return 'VGA';
    
    // Màn hình (phải để dưới Card màn hình để tránh bị trùng chữ "màn hình")
    if (lower.includes('màn hình')) return 'Màn hình';
    
    if (lower.includes('cpu') || lower.includes('vi xử lý')) return 'CPU';
    if (lower.includes('main') || lower.includes('bo mạch')) return 'Mainboard';
    if (lower.includes('ram') || lower.includes('bộ nhớ trong')) return 'RAM';
    if (lower.includes('ssd') || lower.includes('hdd') || lower.includes('ổ cứng')) return 'SSD';
    if (lower.includes('nguồn') || lower.includes('psu')) return 'PSU';
    if (lower.includes('case') || lower.includes('vỏ')) return 'Case';
    if (lower.includes('tản nhiệt')) return 'Tản nhiệt';

    // Laptop / PC (Check after components to avoid "Vỏ máy tính" -> PC)
    if (lower.includes('laptop') || lower.includes('pc') || lower.includes('máy tính')) return 'PC / Laptop';
    
    // Console / Handheld
    if (lower.includes('console') || lower.includes('handheld')) return 'Console';
    
    // Gaming Gear
    if (lower.includes('chuột') && !lower.includes('lót')) return 'Chuột';
    if (lower.includes('lót chuột')) return 'Lót chuột';
    if (lower.includes('phím')) return 'Bàn phím';
    if (lower.includes('tai nghe')) return 'Tai nghe';
    if (lower.includes('loa') || lower.includes('micro') || lower.includes('webcam')) return 'Loa';
    if (lower.includes('ghế') || lower.includes('bàn')) return 'Ghế / Bàn';
    
    return 'Mặc định';
  };

  // Combine template fields and any custom fields already in formData.specs
  const templateName = getTemplateForCategory(formData.category);
  const templateFields = specTemplates[templateName] || specTemplates['Mặc định'];
  const customFieldKeys = Object.keys(formData.specs).filter(key => !templateFields.find(f => f.name === key));
  const currentSpecFields = [
    ...templateFields,
    ...customFieldKeys.map(key => ({ name: key, label: key }))
  ];

  const getRelevantBrands = (catName) => {
    if (!catName || brands.length === 0) return { popular: [], others: brands };
    const lower = catName.toLowerCase();
    let relevantNames = [];
    if (lower.includes('vga') || lower.includes('card màn hình')) relevantNames = ['ASUS', 'MSI', 'Gigabyte', 'Galax', 'Colorful', 'Zotac', 'Inno3D', 'Palit', 'NVIDIA', 'AMD'];
    else if (lower.includes('cpu') || lower.includes('vi xử lý')) relevantNames = ['Intel', 'AMD', 'Apple'];
    else if (lower.includes('bo mạch') || lower.includes('main')) relevantNames = ['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'NZXT'];
    else if (lower.includes('ram') || lower.includes('nhớ trong')) relevantNames = ['Corsair', 'G.Skill', 'Kingston', 'Adata', 'Crucial', 'TeamGroup', 'Lexar', 'Klevv'];
    else if (lower.includes('ổ cứng') || lower.includes('ssd') || lower.includes('hdd')) relevantNames = ['Samsung', 'Western Digital', 'Kingston', 'Crucial', 'Corsair', 'Adata', 'Lexar', 'Seagate', 'Gigabyte'];
    else if (lower.includes('nguồn') || lower.includes('psu')) relevantNames = ['Corsair', 'Cooler Master', 'ASUS', 'MSI', 'Gigabyte', 'Seasonic', 'SilverStone', 'Deepcool', 'NZXT', 'Xigmatek'];
    else if (lower.includes('case') || lower.includes('vỏ')) relevantNames = ['NZXT', 'Corsair', 'Lian Li', 'Cooler Master', 'Deepcool', 'Montech', 'Fractal Design', 'ASUS', 'MSI', 'Xigmatek'];
    else if (lower.includes('tản nhiệt') || lower.includes('cooler')) relevantNames = ['NZXT', 'Corsair', 'Cooler Master', 'Deepcool', 'Noctua', 'Thermalright', 'ASUS', 'MSI'];
    else if (lower.includes('màn hình')) relevantNames = ['ASUS', 'LG', 'Samsung', 'Dell', 'MSI', 'Acer', 'Gigabyte', 'AOC', 'ViewSonic', 'BenQ', 'Zowie', 'HKC'];
    else if (lower.includes('bàn phím')) relevantNames = ['Akko', 'Razer', 'Corsair', 'Logitech', 'Keychron', 'SteelSeries', 'HyperX', 'Leopold', 'Filco', 'Asus', 'DareU', 'E-Dra'];
    else if (lower.includes('chuột') && !lower.includes('lót')) relevantNames = ['Logitech', 'Razer', 'Corsair', 'Zowie', 'Pulsar', 'SteelSeries', 'Asus', 'HyperX', 'DareU', 'E-Dra', 'VXE', 'Ninjutso', 'Lamzu'];
    else if (lower.includes('lót chuột')) relevantNames = ['Razer', 'SteelSeries', 'Artisan', 'Pulsar', 'Corsair', 'Logitech', 'Lethal Gaming Gear'];
    else if (lower.includes('tai nghe')) relevantNames = ['HyperX', 'Logitech', 'Razer', 'Sony', 'Corsair', 'SteelSeries', 'Asus', 'EPOS', 'Sennheiser'];
    else if (lower.includes('loa')) relevantNames = ['Logitech', 'Razer', 'Creative', 'Edifier', 'JBL', 'Harman Kardon', 'Sony', 'Microlab', 'SoundMax'];
    else if (lower.includes('webcam') || lower.includes('microphone')) relevantNames = ['Logitech', 'Razer', 'Elgato', 'Asus', 'HyperX', 'Blue', 'Audio-Technica', 'Shure', 'AKG', 'Microsoft'];
    else if (lower.includes('laptop')) relevantNames = ['ASUS', 'Acer', 'Lenovo', 'Dell', 'HP', 'MSI', 'Gigabyte', 'Apple', 'Razer'];
    else if (lower.includes('console')) relevantNames = ['Sony', 'Microsoft', 'Nintendo', 'Valve', 'ASUS', 'Lenovo'];
    else if (lower.includes('phần mềm')) relevantNames = ['Microsoft', 'Kaspersky', 'Adobe', 'BKAV'];
    else if ((lower.includes('ghế') || lower.includes('bàn')) && !lower.includes('phím')) relevantNames = ['Corsair', 'Warrior', 'E-Dra', 'DXRacer', 'Cougar', 'Sihoo', 'Herman Miller'];
    
    if (relevantNames.length === 0) return { popular: [], others: brands };

    const lowerRelevant = relevantNames.map(n => n.toLowerCase());
    const popular = brands.filter(b => lowerRelevant.includes(b.name.toLowerCase()));
    const others = brands.filter(b => !lowerRelevant.includes(b.name.toLowerCase()));
    
    return { popular, others };
  };

  const { popular: popularBrands, others: otherBrands } = getRelevantBrands(formData.category);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        setCategories(catsData);
        setBrands(brandsData);
        if (catsData.length > 0) setFormData(prev => ({ ...prev, category: catsData[0].name }));
        if (brandsData.length > 0) setFormData(prev => ({ ...prev, brand: brandsData[0].name }));
        
        if (isEditing) {
          setIsLoading(true);
          const product = await getAdminProductById(id);
          setFormData({
            name: product.name || '',
            category: product.category || (catsData.length > 0 ? catsData[0].name : ''),
            brand: product.brand || (brandsData.length > 0 ? brandsData[0].name : ''),
            price: product.price || '',
            salePrice: product.sale_price || '',
            stock: product.stock || '',
            status: product.is_published ? 'ACTIVE' : 'HIDDEN',
            description: product.description || '',
            imageUrl: product.image_url || '',
            additionalImages: product.additional_images || [],
            specs: product.specifications || {}
          });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu form:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // If changing category, clear the specs
      if (name === 'category' && value !== prev.category) {
        return {
          ...prev,
          [name]: value,
          specs: {} // Reset specs entirely for new category
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      specs: { ...prev.specs, [name]: value }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Không thể tải ảnh lên. Vui lòng kiểm tra cấu hình Cloudinary trên Backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);
  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setIsUploadingAdditional(true);
    try {
      const newUrls = [];
      for (const file of files) {
        const url = await uploadAdminImage(file);
        newUrls.push(url);
      }
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, ...newUrls] 
      }));
    } catch (error) {
      console.error("Lỗi upload ảnh phụ:", error);
      alert("Không thể tải ảnh lên.");
    } finally {
      setIsUploadingAdditional(false);
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => {
      const newImgs = [...prev.additionalImages];
      newImgs.splice(index, 1);
      return { ...prev, additionalImages: newImgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    const stockVal = parseInt(formData.stock);
    const priceVal = parseFloat(formData.price);
    const salePriceVal = formData.salePrice ? parseFloat(formData.salePrice) : null;
    
    if (isNaN(priceVal) || priceVal <= 0) {
      alert('Giá bán phải lớn hơn 0!');
      return;
    }
    if (!isNaN(stockVal) && stockVal < 0) {
      alert('Số lượng tồn kho không được âm!');
      return;
    }
    if (salePriceVal !== null && salePriceVal < 0) {
      alert('Giá khuyến mãi không được âm!');
      return;
    }
    if (salePriceVal !== null && salePriceVal >= priceVal) {
      alert('Giá khuyến mãi phải nhỏ hơn giá gốc!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        specifications: formData.specs,
        is_published: formData.status === 'ACTIVE',
        price: priceVal,
        sale_price: salePriceVal,
        stock: isNaN(stockVal) ? 0 : Math.max(0, stockVal),
        image_url: formData.imageUrl,
        additional_images: formData.additionalImages
      };
      
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
        alert('Thêm sản phẩm thành công!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm', error);
      alert('Có lỗi xảy ra khi lưu. Vui lòng kiểm tra console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/admin/products')}
            style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{isEditing ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          style={{ padding: '10px 20px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? <span className="spinner-border w-4 h-4 border-2 rounded-full border-t-transparent animate-spin"></span> : <Save size={18} />}
          LƯU SẢN PHẨM
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)' }}>Thông tin cơ bản</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tên sản phẩm *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="VD: Card Màn Hình RTX 4090..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Danh mục *</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px', appearance: 'none' }}>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Thương hiệu</label>
                <select name="brand" value={formData.brand} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px', appearance: 'none' }}>
                  {popularBrands.length > 0 ? (
                    <>
                      <optgroup label={`Phổ biến cho ${formData.category}`}>
                        {popularBrands.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)}
                      </optgroup>
                      <optgroup label="Thương hiệu khác">
                        {otherBrands.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)}
                      </optgroup>
                    </>
                  ) : (
                    brands.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)
                  )}
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px', resize: 'vertical' }} placeholder="Nhập bài viết mô tả sản phẩm ở đây..."></textarea>
            </div>
          </div>

          {/* Dynamic Specifications */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="var(--cyan)" /> Thông số Kỹ thuật ({getTemplateForCategory(formData.category)})
              </h2>
              <button 
                type="button" 
                onClick={() => {
                  const newKey = prompt("Nhập tên thông số mới (VD: Tản nhiệt, Bluetooth...):");
                  if (newKey && newKey.trim() !== '') {
                    setFormData(prev => ({ ...prev, specs: { ...prev.specs, [newKey]: '' } }));
                  }
                }}
                style={{ background: 'transparent', border: '1px dashed var(--cyan)', color: 'var(--cyan)', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Thêm trường
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              Mẫu thông số tự động thay đổi theo danh mục bạn chọn. Bỏ trống nếu không áp dụng.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {currentSpecFields.map(field => (
                <div key={field.name}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--cyan)' }}>•</span> {field.label || field.name}
                    </span>
                    {/* Only show delete button for custom fields not in template */}
                    {!specTemplates[getTemplateForCategory(formData.category)]?.find(f => f.name === field.name) && (
                      <button 
                        type="button"
                        onClick={() => {
                          const newSpecs = { ...formData.specs };
                          delete newSpecs[field.name];
                          setFormData(prev => ({ ...prev, specs: newSpecs }));
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                  <input 
                    type="text" 
                    name={field.name} 
                    value={formData.specs[field.name] || ''} 
                    onChange={handleSpecChange} 
                    list={`${field.name}-options`}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} 
                    placeholder={`VD: Nhập ${field.label || field.name}...`} 
                  />
                  {field.options && (
                    <datalist id={`${field.name}-options`}>
                      {field.options.map(opt => <option key={opt} value={opt} />)}
                    </datalist>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Price, Image, Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Pricing & Stock */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)' }}>Giá & Kho</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Giá gốc (VNĐ) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="0" />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Giá khuyến mãi (VNĐ)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="Bỏ trống nếu không giảm giá" />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Số lượng tồn kho *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="0" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: formData.status === 'ACTIVE' ? '#22c55e' : '#f59e0b', fontSize: '15px', fontWeight: 'bold', appearance: 'none' }}>
                <option value="ACTIVE" style={{ color: '#000' }}>Đang bán (Active)</option>
                <option value="DRAFT" style={{ color: '#000' }}>Bản nháp (Draft)</option>
                <option value="OUT_OF_STOCK" style={{ color: '#000' }}>Hết hàng</option>
              </select>
            </div>
          </div>

          {/* Product Image */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)' }}>Ảnh chính (Bắt buộc)</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tải ảnh từ máy tính</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <label htmlFor="image-upload" style={{ flex: 1, padding: '10px 16px', background: 'rgba(0, 210, 255, 0.1)', border: '1px dashed var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <Upload size={16} /> {isUploading ? 'Đang tải lên...' : 'Chọn file ảnh chính'}
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>Hoặc nhập URL trực tiếp:</div>

            <div style={{ marginBottom: '16px' }}>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px' }} placeholder="https://..." />
            </div>

            <div style={{ 
              width: '100%', aspectRatio: '1/1', background: 'var(--bg-card)', border: '2px dashed var(--border)', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
            }}>
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setFormData(p => ({...p, imageUrl: ''}))} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'var(--text)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon size={48} color="var(--border-hover)" style={{ marginBottom: '16px' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chưa có ảnh chính</span>
                </>
              )}
            </div>
          </div>
          
          {/* Additional Images */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)' }}>Các ảnh phụ</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tải nhiều ảnh từ máy tính</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="file" id="additional-images-upload" accept="image/*" multiple onChange={handleAdditionalImageUpload} style={{ display: 'none' }} />
                <label htmlFor="additional-images-upload" style={{ flex: 1, padding: '10px 16px', background: 'transparent', border: '1px dashed var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <Upload size={16} /> {isUploadingAdditional ? 'Đang tải lên...' : 'Chọn nhiều file ảnh'}
                </label>
              </div>
            </div>

            {formData.additionalImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {formData.additionalImages.map((url, idx) => (
                  <div key={idx} style={{ aspectRatio: '1/1', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={url} alt={`Phụ ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeAdditionalImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
