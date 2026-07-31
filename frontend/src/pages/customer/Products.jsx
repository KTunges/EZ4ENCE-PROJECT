import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../../components/ui/CyberBackground';
import ProductCard from '../../components/ui/ProductCard';
import PageSkeleton from '../../components/ui/PageSkeleton';
import ProductSkeleton from '../../components/ui/ProductSkeleton';
import FlashSaleBlock from '../../components/ui/FlashSaleBlock';
import { mapProduct } from '../../utils/productMapper';
import CustomSelect from '../../components/ui/CustomSelect';
import CategorySidebar from '../../components/layout/CategorySidebar';
import BentoBanners from '../../components/ui/BentoBanners';

// 💾 Module-level cache: tồn tại xuyên suốt phiên làm việc
const productCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 phút

function getCached(key) {
  const entry = productCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    productCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  productCache.set(key, { data, timestamp: Date.now() });
}

const CATEGORIES = [
  'Tất cả', 
  'Laptop', 'Laptop Gaming', 'PC EZ4ENCE', 
  'Main, CPU, VGA', 'Case, Nguồn, Tản', 'Ổ cứng, RAM, Thẻ nhớ', 
  'Màn hình', 'Bàn phím', 'Chuột + Lót chuột', 'Tai nghe', 'Loa, Micro, Webcam', 
  'Ghế - Bàn', 'Phần mềm, mạng', 'Handheld, Console', 'Phụ kiện', 'Dịch vụ'
];
const BRANDS = ['Tất cả', 'ASUS', 'Acer', 'Lenovo', 'Dell', 'HP', 'Gigabyte', 'Logitech', 'Razer', 'SteelSeries', 'Intel', 'AMD', 'MSI', 'G.Skill', 'Samsung', 'LG', 'Corsair', 'NZXT', 'Artisan', 'HyperX', 'Sony', 'Kingston', 'Akko', 'Keychron', 'Zowie', 'Pulsar'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

// Key = tên hiển thị trên CATEGORIES / Sidebar, khớp chính xác
const CATEGORY_FILTERS_CONFIG = {
  'Laptop': ['cpu', 'ram', 'storage', 'vga'],
  'Laptop Gaming': ['cpu', 'ram', 'vga', 'storage'],
  'PC EZ4ENCE': ['cpu', 'ram', 'vga'],
  'Màn hình': ['Kích thước', 'Độ phân giải', 'Tần số quét', 'Tấm nền'],
  'Bàn phím': ['Loại Switch', 'Kết nối', 'Kích thước'],
  'Chuột + Lót chuột': ['Mắt đọc', 'DPI', 'Kết nối', 'Trọng lượng'],
  'Tai nghe': ['Kiểu dáng', 'Kết nối', 'Microphone'],
  'Loa, Micro, Webcam': ['Công suất', 'Kết nối'],
  'Main, CPU, VGA': ['Socket', 'Dòng CPU', 'Chipset GPU', 'Dung lượng VRAM'],
  'Case, Nguồn, Tản': ['Công suất', 'Loại tản nhiệt', 'Kích thước'],
  'Ổ cứng, RAM, Thẻ nhớ': ['Dung lượng', 'Chuẩn kết nối', 'Chuẩn RAM', 'Tốc độ Bus'],
  'Ghế - Bàn': ['Chất liệu', 'Trọng tải tối đa']
};

const FILTER_DISPLAY_NAMES = {
  'cpu': 'CPU',
  'ram': 'RAM',
  'storage': 'Ổ cứng',
  'vga': 'VGA (Card Màn Hình)',
  'mainboard': 'Mainboard',
  'psu': 'Nguồn (PSU)',
  'case': 'Vỏ Case',
  'Kích thước': 'Kích thước',
  'Độ phân giải': 'Độ phân giải',
  'Tần số quét': 'Tần số quét',
  'Tấm nền': 'Tấm nền',
  'Loại Switch': 'Loại Switch',
  'Kết nối': 'Kết nối',
  'Mắt đọc': 'Mắt đọc',
  'DPI': 'DPI tối đa',
  'Trọng lượng': 'Trọng lượng',
  'Kiểu dáng': 'Kiểu dáng',
  'Microphone': 'Microphone',
  'Công suất': 'Công suất',
  'Socket': 'Socket',
  'Chipset': 'Chipset',
  'Dòng CPU': 'Dòng CPU',
  'Chipset GPU': 'Chipset GPU',
  'Dung lượng VRAM': 'Dung lượng VRAM',
  'Loại tản nhiệt': 'Loại tản nhiệt',
  'Dung lượng': 'Dung lượng',
  'Chuẩn kết nối': 'Chuẩn kết nối',
  'Chuẩn RAM': 'Chuẩn RAM',
  'Tốc độ Bus': 'Tốc độ Bus',
  'Chất liệu': 'Chất liệu',
  'Trọng tải tối đa': 'Trọng tải tối đa'
};

// Ánh xạ mỗi danh mục Sidebar → danh sách backend slug tương ứng
const CATEGORY_SLUG_MAP = {
  'Laptop': ['laptop'],
  'Laptop Gaming': ['laptop-gaming'],
  'PC EZ4ENCE': ['pc-ez4ence'],
  'Main, CPU, VGA': ['bo-mach-chu', 'bo-vi-xu-ly', 'card-man-hinh'],
  'Case, Nguồn, Tản': ['vo-may-tinh', 'nguon-may-tinh', 'tan-nhiet'],
  'Ổ cứng, RAM, Thẻ nhớ': ['bo-nho-trong', 'o-cung-ssd', 'o-cung-hdd', 'the-nho-usb'],
  'Màn hình': ['man-hinh'],
  'Bàn phím': ['ban-phim'],
  'Chuột + Lót chuột': ['chuot', 'lot-chuot'],
  'Tai nghe': ['tai-nghe'],
  'Loa, Micro, Webcam': ['loa', 'microphone', 'webcam'],
  'Ghế - Bàn': ['ghe-ban', 'ban-gaming'],
  'Phần mềm, mạng': ['phan-mem', 'thiet-bi-mang'],
  'Handheld, Console': ['handheld', 'console'],
  'Phụ kiện': ['phu-kien'],
  'Dịch vụ': ['dich-vu'],
  // Khả năng tương thích ngược
  'Linh Kiện Máy Tính': ['bo-vi-xu-ly', 'bo-mach-chu', 'card-man-hinh', 'bo-nho-trong', 'o-cung-ssd', 'nguon-may-tinh', 'vo-may-tinh', 'tan-nhiet'],
  'Chuột': ['chuot'],
  'Lót chuột': ['lot-chuot'],
  'Loa': ['loa'],
  'Webcam': ['webcam'],
  'Microphone': ['microphone'],
  'Phần mềm': ['phan-mem'],
  'Thiết bị mạng': ['thiet-bi-mang'],
  'Handheld': ['handheld'],
  'Console': ['console'],
};

// Ánh xạ ngược: từ slug → tên hiển thị (dùng cho banner link_url)
const SLUG_TO_DISPLAY_NAME = {};
Object.entries(CATEGORY_SLUG_MAP).forEach(([displayName, slugs]) => {
  // Chỉ map cho các danh mục chính trong CATEGORIES (không map backward-compat)
  if (CATEGORIES.includes(displayName)) {
    slugs.forEach(slug => {
      // Nếu slug chưa được map hoặc danh mục hiện tại là cha (chứa nhiều slug)
      if (!SLUG_TO_DISPLAY_NAME[slug]) {
        SLUG_TO_DISPLAY_NAME[slug] = displayName;
      }
    });
  }
});

// Hàm chuẩn hóa category từ URL → tên hiển thị trong CATEGORIES
function normalizeCategory(urlValue) {
  if (!urlValue || urlValue === 'Tất cả') return 'Tất cả';
  // Nếu đã là tên hiển thị hợp lệ → trả về ngay
  if (CATEGORIES.includes(urlValue) || CATEGORY_SLUG_MAP[urlValue]) return urlValue;
  // Thử tra cứu ngược từ slug
  const normalized = urlValue.toLowerCase().trim();
  if (SLUG_TO_DISPLAY_NAME[normalized]) return SLUG_TO_DISPLAY_NAME[normalized];
  // Thử tìm gần đúng (slug có thể chứa dấu hoặc viết khác)
  for (const [displayName, slugs] of Object.entries(CATEGORY_SLUG_MAP)) {
    if (slugs.some(s => s === normalized || normalized.includes(s) || s.includes(normalized))) {
      return displayName;
    }
  }
  // Không tìm thấy → trả về giá trị gốc để không mất thông tin
  return urlValue;
}

const PRICE_RANGES = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: '0-2000000', label: 'Dưới 2 triệu' },
  { value: '2000000-5000000', label: '2 - 5 triệu' },
  { value: '5000000-10000000', label: '5 - 10 triệu' },
  { value: '10000000-20000000', label: '10 - 20 triệu' },
  { value: '20000000-999999999', label: 'Trên 20 triệu' },
];

