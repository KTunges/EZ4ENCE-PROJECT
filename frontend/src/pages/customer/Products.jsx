import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../../components/ui/CyberBackground';
import ProductCard from '../../components/ui/ProductCard';
import CustomSelect from '../../components/ui/CustomSelect';
import CategorySidebar from '../../components/layout/CategorySidebar';
import BentoBanners from '../../components/ui/BentoBanners';

const CATEGORIES = ['Tất cả', 'Laptop', 'Laptop Gaming', 'PC EZ4ENCE', 'Linh Kiện Máy Tính', 'Màn hình', 'Bàn phím', 'Chuột + Lót chuột', 'Âm thanh - Webcam', 'Phần mềm, mạng', 'Console', 'Phụ kiện', 'Dịch vụ'];
const BRANDS = ['Tất cả', 'ASUS', 'Acer', 'Lenovo', 'Dell', 'HP', 'Gigabyte', 'Logitech', 'Razer', 'SteelSeries', 'Intel', 'MSI', 'G.Skill', 'Samsung', 'LG', 'Corsair', 'NZXT', 'Artisan'];
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
  const urlSub = searchParams.get('sub');
  const urlSearch = searchParams.get('search');

  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'Tất cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeSpecsFilters, setActiveSpecsFilters] = useState({});

  useEffect(() => {
    // Build query params
    const params = new URLSearchParams();
    params.append('limit', '1000');
    
    // Ánh xạ danh mục Frontend sang Backend slug (nếu có 1-1)
    // Các danh mục tổng hợp (Linh kiện, Âm thanh...) sẽ không gửi category_slug để Frontend tự lọc
    const backendCategoryMap = {
      'laptop': 'laptop',
      'laptop gaming': 'laptop-gaming',
      'pc ez4ence': 'pc-ez4ence',
      'màn hình': 'màn-hình',
      'bàn phím': 'ban-phim',
      'chuột + lót chuột': 'chuot'
    };
    
    if (selectedCategory !== 'Tất cả') {
      const catLower = selectedCategory.toLowerCase();
      if (backendCategoryMap[catLower]) {
        params.append('category_slug', backendCategoryMap[catLower]);
      }
    }

    if (selectedBrand !== 'Tất cả') params.append('brand_slug', selectedBrand.toLowerCase());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    // Add dynamic specs filtering from state
    Object.entries(activeSpecsFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    // Dynamic specs filtering is handled by frontend search phrases, so no need to send specific spec keys to backend.


    fetch(`http://localhost:8000/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
            console.error("API did not return an array:", data);
            setProductsList([]);
            setIsLoading(false);
            return;
        }
        // Map backend schema to frontend schema
        const mapped = data.map(item => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          brand: item.brand?.name || 'Unknown',
          category: item.category?.name || 'Unknown',
          categorySlug: item.category?.slug || '',
          price: item.skus?.[0]?.price || 0,
          originalPrice: item.skus?.[0]?.promotional_price || null,
          image: item.images?.[0]?.url || '',
          rating: item.rating || 5,
          reviewCount: item.review_count || 0,
          badge: item.skus?.[0]?.promotional_price > item.skus?.[0]?.price ? 'HOT' : null,
          specs: Object.values(item.specifications || {}).slice(0, 4),
          fullSpecs: item.specifications || {},
          stock: item.skus?.[0]?.stock_quantity || 0,
          skus: item.skus || []
        }));
        setProductsList(mapped);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
      });
  }, [selectedCategory, selectedBrand, searchQuery, urlSub, activeSpecsFilters]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      setActiveSpecsFilters({}); // reset specs when category changes via url
    } else {
      setSelectedCategory('Tất cả');
    }

    if (urlSub) {
      const foundBrand = BRANDS.find(b => b !== 'Tất cả' && urlSub.toLowerCase().includes(b.toLowerCase()));
      if (foundBrand) {
        setSelectedBrand(foundBrand);
      } else {
        // Fallback for sub-categories that aren't brands (e.g. price ranges or specs)
        setSelectedBrand('Tất cả');
      }
    } else {
      setSelectedBrand('Tất cả');
    }
  }, [urlCategory, urlSub]);

  useEffect(() => {
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Search
    if (searchQuery.trim()) {
      const keywords = searchQuery.toLowerCase().trim().split(/\s+/);
      result = result.filter(p => {
        const textToSearch = (p.name + " " + p.brand).toLowerCase();
        return keywords.every(kw => textToSearch.includes(kw));
      });
    }

    // Filter by Category
    if (selectedCategory !== 'Tất cả') {
      const catLower = selectedCategory.toLowerCase();
      const categoryMatch = catLower.replace(/ /g, '-');
      const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      
      const aliases = {
        'linh kiện máy tính': ['main', 'cpu', 'vga', 'card', 'bo mạch', 'bộ vi', 'mainboard', 'case', 'nguồn', 'tản', 'vỏ', 'ram', 'ổ cứng', 'ssd', 'hdd', 'bộ nhớ'],
        'pc ez4ence': ['pc ez4ence', 'pc lắp ráp', 'pc'],
        'chuột + lót chuột': ['chuột', 'lót chuột', 'chuot'],
        'âm thanh - webcam': ['loa', 'webcam', 'tai nghe', 'microphone', 'soundbar'],
        'phần mềm, mạng': ['phần mềm', 'mạng']
      };

      const matchedAliases = aliases[catLower] || [catLower];

      result = result.filter(p => {
        const pCat = (p.category?.name || p.category || '').toLowerCase();
        const pSlug = (p.categorySlug || '').toLowerCase();
        
        // Exclusion rule: if filtering for "Màn hình", exclude items containing "Card"
        if (catLower === 'màn hình' && pCat.includes('card')) return false;

        const normalizedCat = removeAccents(pCat);
        const normalizedSlug = removeAccents(pSlug);
        const normalizedCategoryMatch = removeAccents(categoryMatch);

        return matchedAliases.some(alias => {
            const normalizedAlias = removeAccents(alias);
            return normalizedCat.includes(normalizedAlias) || 
                   normalizedSlug.includes(removeAccents(alias.replace(/ /g, '-'))) ||
                   normalizedSlug === normalizedCategoryMatch ||
                   pCat.includes(alias) ||
                   pSlug.includes(alias.replace(/ /g, '-'));
        });
      });
    }

    // Filter by Brand
    if (selectedBrand !== 'Tất cả') {
      result = result.filter(p => 
        p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Advanced Sub-category (urlSub) text & price filter
    if (urlSub) {
      const lowerSub = urlSub.toLowerCase();
      
      if (lowerSub.includes('triệu')) {
        let min = 0, max = 999999999;
        if (lowerSub.includes('dưới 1 triệu')) max = 1000000;
        else if (lowerSub.includes('từ 1 triệu đến 2 triệu')) { min = 1000000; max = 2000000; }
        else if (lowerSub.includes('dưới 10 triệu')) max = 10000000;
        else if (lowerSub.includes('dưới 15 triệu')) max = 15000000;
        else if (lowerSub.includes('10 - 20 triệu')) { min = 10000000; max = 20000000; }
        else if (lowerSub.includes('15 - 20 triệu')) { min = 15000000; max = 20000000; }
        else if (lowerSub.includes('20 - 25 triệu')) { min = 20000000; max = 25000000; }
        else if (lowerSub.includes('20 - 30 triệu')) { min = 20000000; max = 30000000; }
        else if (lowerSub.includes('30 - 50 triệu')) { min = 30000000; max = 50000000; }
        else if (lowerSub.includes('trên 50 triệu')) min = 50000000;
        else if (lowerSub.includes('trên 25 triệu')) min = 25000000;
        else if (lowerSub.includes('trên 2 triệu')) min = 2000000;
        
        result = result.filter(p => p.price >= min && p.price <= max);
      } else {
        let searchPhrases = [lowerSub.replace('xem tất cả', '').trim()];
        if (lowerSub.includes('/')) {
            searchPhrases = lowerSub.split('/').map(s => s.replace('xem tất cả', '').trim()).filter(Boolean);
        }

        result = result.filter(p => {
            const pool = [
                p.name, 
                p.category?.name || p.category, 
                p.categorySlug,
                p.brand?.name || p.brand, 
                p.description,
                ...(p.fullSpecs ? Object.values(p.fullSpecs) : [])
            ].join(' ').toLowerCase();

            return searchPhrases.some(phrase => {
                const words = phrase.replace(/[+,()]/g, ' ').split(/\s+/).filter(w => w.length > 1);
                if (words.length === 0) return true;
                return words.every(w => pool.includes(w));
            });
        });
      }
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
  }, [searchQuery, selectedCategory, selectedBrand, selectedPrice, sortBy, productsList]);

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
    setActiveSpecsFilters({});
    setSortBy('popular');
    setCurrentPage(1);
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
  const promoProducts = productsList.filter(p => p.originalPrice > p.price).slice(0, 5);
  const hotProducts = productsList.filter(p => p.badge === 'HOT').slice(0, 5);

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
          <section id="products-filter-bar" className="products-filter-section" style={{ padding: 0 }}>
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
                return (
                  <CustomSelect
                    key={idx}
                    value={activeSpecsFilters[filterName] || filterName}
                    onChange={(val) => handleSpecFilterChange(filterName, val === filterName ? null : val)}
                    options={[
                      {value: filterName, label: filterName},
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
