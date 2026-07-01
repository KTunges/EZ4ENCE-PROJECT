import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../../components/ui/CyberBackground';
import ProductCard from '../../components/ui/ProductCard';
import ProductSkeleton from '../../components/ui/ProductSkeleton';
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

const PRICE_RANGES = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: '0-2000000', label: 'Dưới 2 triệu' },
  { value: '2000000-5000000', label: '2 - 5 triệu' },
  { value: '5000000-10000000', label: '5 - 10 triệu' },
  { value: '10000000-20000000', label: '10 - 20 triệu' },
  { value: '20000000-999999999', label: 'Trên 20 triệu' },
];

const ITEMS_PER_PAGE = 24;

const getRequiredCategorySlug = (selectedCategory, activeSubMenu) => {
  if (!activeSubMenu || !activeSubMenu.includes(': ')) return null;
  const columnContext = activeSubMenu.split(': ')[0].toLowerCase();
  
  if (['Main, CPU, VGA', 'Case, Nguồn, Tản', 'Ổ cứng, RAM, Thẻ nhớ', 'Chuột + Lót chuột', 'Loa, Micro, Webcam', 'Phần mềm, mạng', 'Handheld, Console', 'Ghế - Bàn', 'Linh Kiện Máy Tính'].includes(selectedCategory)) {
     if (columnContext.includes('bo mạch') || columnContext.includes('mainboard') || columnContext.includes('bo mạch chủ')) return 'bo-mach-chu';
     if (columnContext.includes('vi xử lý') || columnContext.includes('cpu')) return 'bo-vi-xu-ly';
     if (columnContext.includes('card màn hình') || columnContext.includes('vga')) return 'card-man-hinh';
     if (columnContext.includes('case') || columnContext.includes('vỏ')) return 'vo-may-tinh';
     if (columnContext.includes('nguồn')) return 'nguon-may-tinh';
     if (columnContext.includes('tản nhiệt') || columnContext.includes('fan')) return 'tan-nhiet';
     if (columnContext.includes('ram')) return 'bo-nho-trong';
     if (columnContext.includes('ổ cứng ssd') || columnContext.includes('dung lượng ssd')) return 'o-cung-ssd';
     if (columnContext.includes('ổ cứng hdd') || columnContext.includes('dung lượng hdd')) return 'o-cung-hdd';
     if (columnContext.includes('ổ cứng')) return 'o-cung-ssd';
     if (columnContext.includes('thẻ nhớ') || columnContext.includes('usb')) return 'the-nho-usb';
     if (columnContext.includes('thương hiệu chuột') || columnContext.includes('kết nối & loại') || columnContext === 'chuột') return 'chuot';
     if (columnContext.includes('lót chuột')) return 'lot-chuot';
     if (columnContext.includes('loa')) return 'loa';
     if (columnContext.includes('micro')) return 'microphone';
     if (columnContext.includes('webcam')) return 'webcam';
     if (columnContext.includes('phần mềm')) return 'phan-mem';
     if (columnContext.includes('mạng') || columnContext.includes('router') || columnContext.includes('wi-fi')) return 'thiet-bi-mang';
     if (columnContext.includes('handheld') || columnContext.includes('cầm tay') || columnContext.includes('handheld pc')) return 'handheld';
     if (columnContext.includes('playstation') || columnContext.includes('phụ kiện gaming')) return 'console';
     if (columnContext.includes('ghế')) return 'ghe-ban';
     if (columnContext.includes('bàn')) return 'ban-gaming';
  }
  return null;
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
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'Tất cả');
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

    if (selectedCategory !== 'Tất cả') {
      const requiredCategory = getRequiredCategorySlug(selectedCategory, activeSubMenu);
      if (requiredCategory) {
        params.append('category_slug', requiredCategory);
      } else {
        const slugs = CATEGORY_SLUG_MAP[selectedCategory];
        if (slugs && slugs.length > 0) {
          params.append('category_slug', slugs.join(','));
        }
      }
    }

    if (selectedBrand !== 'Tất cả') params.append('brand_slug', selectedBrand.toLowerCase());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (sortBy) params.append('sort', sortBy);
    
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      params.append('min_price', min.toString());
      params.append('max_price', max.toString());
    }

    // Dynamic specs filtering
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
      setSelectedCategory(urlCategory);
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
            <div className="breadcrumb">
              {selectedCategory !== 'Tất cả' ? (
                <>
                  <Link to="/products" onClick={() => setSelectedCategory('Tất cả')}>Sản phẩm</Link>
                  <span className="breadcrumb-sep">/</span>
                  <span className="breadcrumb-current">{selectedCategory}</span>
                </>
              ) : (
                <span className="breadcrumb-current">Sản phẩm</span>
              )}
            </div>
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
              <section className="home-section">
                <div className="section-header">
                  <div className="section-header-left">
                    <span className="section-tag">// FLASH SALE</span>
                    <h2 className="section-title glitch-text" data-text="Sản Phẩm Khuyến Mãi" style={{ fontSize: '24px' }}>Sản Phẩm Khuyến Mãi</h2>
                  </div>
                </div>
                <div className="products-grid-container grid-view" style={{ gap: '16px' }}>
                  {promoProducts.map((item, index) => (
                    <ProductCard key={`promo-${item.id}`} product={item} index={index} />
                  ))}
                </div>
              </section>

              <section className="home-section" style={{ marginTop: '40px' }}>
                <div className="section-header">
                  <div className="section-header-left">
                    <span className="section-tag">// TRENDING</span>
                    <h2 className="section-title glitch-text" data-text="Sản Phẩm HOT" style={{ fontSize: '24px' }}>Sản Phẩm HOT</h2>
                  </div>
                </div>
                <div className="products-grid-container grid-view" style={{ gap: '16px' }}>
                  {hotProducts.map((item, index) => (
                    <ProductCard key={`hot-${item.id}`} product={item} index={index} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <section id="products-filter-bar" className="filter-bar" style={{ marginBottom: '24px', paddingTop: '20px' }}>
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
