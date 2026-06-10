import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Home, Grid3X3, List, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/ui/CyberBackground';
import ProductCard from '../components/ui/ProductCard';
import CustomSelect from '../components/ui/CustomSelect';
import CategorySidebar from '../components/layout/CategorySidebar';
/* ─── MOCK DATA ─── */

const MOCK_PRODUCTS = [
  {
    id: '1', slug: 'vga-asus-rog-strix-rtx-4090',
    name: 'VGA ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    brand: 'ASUS', category: 'VGA', categorySlug: 'vga',
    price: 55000000, originalPrice: 62000000,
    image: 'https://product.hstatic.net/200000722513/product/thumb-web-asus-rog-strix-rtx4090_65bed05f84f04c65b0cca5efdcf5e3fd_1024x1024.png',
    rating: 5, reviewCount: 128, badge: 'HOT',
    specs: ['24GB GDDR6X', '384-bit', 'PCIE 4.0', 'Tản nhiệt 3 quạt']
  },
  {
    id: '2', slug: 'chuot-logitech-g-pro-x-superlight-2',
    name: 'Chuột Logitech G Pro X Superlight 2 Wireless',
    brand: 'Logitech', category: 'Chuột', categorySlug: 'chuot',
    price: 3200000, originalPrice: 3500000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_superlight_2_white_b01eaed5e34e4e5fb000b731f61f4430_1024x1024.png',
    rating: 5, reviewCount: 256, badge: 'HOT',
    specs: ['Hero 2 Sensor', '60g', 'LIGHTSPEED Wireless']
  },
  {
    id: '3', slug: 'ban-phim-razer-huntsman-v3-pro',
    name: 'Bàn Phím Cơ Razer Huntsman V3 Pro TKL',
    brand: 'Razer', category: 'Bàn phím', categorySlug: 'ban-phim',
    price: 4500000, originalPrice: 5200000,
    image: 'https://product.hstatic.net/200000722513/product/huntsman-v3-pro-tkl-1_d8f5be6db21e41ac833c1e5e0bb2b1cd_1024x1024.png',
    rating: 4, reviewCount: 89, badge: 'NEW',
    specs: ['Analog Optical Switch', 'TKL', 'PBT Keycaps']
  },
  {
    id: '4', slug: 'tai-nghe-steelseries-arctis-nova-pro',
    name: 'Tai Nghe SteelSeries Arctis Nova Pro Wireless',
    brand: 'SteelSeries', category: 'Tai nghe', categorySlug: 'tai-nghe',
    price: 9200000, originalPrice: 10500000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_arctis_nova_pro_wireless_47e9e52c6c2b444aa89e70d5a6c39e94_1024x1024.png',
    rating: 5, reviewCount: 67, badge: 'HOT',
    specs: ['ANC', 'Hi-Res Audio', 'Dual Battery']
  },
  {
    id: '5', slug: 'cpu-intel-core-i9-14900k',
    name: 'CPU Intel Core i9-14900K 3.2GHz 24 Cores 32 Threads',
    brand: 'Intel', category: 'CPU', categorySlug: 'cpu',
    price: 14500000, originalPrice: 16000000,
    image: 'https://product.hstatic.net/200000722513/product/cpu-intel-core-i9-14900k_afef37e07d704ee0a70c201497a8b26a_1024x1024.png',
    rating: 5, reviewCount: 203, badge: 'HOT',
    specs: ['24 Cores', '32 Threads', 'Max 6.0 GHz']
  },
  {
    id: '6', slug: 'mainboard-msi-mag-z790-tomahawk',
    name: 'Mainboard MSI MAG Z790 Tomahawk WiFi DDR5',
    brand: 'MSI', category: 'Mainboard', categorySlug: 'mainboard',
    price: 8900000, originalPrice: 9500000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_z790_tomahawk_wifi_14e35a0f71fe437a93d4a3e9f69fcbb2_1024x1024.png',
    rating: 4, reviewCount: 45, badge: null,
    specs: ['LGA 1700', 'DDR5 7200MHz+', 'WiFi 6E']
  },
  {
    id: '7', slug: 'ram-gskill-trident-z5-rgb-ddr5',
    name: 'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000',
    brand: 'G.Skill', category: 'RAM', categorySlug: 'ram',
    price: 3800000, originalPrice: 4200000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_ram_gskill_trident_z5_rgb_0abc8a3e0b134fa09a1f5b1b2f6e1e1f_1024x1024.png',
    rating: 5, reviewCount: 112, badge: 'NEW',
    specs: ['2x16GB', 'DDR5 6000MHz', 'CL36', 'RGB']
  },
  {
    id: '8', slug: 'ssd-samsung-990-pro-2tb',
    name: 'SSD Samsung 990 Pro 2TB PCIe NVMe M.2',
    brand: 'Samsung', category: 'Lưu trữ', categorySlug: 'luu-tru',
    price: 5200000, originalPrice: 5800000,
    image: 'https://product.hstatic.net/200000722513/product/samsung-990-pro-thumb_ecd40e7c35814f0c9ed389b3cf01c8d8_1024x1024.png',
    rating: 5, reviewCount: 178, badge: null,
    specs: ['2TB', 'PCIe 4.0 x4', 'Đọc 7450 MB/s']
  },
  {
    id: '9', slug: 'man-hinh-lg-27gp850-b',
    name: 'Màn Hình LG 27GP850-B 27" QHD 165Hz Nano IPS',
    brand: 'LG', category: 'Màn hình', categorySlug: 'man-hinh',
    price: 9500000, originalPrice: 11000000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_lg_27gp850_b_8e7b10e49c044c8e981e49e5fa7ee5c3_1024x1024.png',
    rating: 4, reviewCount: 93, badge: 'HOT',
    specs: ['27"', '2K QHD', 'Nano IPS', '165Hz', '1ms']
  },
  {
    id: '10', slug: 'psu-corsair-rm1000x-shift',
    name: 'Nguồn Corsair RM1000x SHIFT 1000W 80 Plus Gold',
    brand: 'Corsair', category: 'Nguồn', categorySlug: 'nguon',
    price: 4800000, originalPrice: 5500000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_corsair_rm1000x_shift_a8e7b57e5e2b4b6fb43fe1c1a94e7d74_1024x1024.png',
    rating: 5, reviewCount: 56, badge: null,
    specs: ['1000W', '80 Plus Gold', 'Full Modular']
  },
  {
    id: '11', slug: 'case-nzxt-h9-flow',
    name: 'Case NZXT H9 Flow ATX Mid Tower Tempered Glass',
    brand: 'NZXT', category: 'Case', categorySlug: 'case',
    price: 4200000, originalPrice: 4600000,
    image: 'https://product.hstatic.net/200000722513/product/thumbweb_nzxt_h9_flow_white_86d8b4e7b5e6469e91b30fb55282a06a_1024x1024.png',
    rating: 4, reviewCount: 34, badge: 'NEW',
    specs: ['ATX Mid Tower', 'Kính cường lực', 'Airflow tốt']
  },
  {
    id: '12', slug: 'lot-chuot-artisan-hayate-otsu',
    name: 'Lót Chuột Artisan Hayate Otsu V2 XL Soft',
    brand: 'Artisan', category: 'Phụ kiện', categorySlug: 'phu-kien',
    price: 1800000, originalPrice: null,
    image: 'https://product.hstatic.net/200000722513/product/artisan-hayate-otsu-thumb_f4f3d0da06d040a5a6f1e7d0ad9e8c1b_1024x1024.png',
    rating: 5, reviewCount: 421, badge: 'HOT',
    specs: ['Size XL', 'Bề mặt Soft', 'Made in Japan']
  },
];

