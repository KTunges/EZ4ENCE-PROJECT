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
    specs: {}
  });

  const specTemplates = {
    'Mặc định': [
      { name: 'Kích thước', label: 'Kích thước' },
      { name: 'Trọng lượng', label: 'Trọng lượng' },
      { name: 'Màu sắc', label: 'Màu sắc', options: ['Đen', 'Trắng', 'Xám', 'Bạc', 'Đỏ', 'Xanh', 'Hồng'] },
      { name: 'Chất liệu', label: 'Chất liệu' },
      { name: 'Bảo hành', label: 'Bảo hành', options: ['12 Tháng', '24 Tháng', '36 Tháng'] },
    ],
    'PC / Laptop': [
      { name: 'cpu', label: 'CPU', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Core Ultra 5', 'Intel Core Ultra 7', 'Intel Core Ultra 9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'] },
      { name: 'ram', label: 'RAM', options: ['4GB', '8GB', '16GB', '32GB', '64GB', '128GB'] },
      { name: 'vga', label: 'VGA (Card Màn Hình)', options: ['NVIDIA RTX 4090', 'NVIDIA RTX 4080', 'NVIDIA RTX 4070', 'NVIDIA RTX 4060', 'NVIDIA RTX 3060', 'NVIDIA RTX 3050', 'AMD Radeon RX 7900 XTX', 'AMD Radeon RX 7800 XT', 'AMD Radeon RX 7600', 'Intel Iris Xe Graphics', 'Intel UHD Graphics', 'Card Onboard'] },
      { name: 'storage', label: 'Ổ cứng (SSD/HDD)', options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '4TB SSD', '1TB HDD'] },
      { name: 'mainboard', label: 'Bo mạch chủ (Mainboard)', options: ['H610', 'B760', 'Z790', 'A620', 'B650', 'X670', 'Z890', 'X870'] },
      { name: 'psu', label: 'Nguồn (PSU)', options: ['450W', '500W', '550W', '650W', '750W', '850W', '1000W', '1200W'] },
      { name: 'case', label: 'Vỏ Case', options: ['Mid Tower', 'Full Tower', 'Mini ITX', 'Micro ATX'] },
    ],
    'CPU': [
      { name: 'Dòng CPU', label: 'Dòng CPU', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { name: 'Socket', label: 'Socket', options: ['LGA 1700', 'LGA 1200', 'AM5', 'AM4'] },
      { name: 'Số nhân', label: 'Số nhân' },
      { name: 'Số luồng', label: 'Số luồng' },
      { name: 'Xung nhịp', label: 'Xung nhịp' },
      { name: 'Bộ nhớ đệm', label: 'Bộ nhớ đệm (Cache)' },
    ],
    'VGA': [
      { name: 'Chipset GPU', label: 'Chipset GPU', options: ['RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RX 7600', 'RX 7800 XT', 'RX 7900 XTX'] },
      { name: 'Dung lượng VRAM', label: 'Dung lượng VRAM', options: ['8GB GDDR6', '12GB GDDR6X', '16GB GDDR6X', '24GB GDDR6X'] },
      { name: 'Cổng xuất hình', label: 'Cổng xuất hình', options: ['1x HDMI, 3x DisplayPort', '2x HDMI, 2x DisplayPort'] },
      { name: 'Nguồn đề xuất', label: 'Nguồn đề xuất', options: ['550W', '650W', '750W', '850W', '1000W'] },
    ],
    'Mainboard': [
      { name: 'Socket', label: 'Socket', options: ['LGA 1700', 'LGA 1200', 'AM5', 'AM4'] },
      { name: 'Chipset', label: 'Chipset', options: ['Z790', 'B760', 'H610', 'X670', 'B650'] },
      { name: 'Kích thước', label: 'Kích thước (Form Factor)', options: ['ATX', 'Micro-ATX', 'Mini-ITX'] },
      { name: 'Số khe RAM', label: 'Số khe RAM', options: ['2 khe', '4 khe', '8 khe'] },
    ],
    'RAM': [
      { name: 'Dung lượng', label: 'Dung lượng', options: ['8GB', '16GB', '32GB', '64GB'] },
      { name: 'Chuẩn RAM', label: 'Chuẩn RAM', options: ['DDR4', 'DDR5'] },
      { name: 'Tốc độ Bus', label: 'Tốc độ Bus', options: ['3200 MHz', '4800 MHz', '5200 MHz', '5600 MHz', '6000 MHz'] },
      { name: 'Độ trễ', label: 'Độ trễ (Cas)', options: ['CL16', 'CL18', 'CL30', 'CL32', 'CL36'] },
    ],
    'SSD': [
      { name: 'Dung lượng', label: 'Dung lượng', options: ['256GB', '512GB', '1TB', '2TB', '4TB'] },
      { name: 'Chuẩn kết nối', label: 'Chuẩn kết nối', options: ['PCIe Gen 3.0', 'PCIe Gen 4.0', 'PCIe Gen 5.0', 'SATA 3'] },
      { name: 'Tốc độ đọc', label: 'Tốc độ đọc', options: ['3500 MB/s', '5000 MB/s', '7000 MB/s', '10000 MB/s'] },
      { name: 'Tốc độ ghi', label: 'Tốc độ ghi', options: ['3000 MB/s', '6000 MB/s'] },
    ],
    'PSU': [
      { name: 'Công suất', label: 'Công suất', options: ['450W', '500W', '550W', '650W', '750W', '850W', '1000W', '1200W'] },
      { name: 'Chuẩn 80 Plus', label: 'Chuẩn 80 Plus', options: ['White', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'] },
      { name: 'Kích thước', label: 'Kích thước', options: ['ATX', 'SFX', 'SFX-L'] },
    ],
    'Case': [
      { name: 'Mainboard hỗ trợ', label: 'Mainboard hỗ trợ', options: ['ATX, Micro-ATX, Mini-ITX', 'Micro-ATX, Mini-ITX', 'E-ATX, ATX, Micro-ATX, Mini-ITX'] },
      { name: 'Chất liệu', label: 'Chất liệu', options: ['Thép SPCC, Kính cường lực', 'Nhôm, Kính cường lực'] },
      { name: 'Kích thước', label: 'Kích thước', options: ['Mid Tower', 'Full Tower', 'Mini ITX', 'Micro ATX'] },
    ],
    'Tản nhiệt': [
      { name: 'Loại tản nhiệt', label: 'Loại tản nhiệt', options: ['Tản nhiệt khí', 'Tản nhiệt nước AIO (240mm)', 'Tản nhiệt nước AIO (360mm)'] },
      { name: 'Socket hỗ trợ', label: 'Socket hỗ trợ', options: ['LGA 1700 / AM5', 'Đa Socket'] },
      { name: 'Kích thước Fan', label: 'Kích thước Fan', options: ['120mm', '140mm'] },
    ],
    'Chuột': [
      { name: 'Mắt đọc', label: 'Mắt đọc (Sensor)', options: ['Optical (Quang học)', 'Laser', 'PixArt PAW3395', 'Logitech HERO 25K', 'Razer Focus Pro 30K'] },
      { name: 'DPI', label: 'DPI tối đa', options: ['8000 DPI', '12000 DPI', '16000 DPI', '20000 DPI', '25600 DPI', '30000 DPI'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Có dây (Wired)', 'Không dây (Wireless 2.4Ghz)', 'Bluetooth', 'Wireless + Bluetooth'] },
      { name: 'Trọng lượng', label: 'Trọng lượng', options: ['Dưới 60g (Superlight)', '60g - 80g', '80g - 100g', 'Trên 100g'] },
      { name: 'Switch', label: 'Loại Switch', options: ['Huano', 'Kailh', 'Omron', 'Optical Switch'] },
      { name: 'Pin', label: 'Thời lượng Pin', options: ['Dưới 50 giờ', '50 - 100 giờ', 'Trên 100 giờ'] },
    ],
    'Lót chuột': [
      { name: 'Kích thước', label: 'Kích thước', options: ['900 x 400 mm', '450 x 400 mm', '320 x 270 mm'] },
      { name: 'Độ dày', label: 'Độ dày', options: ['3 mm', '4 mm', '5 mm', '6 mm'] },
      { name: 'Bề mặt', label: 'Bề mặt', options: ['Control', 'Speed', 'Hybrid'] },
    ],
    'Bàn phím': [
      { name: 'Loại Switch', label: 'Loại Switch', options: ['Blue Switch', 'Red Switch', 'Brown Switch', 'Silver Switch', 'Silent Switch', 'Optical Switch', 'Membrane (Giả cơ)'] },
      { name: 'Kích thước', label: 'Kích thước (Layout)', options: ['Fullsize (104/108 phím)', 'TKL (87 phím)', '75%', '65%', '60%'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Có dây (Type-C)', 'Không dây (Wireless 2.4Ghz)', 'Bluetooth', '3 Modes (Có dây + 2.4Ghz + Bluetooth)'] },
      { name: 'Keycap', label: 'Chất liệu Keycap', options: ['ABS Double-shot', 'PBT Double-shot', 'PBT Dye-sub'] },
      { name: 'LED', label: 'Đèn nền (LED)', options: ['RGB', 'Đơn sắc (Trắng/Xanh/Đỏ)', 'Không LED'] },
      { name: 'Pin', label: 'Thời lượng Pin' },
    ],
    'Tai nghe': [
      { name: 'Kiểu dáng', label: 'Kiểu dáng', options: ['Over-ear (Chụp tai)', 'In-ear (Nhét tai)', 'True Wireless (TWS)'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Jack 3.5mm', 'USB', 'Không dây (Wireless 2.4Ghz)', 'Bluetooth'] },
      { name: 'Microphone', label: 'Microphone', options: ['Có (Tháo rời được)', 'Có (Gắn liền)', 'Không có'] },
      { name: 'Tần số đáp ứng', label: 'Tần số đáp ứng', options: ['20Hz - 20kHz', '12Hz - 28kHz'] },
      { name: 'Trở kháng', label: 'Trở kháng', options: ['16 Ohm', '32 Ohm', '64 Ohm'] },
    ],
    'Loa': [
      { name: 'Công suất', label: 'Công suất (W)', options: ['Dưới 10W', '10W - 20W', '20W - 50W', 'Trên 50W'] },
      { name: 'Kết nối', label: 'Chuẩn kết nối', options: ['Bluetooth', 'Jack 3.5mm', 'USB', 'Optical'] },
      { name: 'Kích thước', label: 'Kích thước' },
      { name: 'Trọng lượng', label: 'Trọng lượng' },
    ],
    'Màn hình': [
      { name: 'Kích thước', label: 'Kích thước', options: ['21.5 inch', '24 inch', '27 inch', '32 inch', '34 inch (Ultrawide)', '49 inch'] },
      { name: 'Độ phân giải', label: 'Độ phân giải', options: ['FHD (1920x1080)', '2K QHD (2560x1440)', '4K UHD (3840x2160)', '8K'] },
      { name: 'Tần số quét', label: 'Tần số quét (Hz)', options: ['60Hz', '75Hz', '100Hz', '144Hz', '165Hz', '180Hz', '240Hz', '360Hz', '540Hz'] },
      { name: 'Tấm nền', label: 'Loại tấm nền', options: ['IPS', 'VA', 'TN', 'OLED', 'Mini-LED'] },
      { name: 'Độ sáng', label: 'Độ sáng', options: ['250 nits', '300 nits', '400 nits', 'HDR400', 'HDR600', 'HDR1000'] },
      { name: 'Cổng kết nối', label: 'Cổng kết nối', options: ['HDMI, DisplayPort', 'HDMI, DisplayPort, Type-C'] },
    ],
    'Ghế / Bàn': [
      { name: 'Chất liệu', label: 'Chất liệu', options: ['Da PU', 'Vải lưới', 'Gỗ', 'Kính cường lực', 'Khung thép'] },
      { name: 'Trọng tải tối đa', label: 'Trọng tải tối đa', options: ['100 kg', '150 kg', '200 kg'] },
      { name: 'Kê tay', label: 'Kê tay', options: ['Cố định', '2D', '3D', '4D'] },
      { name: 'Kích thước', label: 'Kích thước' },
    ],
    'Console': [
      { name: 'Dung lượng', label: 'Dung lượng (Bộ nhớ)', options: ['512GB', '1TB', '2TB'] },
      { name: 'Độ phân giải hỗ trợ', label: 'Độ phân giải hỗ trợ', options: ['1080p', '1440p', '4K'] },
      { name: 'Kết nối', label: 'Kết nối' }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        specifications: formData.specs,
        is_published: formData.status === 'ACTIVE',
        price: parseFloat(formData.price) || 0,
        sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0,
        image_url: formData.imageUrl
      };
      
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
        alert("Thêm sản phẩm thành công!");
      }
      navigate('/admin/products');
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm", error);
      alert("Có lỗi xảy ra khi lưu. Vui lòng kiểm tra console.");
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
              <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="0" />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Giá khuyến mãi (VNĐ)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="Bỏ trống nếu không giảm giá" />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Số lượng tồn kho *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="0" />
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
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text)' }}>Ảnh sản phẩm</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tải ảnh từ máy tính</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <label htmlFor="image-upload" style={{ flex: 1, padding: '10px 16px', background: 'rgba(0, 210, 255, 0.1)', border: '1px dashed var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <Upload size={16} /> {isUploading ? 'Đang tải lên...' : 'Chọn file ảnh'}
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
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chưa có ảnh</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