const ITEMS_PER_PAGE = 12;

// ═══════════════════════════════════════════════════════════════════════════════
// Hàm phân tích bộ lọc từ Sub-Menu (VD: "VGA NVIDIA: RTX 40 Series")
// Trả về { category_slug, brand_slug, search, min_price, max_price }
// ═══════════════════════════════════════════════════════════════════════════════
const parseSubMenuFilter = (parentCategory, subValue) => {
  if (!subValue || !subValue.includes(': ')) return {};

  const colonIdx = subValue.indexOf(': ');
  const title = subValue.substring(0, colonIdx).trim();
  const item = subValue.substring(colonIdx + 2).trim();
  const titleLower = title.toLowerCase();
  const itemLower = item.toLowerCase();
  const result = {};

  // ── Helper: parse giá tiền ("Dưới 15 triệu", "15 - 20 triệu", "Trên 25 triệu") ──
  const tryParsePrice = () => {
    if (itemLower.includes('dưới')) {
      const m = item.match(/(\d+)/);
      if (m) result.max_price = parseInt(m[1]) * 1000000;
      return true;
    }
    if (itemLower.includes('trên') || itemLower.includes('hi-end')) {
      const m = item.match(/(\d+)/);
      if (m) result.min_price = parseInt(m[1]) * 1000000;
      return true;
    }
    const rm = item.match(/(\d+)\s*-\s*(\d+)/);
    if (rm) {
      result.min_price = parseInt(rm[1]) * 1000000;
      result.max_price = parseInt(rm[2]) * 1000000;
      return true;
    }
    return false;
  };

  // ═══ Nhóm Mức giá ═══
  if (titleLower.includes('mức giá') || titleLower === 'theo mức giá') {
    tryParsePrice();
    return result;
  }

  // ═══ LAPTOP ═══
  if (parentCategory === 'Laptop') {
    if (titleLower === 'thương hiệu') {
      let brand = item.replace(/^Laptop\s+/i, '');
      if (brand === 'Macbook') brand = 'Apple';
      result.brand_slug = brand.toLowerCase();
    } else if (titleLower === 'nhu cầu') {
      result.search = item.replace(/^Laptop\s+/i, '');
    }
    return result;
  }

  // ═══ LAPTOP GAMING ═══
  if (parentCategory === 'Laptop Gaming') {
    if (titleLower === 'thương hiệu') {
      const brandMap = {
        'asus rog/tuf': 'asus', 'acer nitro/predator': 'acer',
        'msi gaming': 'msi', 'lenovo legion': 'lenovo',
        'dell alienware/g-series': 'dell', 'hp omen/victus': 'hp'
      };
      result.brand_slug = brandMap[itemLower] || item.split(' ')[0].toLowerCase();
    } else if (titleLower.includes('card') || titleLower.includes('vga')) {
      result.search = item.replace(' Series', '');
    } else if (titleLower === 'tần số quét') {
      result.search = item.replace('Trên ', '');
    }
    return result;
  }

  // ═══ PC EZ4ENCE ═══
  if (parentCategory === 'PC EZ4ENCE') {
    if (titleLower === 'theo nhu cầu' || titleLower === 'cấu hình nổi bật') {
      result.search = item.replace(/^PC\s+/i, '');
    } else if (titleLower === 'theo mức giá') {
      tryParsePrice();
    }
    return result;
  }

  // ═══ MAIN, CPU, VGA ═══
  if (parentCategory === 'Main, CPU, VGA') {
    if (titleLower.includes('bo mạch chủ')) {
      result.category_slug = 'bo-mach-chu';
      result.search = item;
    } else if (titleLower.includes('cpu')) {
      result.category_slug = 'bo-vi-xu-ly';
      result.search = item;
    } else if (titleLower.includes('vga')) {
      result.category_slug = 'card-man-hinh';
      result.search = item.replace(' Series', '');
    }
    return result;
  }

  // ═══ CASE, NGUỒN, TẢN ═══
  if (parentCategory === 'Case, Nguồn, Tản') {
    const knownPsuBrands = ['corsair', 'asus', 'msi', 'gigabyte', 'deepcool'];
    if (titleLower === 'vỏ case') {
      result.category_slug = 'vo-may-tinh';
      result.brand_slug = itemLower;
    } else if (titleLower === 'nguồn máy tính') {
      result.category_slug = 'nguon-may-tinh';
      if (knownPsuBrands.includes(itemLower)) {
        result.brand_slug = itemLower;
      }
      // Các dải công suất (500W - 650W) chỉ thu hẹp danh mục, không search
    } else if (titleLower.includes('tản nhiệt aio')) {
      result.category_slug = 'tan-nhiet';
      result.search = item;
    } else if (titleLower.includes('tản nhiệt khí') || titleLower.includes('fan')) {
      result.category_slug = 'tan-nhiet';
      result.search = item;
    }
    return result;
  }

  // ═══ Ổ CỨNG, RAM, THẺ NHỚ ═══
  if (parentCategory === 'Ổ cứng, RAM, Thẻ nhớ') {
    if (titleLower === 'dung lượng ram') {
      result.category_slug = 'bo-nho-trong';
      result.search = item;
    } else if (titleLower.includes('loại ram')) {
      result.category_slug = 'bo-nho-trong';
      if (['ddr4', 'ddr5'].includes(itemLower)) {
        result.search = item;
      } else {
        result.brand_slug = itemLower;
      }
    } else if (titleLower.includes('dung lượng ssd')) {
      result.category_slug = 'o-cung-ssd';
      if (!itemLower.includes('trên')) {
        result.search = item;
      }
    } else if (titleLower.includes('loại ổ cứng')) {
      if (itemLower.includes('nvme')) {
        result.category_slug = 'o-cung-ssd';
        result.search = 'NVMe';
      } else if (itemLower.includes('sata')) {
        result.category_slug = 'o-cung-ssd';
        result.search = 'SATA';
      } else if (itemLower.includes('hdd')) {
        result.category_slug = 'o-cung-hdd';
      } else {
        result.brand_slug = itemLower;
      }
    }
    return result;
  }

  // ═══ LOA, MICRO, WEBCAM ═══
  if (parentCategory === 'Loa, Micro, Webcam') {
    if (titleLower.includes('thương hiệu loa')) {
      result.category_slug = 'loa';
      result.brand_slug = itemLower;
    } else if (titleLower === 'kiểu loa') {
      result.category_slug = 'loa';
      result.search = item;
    } else if (titleLower === 'microphone') {
      result.category_slug = 'microphone';
      result.search = item.replace(/^Micro\s+/i, '');
    } else if (titleLower === 'webcam') {
      result.category_slug = 'webcam';
      result.search = item;
    }
    return result;
  }

  // ═══ MÀN HÌNH ═══
  if (parentCategory === 'Màn hình') {
    if (titleLower === 'thương hiệu') {
      result.brand_slug = itemLower;
    } else {
      result.search = item;
    }
    return result;
  }

  // ═══ BÀN PHÍM ═══
  if (parentCategory === 'Bàn phím') {
    if (titleLower === 'thương hiệu') {
      result.brand_slug = itemLower;
    } else {
      result.search = item;
    }
    return result;
  }

  // ═══ CHUỘT + LÓT CHUỘT ═══
  if (parentCategory === 'Chuột + Lót chuột') {
    if (titleLower.includes('thương hiệu')) {
      result.category_slug = 'chuot';
      result.brand_slug = itemLower;
    } else if (titleLower.includes('kết nối')) {
      result.category_slug = 'chuot';
      result.search = item;
    } else if (titleLower.includes('lót chuột')) {
      result.category_slug = 'lot-chuot';
      result.search = item;
    }
    return result;
  }

  // ═══ TAI NGHE ═══
  if (parentCategory === 'Tai nghe') {
    if (titleLower.includes('thương hiệu')) {
      result.brand_slug = itemLower;
    } else {
      result.search = item;
    }
    return result;
  }

  // ═══ GHẾ - BÀN ═══
  if (parentCategory === 'Ghế - Bàn') {
    if (titleLower.includes('ghế')) {
      result.category_slug = 'ghe-ban';
      result.brand_slug = itemLower;
    } else if (titleLower.includes('bàn')) {
      result.category_slug = 'ban-gaming';
      result.search = item;
    }
    return result;
  }

  // ═══ PHẦN MỀM, MẠNG ═══
  if (parentCategory === 'Phần mềm, mạng') {
    const routerBrands = ['asus', 'tp-link'];
    if (titleLower.includes('router')) {
      result.category_slug = 'thiet-bi-mang';
      if (routerBrands.includes(itemLower)) {
        result.brand_slug = itemLower;
      } else {
        result.search = item;
      }
    } else if (titleLower.includes('card mạng') || titleLower.includes('usb')) {
      result.category_slug = 'thiet-bi-mang';
      result.search = item;
    } else if (titleLower.includes('phần mềm')) {
      result.category_slug = 'phan-mem';
      result.search = item;
    }
    return result;
  }

  // ═══ HANDHELD, CONSOLE ═══
  if (parentCategory === 'Handheld, Console') {
    if (titleLower.includes('handheld')) {
      result.category_slug = 'handheld';
      result.search = item;
    } else if (titleLower.includes('playstation')) {
      result.category_slug = 'console';
      result.search = item;
    } else if (titleLower.includes('phụ kiện')) {
      result.category_slug = 'console';
      result.search = item;
    }
    return result;
  }

  // ═══ PHỤ KIỆN ═══
  if (parentCategory === 'Phụ kiện') {
    result.search = item;
    return result;
  }

  // Fallback: dùng item làm search
  result.search = item;
  return result;
};