const CATEGORIES = ['Tất cả', 'VGA', 'CPU', 'Mainboard', 'RAM', 'Lưu trữ', 'Màn hình', 'Chuột', 'Bàn phím', 'Tai nghe', 'Nguồn', 'Case', 'Phụ kiện'];
const BRANDS = ['Tất cả', 'ASUS', 'Logitech', 'Razer', 'SteelSeries', 'Intel', 'MSI', 'G.Skill', 'Samsung', 'LG', 'Corsair', 'NZXT', 'Artisan'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

const CATEGORY_FILTERS_CONFIG = {
  'Mainboard': ['Chipset', 'Kích thước', 'Loại RAM', 'Socket'],
  'Laptop': ['CPU', 'RAM', 'Ổ cứng', 'VGA', 'Màn hình'],
  'PC': ['CPU', 'RAM', 'VGA', 'Tản nhiệt'],
  'Case': ['Kích thước', 'Màu sắc', 'Chất liệu'],
  'RAM': ['Loại RAM', 'Dung lượng', 'Bus'],
  'Màn hình': ['Kích thước', 'Độ phân giải', 'Tần số quét', 'Tấm nền'],
  'Bàn phím': ['Loại Switch', 'Kết nối', 'Kích thước'],
  'Chuột': ['Kết nối', 'DPI', 'Trọng lượng'],
  'Tai nghe': ['Kết nối', 'Kiểu dáng', 'Microphone']
};

const PRICE_RANGES = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: '0-2000000', label: 'Dưới 2 triệu' },
  { value: '2000000-5000000', label: '2 - 5 triệu' },
  { value: '5000000-10000000', label: '5 - 10 triệu' },
  { value: '10000000-20000000', label: '10 - 20 triệu' },
  { value: '20000000-999999999', label: 'Trên 20 triệu' },
];

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlCategory = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'Tất cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (urlCategory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(urlCategory);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory('Tất cả');
    }
  }, [urlCategory]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'Tất cả') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand !== 'Tất cả') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Price range
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default: // popular
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, selectedPrice, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [
    selectedCategory !== 'Tất cả',
    selectedBrand !== 'Tất cả',
    selectedPrice !== 'all',
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tất cả');
    setSelectedBrand('Tất cả');
    setSelectedPrice('all');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const isFiltering = activeFilterCount > 0;
  const showDashboard = !isFiltering;
  const promoProducts = MOCK_PRODUCTS.filter(p => p.originalPrice > p.price).slice(0, 5);
  const hotProducts = MOCK_PRODUCTS.filter(p => p.badge === 'HOT').slice(0, 5);

  return (
    <div className="products-page">
      <CyberBackground />

      <div className="container home-dashboard-wrapper" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className="home-sidebar">
          <CategorySidebar />
        </aside>

        {/* ── RIGHT MAIN CONTENT ── */}
        <main className="home-main">
          {/* ── PAGE HEADER ── */}
          <section className="products-page-header" style={{ paddingTop: 0, paddingBottom: '20px' }}>
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
            <p className="text-muted">{filteredProducts.length} sản phẩm được tìm thấy</p>
          </section>

          {/* ── PROMO & HOT BLOCKS OR FILTER & GRID ── */}
          {showDashboard ? (
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

          ) : (
            <>
              {/* ── FILTER BAR ── */}
              <section className="products-filter-section" style={{ padding: 0 }}>
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

              {CATEGORY_FILTERS_CONFIG[selectedCategory]?.map((filterName, idx) => (
                <CustomSelect
                  key={idx}
                  value={filterName}
                  onChange={() => {}}
                  options={[{value: filterName, label: filterName}]}
                />
              ))}
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
      <section className="container products-grid-section">
        {paginatedProducts.length === 0 ? (
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
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