export default function Products() {

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const urlCategory = searchParams.get('category');
  const urlSub = searchParams.get('sub');
  const urlSearch = searchParams.get('search');

  const [productsList, setProductsList] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(normalizeCategory(urlCategory));
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [activeSpecsFilters, setActiveSpecsFilters] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?is_on_sale=true&limit=8`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => setPromoProducts(data.map(mapProduct)))
      .catch(console.error);
      
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?sort=popular&limit=8`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => setHotProducts(data.map(mapProduct)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('limit', ITEMS_PER_PAGE.toString());
    params.append('page', currentPage.toString());

    // ═══ Parse sub-menu filter ═══
    const subFilters = activeSubMenu ? parseSubMenuFilter(selectedCategory, activeSubMenu) : {};

    // ═══ Category slug ═══
    if (selectedCategory !== 'Tất cả') {
      if (subFilters.category_slug) {
        params.append('category_slug', subFilters.category_slug);
      } else {
        const slugs = CATEGORY_SLUG_MAP[selectedCategory];
        if (slugs && slugs.length > 0) {
          params.append('category_slug', slugs.join(','));
        }
      }
    }

    // ═══ Brand: bộ lọc thủ công ưu tiên > sub-menu brand ═══
    if (selectedBrand !== 'Tất cả') {
      params.append('brand_slug', selectedBrand.toLowerCase());
    } else if (subFilters.brand_slug) {
      params.append('brand_slug', subFilters.brand_slug);
    }

    // ═══ Search: kết hợp sub-menu search + user search ═══
    const searchParts = [];
    if (subFilters.search) searchParts.push(subFilters.search);
    if (searchQuery.trim()) searchParts.push(searchQuery.trim());
    if (searchParts.length > 0) params.append('search', searchParts.join(' '));

    // ═══ Sort ═══
    if (sortBy) params.append('sort', sortBy);

    // ═══ Price: sub-menu price ưu tiên > bộ lọc thủ công ═══
    if (subFilters.min_price || subFilters.max_price) {
      if (subFilters.min_price) params.append('min_price', subFilters.min_price.toString());
      if (subFilters.max_price) params.append('max_price', subFilters.max_price.toString());
    } else if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      params.append('min_price', min.toString());
      params.append('max_price', max.toString());
    }

    // ═══ Dynamic specs filtering ═══
    Object.entries(activeSpecsFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    const cacheKey = params.toString();

    // ⚡ Hiện cache ngay lập tức (không loading)
    const cached = getCached(cacheKey);
    if (cached) {
      setProductsList(cached.products);
      setTotalPages(cached.totalPages);
      setTotalProducts(cached.total);
      setLoading(false);
    } else {
      setLoading(true);
    }

    // Fetch nền để cập nhật dữ liệu mới
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(resData => {
        const data = resData.data || [];
        const totalPages = Math.ceil((resData.total || 0) / ITEMS_PER_PAGE);
        const total = resData.total || 0;
        const mapped = data.map(mapProduct);

        setCache(cacheKey, { products: mapped, totalPages, total });
        setTotalPages(totalPages);
        setTotalProducts(total);
        setProductsList(mapped);
      })
      .finally(() => setLoading(false))
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, [selectedCategory, selectedBrand, searchQuery, activeSpecsFilters, activeSubMenu, currentPage, selectedPrice, sortBy]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(normalizeCategory(urlCategory));
      setActiveSpecsFilters({});
    } else {
      setSelectedCategory('Tất cả');
    }

    if (urlSub) {
      setActiveSubMenu(urlSub);
    } else {
      setActiveSubMenu(null);
    }
  }, [urlCategory, urlSub]);

  useEffect(() => {
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

const paginatedProducts = productsList;

  const activeFilterCount = [
    selectedCategory !== 'Tất cả',
    selectedBrand !== 'Tất cả',
    selectedPrice !== 'all',
    searchQuery.trim().length > 0,
    activeSubMenu !== null
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedBrand('Tất cả');
    setSelectedPrice('all');
    setActiveSpecsFilters({});
    setSearchQuery('');
    setActiveSubMenu(null);
    setCurrentPage(1);
    navigate('/products', { replace: true });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      const filterElement = document.getElementById('products-filter-bar');
      if (filterElement) {
        const y = filterElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSpecFilterChange = (specKey, value) => {
    setActiveSpecsFilters(prev => ({
      ...prev,
      [specKey]: value
    }));
    setCurrentPage(1);
  };

  const isFiltering = activeFilterCount > 0;
  const showDashboard = !isFiltering;

  return (
    <div className="products-page">
      <CyberBackground />

      <div className="container home-dashboard-wrapper" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className="home-sidebar">
          <CategorySidebar />
        </aside>

        {/* ── RIGHT MAIN CONTENT ── */}
        <main className="home-main">
          {/* ── PAGE HEADER ── */}
          <section className="products-page-header" style={{ paddingTop: 0, paddingBottom: '0px' }}>
            {selectedCategory !== 'Tất cả' && (
              <div className="breadcrumb">
                <Link to="/products" onClick={() => setSelectedCategory('Tất cả')}>Sản phẩm</Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{selectedCategory}</span>
              </div>
            )}
            <h1 className="glitch-text text-3xl font-bold" data-text={selectedCategory === 'Tất cả' ? "SẢN PHẨM" : selectedCategory.toUpperCase()}>
              {selectedCategory === 'Tất cả' ? "SẢN PHẨM" : selectedCategory.toUpperCase()}
            </h1>
            <p className="text-muted">{totalProducts} sản phẩm được tìm thấy</p>
          </section>

          {/* ── BENTO BANNERS ── */}
          {showDashboard && <BentoBanners />}

          {/* ── PROMO & HOT BLOCKS ── */}
          {showDashboard && (
            <div className="products-dashboard-blocks" style={{ marginBottom: '40px' }}>
              <FlashSaleBlock />

              <section className="home-section" style={{ marginTop: '40px' }}>
                <div className="section-header">
                  <div className="section-header-left">
                    <span className="section-tag">// TRENDING</span>
                    <h2 className="section-title glitch-text" data-text="Sản Phẩm Bán Chạy" style={{ fontSize: '24px' }}>Sản Phẩm Bán Chạy</h2>
                  </div>
                </div>
                <div className="products-grid-container grid-view" style={{ gap: '16px' }}>
                  {hotProducts.length === 0
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <ProductSkeleton key={`hot-sk-${i}`} index={i} />
                      ))
                    : hotProducts.map((item, index) => (
                        <ProductCard key={`hot-${item.id}`} product={item} index={index} />
                      ))
                  }
                </div>
              </section>
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <section id="products-filter-bar" className="filter-bar" style={{ marginBottom: '24px', paddingTop: '20px', position: 'relative', zIndex: 100 }}>
        <div className="products-filter-bar glass">
          {/* Desktop Filters */}
          <div className="filter-controls-desktop" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div className="filter-group-left" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="filter-icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', fontWeight: '500', color: 'var(--text-color)' }}>
                <Filter size={16} /> Bộ lọc
              </div>

              <CustomSelect
                value="Tình trạng sản phẩm"
                onChange={() => {}}
                options={[{value: 'Tình trạng sản phẩm', label: 'Tình trạng sản phẩm'}, {value: 'Mới', label: 'Mới'}, {value: 'Cũ', label: 'Cũ'}]}
              />

              <CustomSelect
                value={selectedPrice}
                onChange={(val) => { setSelectedPrice(val); setCurrentPage(1); }}
                options={PRICE_RANGES.map(p => ({ value: p.value, label: p.label.replace('💰 ', '') }))}
              />

              <CustomSelect
                value={selectedBrand}
                onChange={(val) => { setSelectedBrand(val); setCurrentPage(1); }}
                options={BRANDS.map(b => ({ value: b, label: b === 'Tất cả' ? 'Hãng' : b }))}
              />

              {CATEGORY_FILTERS_CONFIG[selectedCategory]?.map((filterName, idx) => {
                // Extract unique values for this spec from loaded products
                const uniqueValues = [...new Set(productsList.map(p => p.fullSpecs?.[filterName]).filter(Boolean))];
                const displayName = FILTER_DISPLAY_NAMES[filterName] || filterName;
                return (
                  <CustomSelect
                    key={idx}
                    value={activeSpecsFilters[filterName] || displayName}
                    onChange={(val) => handleSpecFilterChange(filterName, val === displayName ? null : val)}
                    options={[
                      {value: displayName, label: displayName},
                      ...uniqueValues.map(v => ({value: v, label: v.length > 25 ? v.substring(0,25) + '...' : v}))
                    ]}
                  />
                );
              })}
            </div>

            <div className="filter-group-right">
              <CustomSelect
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={SORT_OPTIONS.map(s => ({ value: s.value, label: `Xếp theo: ${s.label.replace('🔥 ', '').replace('💰 ', '')}` }))}
              />
            </div>
          </div>

          {/* View Mode & Mobile Toggle */}
          <div className="filter-actions">
            <button
              className="filter-mobile-toggle"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
            </button>

            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              className="filter-mobile-panel glass"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CustomSelect
                value={selectedCategory}
                onChange={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
                options={CATEGORIES.map(c => ({ value: c, label: c === 'Tất cả' ? '📂 Danh mục' : c }))}
              />
              <CustomSelect
                value={selectedBrand}
                onChange={(val) => { setSelectedBrand(val); setCurrentPage(1); }}
                options={BRANDS.map(b => ({ value: b, label: b === 'Tất cả' ? '🏷️ Thương hiệu' : b }))}
              />
              <CustomSelect
                value={selectedPrice}
                onChange={(val) => { setSelectedPrice(val); setCurrentPage(1); }}
                options={PRICE_RANGES}
              />
              <CustomSelect
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={SORT_OPTIONS}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Tags */}
        {activeFilterCount > 0 && (
          <div className="active-filters-row">
            {selectedCategory !== 'Tất cả' && (
              <span className="active-filter-tag">
                {selectedCategory}
                <button onClick={() => { setSelectedCategory('Tất cả'); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            {selectedBrand !== 'Tất cả' && (
              <span className="active-filter-tag">
                {selectedBrand}
                <button onClick={() => { setSelectedBrand('Tất cả'); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            {selectedPrice !== 'all' && (
              <span className="active-filter-tag">
                {PRICE_RANGES.find(p => p.value === selectedPrice)?.label}
                <button onClick={() => { setSelectedPrice('all'); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            {activeSubMenu && (
              <span className="active-filter-tag">
                {activeSubMenu.includes(': ') ? activeSubMenu.split(': ').pop() : activeSubMenu}
                <button onClick={() => { 
                   setActiveSubMenu(null); 
                   const params = new URLSearchParams(window.location.search);
                   params.delete('sub');
                   navigate(`/products?${params.toString()}`, { replace: true });
                }}><X size={12} /></button>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="active-filter-tag">
                &quot;{searchQuery}&quot;
                <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }}><X size={12} /></button>
              </span>
            )}
            <button className="clear-all-btn" onClick={clearAllFilters}>Xóa tất cả</button>
          </div>
        )}
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="products-grid-section">
        {loading ? (
          <div className={`products-grid-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <ProductSkeleton key={`skeleton-${idx}`} index={idx} />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="products-empty glass">
            <div className="products-empty-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p className="text-muted">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
            <button className="btn btn-outline" onClick={clearAllFilters}>Xóa bộ lọc</button>
          </div>
        ) : (
          <div className={`products-grid-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
            {paginatedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="products-pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>
        </main>
      </div>
    </div>
  );
}
