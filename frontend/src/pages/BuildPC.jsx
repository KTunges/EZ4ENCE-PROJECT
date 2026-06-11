import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Box, HardDrive, Zap, 
  Monitor, Search, X, Plus, 
  Check, Trash2, RefreshCw, ShoppingCart, 
  Settings2, LucideFan, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CyberBackground from '../components/ui/CyberBackground';
import CustomSelect from '../components/ui/CustomSelect';

// Mock Data for Build PC Components
const BUILD_PC_PRODUCTS = [
  { id: 'cpu-1', category: 'CPU', name: 'CPU INTEL CORE I9 14900K (3.2GHZ TURBO UP TO 6.0GHZ, 24 NHÂN 32 LUỒNG, 36MB CACHE, 125W, LGA 1700)', price: 14500000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80', brand: 'Intel', code: 'CPU001', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'cpu-2', category: 'CPU', name: 'CPU AMD RYZEN 9 7950X3D (4.2GHZ BOOST 5.7GHZ, 16 NHÂN 32 LUỒNG, 128MB CACHE, 120W, AM5)', price: 16900000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80', brand: 'AMD', code: 'CPU002', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'cpu-3', category: 'CPU', name: 'CPU INTEL CORE I5 13600KF (3.5GHZ TURBO UP TO 5.1GHZ, 14 NHÂN 20 LUỒNG, 20MB CACHE, 125W, LGA 1700/RAPTOR LAKE)', price: 7799000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80', brand: 'Intel', code: 'CPU003', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'cpu-4', category: 'CPU', name: 'CPU INTEL CORE I5 13400F (UP TO 4.6GHZ, 10 NHÂN 16 LUỒNG, 20MB CACHE, 65W) - SOCKET INTEL LGA 1700/RAPTOR LAKE', price: 4999000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80', brand: 'Intel', code: 'CPU004', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'cpu-5', category: 'CPU', name: 'CPU INTEL CORE I5 13400 (UP TO 4.6GHZ, 10 NHÂN 16 LUỒNG, 20MB CACHE, 65W) - SOCKET INTEL LGA 1700/RAPTOR LAKE', price: 5999000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80', brand: 'Intel', code: 'CPU005', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'mb-1', category: 'Mainboard', name: 'ASUS ROG MAXIMUS Z790 HERO', price: 16900000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', brand: 'ASUS', code: 'MB001', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'mb-2', category: 'Mainboard', name: 'GIGABYTE B760M AORUS ELITE AX', price: 4200000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', brand: 'Gigabyte', code: 'MB002', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'ram-1', category: 'RAM', name: 'Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6200MHz', price: 4800000, image: 'https://images.unsplash.com/photo-1563687462186-b4845186b5b8?auto=format&fit=crop&w=400&q=80', brand: 'Corsair', code: 'RAM001', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'vga-1', category: 'VGA', name: 'ASUS ROG Strix GeForce RTX 4090 24GB', price: 59900000, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80', brand: 'ASUS', code: 'VGA001', warranty: '36 Tháng', stock: 'Còn hàng' },
  { id: 'vga-2', category: 'VGA', name: 'MSI GeForce RTX 4060 Ti Ventus 2X Black 8G OC', price: 10500000, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80', brand: 'MSI', code: 'VGA002', warranty: '36 Tháng', stock: 'Liên hệ' },
  { id: 'ssd-1', category: 'SSD', name: 'Samsung 990 PRO 2TB PCIe Gen 4.0 x4 NVMe', price: 4800000, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=400&q=80', brand: 'Samsung', code: 'SSD001', warranty: '60 Tháng', stock: 'Còn hàng' },
  { id: 'psu-1', category: 'Nguồn', name: 'Corsair RM1000e 1000W 80 Plus Gold - Fully Modular', price: 4500000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80', brand: 'Corsair', code: 'PSU001', warranty: '120 Tháng', stock: 'Còn hàng' },
  { id: 'case-1', category: 'Case', name: 'NZXT H9 Flow Matte White', price: 4200000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80', brand: 'NZXT', code: 'CASE001', warranty: '24 Tháng', stock: 'Còn hàng' },
  { id: 'cooler-1', category: 'Tản nhiệt', name: 'NZXT Kraken Elite 360 RGB White', price: 7500000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80', brand: 'NZXT', code: 'COOL001', warranty: '72 Tháng', stock: 'Còn hàng' }
];

const BUILD_SLOTS = [
  { id: 'CPU', label: 'Vi Xử Lý', icon: <Cpu size={24} /> },
  { id: 'Mainboard', label: 'Bo Mạch Chủ', icon: <Box size={24} /> },
  { id: 'RAM', label: 'RAM', icon: <Settings2 size={24} /> },
  { id: 'VGA', label: 'Card Màn Hình', icon: <Monitor size={24} /> },
  { id: 'SSD', label: 'Ổ cứng SSD/HDD', icon: <HardDrive size={24} /> },
  { id: 'Nguồn', label: 'Nguồn Máy Tính', icon: <Zap size={24} /> },
  { id: 'Case', label: 'Vỏ Máy Tính', icon: <Box size={24} /> },
  { id: 'Tản nhiệt', label: 'Tản Nhiệt', icon: <LucideFan size={24} /> }
];

export default function BuildPC() {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [activeModalSlot, setActiveModalSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Tùy chọn');

  // Calculate totals
  const totalCost = useMemo(() => {
    return Object.values(selectedComponents).reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [selectedComponents]);

  const componentsCount = Object.keys(selectedComponents).length;
  const isComplete = componentsCount === BUILD_SLOTS.length;

  const handleSelectComponent = (product) => {
    setSelectedComponents(prev => ({ ...prev, [activeModalSlot]: product }));
    setActiveModalSlot(null);
    setSearchQuery('');
  };

  const handleRemoveComponent = (slotId) => {
    const updated = { ...selectedComponents };
    delete updated[slotId];
    setSelectedComponents(updated);
  };

  // Filter products for modal
  const modalProducts = useMemo(() => {
    if (!activeModalSlot) return [];
    let products = BUILD_PC_PRODUCTS.filter(p => p.category === activeModalSlot);
    
    if (searchQuery) {
      products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (inStockOnly) {
      products = products.filter(p => p.stock === 'Còn hàng');
    }
    
    return products;
  }, [activeModalSlot, searchQuery, inStockOnly]);

  return (
    <div className="build-pc-page">
      <CyberBackground />
      
      <div className="container relative z-10" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        
        {/* Page Header */}
        <div className="build-pc-header">
          <h1 className="glitch-text text-4xl font-bold" data-text="BUILD PC TỰ CHỌN">BUILD PC TỰ CHỌN</h1>
          <p className="text-muted mt-2">Chọn từng linh kiện để tạo nên cỗ máy trong mơ của bạn</p>
        </div>

        <div className="build-pc-layout">
          {/* LEFT: COMPONENT SLOTS */}
          <div className="build-pc-slots-container">
            {BUILD_SLOTS.map((slot, index) => {
              const selectedItem = selectedComponents[slot.id];
              const isSelected = !!selectedItem;

              return (
                <motion.div 
                  key={slot.id}
                  className={`build-slot glass-panel ${isSelected ? 'has-item' : 'empty'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="build-slot-icon">
                    {slot.icon}
                  </div>
                  
                  <div className="build-slot-content">
                    <h3 className="build-slot-label">{slot.label}</h3>
                    {isSelected ? (
                      <div className="build-slot-item">
                        <p className="build-item-name">{selectedItem.name}</p>
                        <p className="build-item-price highlight">{selectedItem.price.toLocaleString()}đ</p>
                      </div>
                    ) : (
                      <p className="build-slot-placeholder">Vui lòng chọn linh kiện</p>
                    )}
                  </div>

                  <div className="build-slot-actions">
                    {isSelected ? (
                      <>
                        <button className="btn-icon" onClick={() => setActiveModalSlot(slot.id)} title="Đổi linh kiện">
                          <RefreshCw size={18} />
                        </button>
                        <button className="btn-icon danger" onClick={() => handleRemoveComponent(slot.id)} title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveModalSlot(slot.id)}
                      >
                        <Plus size={16} /> Chọn
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: SUMMARY (STICKY) */}
          <div className="build-pc-summary-container">
            <div className="build-pc-summary glass-panel sticky-panel">
              <h3 className="summary-title">TỔNG QUÁT CẤU HÌNH</h3>
              
              <div className="summary-stats">
                <div className="stat-row">
                  <span>Tiến độ lắp ráp:</span>
                  <span className={isComplete ? 'highlight' : ''}>{componentsCount} / {BUILD_SLOTS.length}</span>
                </div>
                
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(componentsCount / BUILD_SLOTS.length) * 100}%` }}
                  ></div>
                </div>

                {isComplete && (
                  <motion.div 
                    className="compatibility-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Check size={16} /> Tương thích 100%
                  </motion.div>
                )}
              </div>

              <div className="summary-total">
                <span>Tạm Tính:</span>
                <span className="total-price glitch-text" data-text={`${totalCost.toLocaleString()}đ`}>
                  {totalCost.toLocaleString()}đ
                </span>
              </div>

              <div className="summary-actions">
                <button 
                  className="btn btn-primary w-full"
                  disabled={componentsCount === 0}
                >
                  <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng
                </button>
                <button 
                  className="btn btn-outline w-full mt-3"
                  onClick={() => setSelectedComponents({})}
                  disabled={componentsCount === 0}
                >
                  <RefreshCw size={18} /> Làm Mới Cấu Hình
                </button>
              </div>

              <div className="summary-footer">
                * Giá có thể thay đổi tùy thuộc vào chi nhánh và chương trình khuyến mãi.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT SELECTION MODAL (REDESIGNED) */}
      <AnimatePresence>
        {activeModalSlot && (
          <motion.div 
            className="build-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setActiveModalSlot(null); setSearchQuery(''); }}
          >
            <motion.div 
              className="build-modal new-modal-design"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="new-modal-header">
                <h2 style={{ textTransform: 'uppercase' }}>CHỌN {activeModalSlot}</h2>
                
                <div className="new-modal-search">
                  <input 
                    type="text" 
                    placeholder="Bạn cần tìm linh kiện gì?"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <Search size={18} className="search-icon" style={{ color: 'var(--cyan)' }} />
                </div>
                
                <button className="btn-icon close-btn" style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', borderRadius: '8px', padding: '6px', marginLeft: '20px' }} onClick={() => { setActiveModalSlot(null); setSearchQuery(''); }}>
                  <X size={24} color="#ff4444" />
                </button>
              </div>

              {/* BODY: 2 Columns */}
              <div className="new-modal-body">
                {/* LEFT SIDEBAR FILTERS */}
                <div className="new-modal-sidebar">
                  <div className="filter-block">
                    <h3 className="filter-title">LỌC SẢN PHẨM THEO</h3>
                  </div>
                  
                  <div className="filter-group">
                    <h4 className="filter-group-title">HÃNG SẢN XUẤT</h4>
                    <div className="checkbox-list">
                      <label><input type="checkbox" /> AMD (27)</label>
                      <label><input type="checkbox" /> Intel (67)</label>
                      <label><input type="checkbox" /> Khác (1)</label>
                    </div>
                  </div>

                  {activeModalSlot === 'CPU' && (
                    <>
                      <div className="filter-group">
                        <h4 className="filter-group-title">DÒNG CPU</h4>
                        <div className="checkbox-list">
                          <label><input type="checkbox" /> AMD Ryzen 5 (7)</label>
                          <label><input type="checkbox" /> Intel Core Ultra 9 (1)</label>
                          <label><input type="checkbox" /> Intel Core Ultra 7 (5)</label>
                          <label><input type="checkbox" /> Intel Core Ultra 5 (6)</label>
                          <label><input type="checkbox" /> Intel Core i9 (8)</label>
                          <label><input type="checkbox" /> Intel Core i7 (15)</label>
                        </div>
                      </div>
                      <div className="filter-group">
                        <h4 className="filter-group-title">SOCKET</h4>
                        <div className="checkbox-list">
                          <label><input type="checkbox" /> LGA 1200 (5)</label>
                          <label><input type="checkbox" /> LGA 1700 (49)</label>
                          <label><input type="checkbox" /> AM5 (25)</label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="new-modal-main">
                  {/* Toolbar */}
                  <div className="new-modal-toolbar">
                    <div className="toolbar-left">
                      <span style={{ fontSize: '14px', marginRight: '10px' }}>Sắp xếp:</span>
                      <div style={{ width: '180px', marginRight: '20px' }}>
                        <CustomSelect 
                          value={sortBy}
                          onChange={(val) => setSortBy(val)}
                          options={[
                            {value: 'Tùy chọn', label: 'Tùy chọn'},
                            {value: 'Giá tăng dần', label: 'Giá tăng dần'},
                            {value: 'Giá giảm dần', label: 'Giá giảm dần'}
                          ]}
                        />
                      </div>
                      <label className="stock-filter" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}>
                        <input 
                          type="checkbox" 
                          checked={inStockOnly} 
                          onChange={(e) => setInStockOnly(e.target.checked)} 
                          style={{ cursor: 'pointer' }}
                        />
                        Còn hàng
                      </label>
                      <button className="btn-clear-filter">Xóa bộ lọc</button>
                    </div>
                    
                    <div className="toolbar-pagination">
                      <button className="page-btn active">1</button>
                      <button className="page-btn">2</button>
                      <button className="page-btn">3</button>
                      <button className="page-btn">4</button>
                      <button className="page-btn">5</button>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="new-modal-product-list">
                    {modalProducts.length > 0 ? (
                      modalProducts.map(product => (
                        <div key={product.id} className="list-product-card">
                          <div className="list-product-img">
                            <img src={product.image} alt={product.name} />
                          </div>
                          
                          <div className="list-product-info">
                            <h4 className="list-product-name">{product.name}</h4>
                            <div className="list-product-specs">
                              <p>Mã SP: <span style={{ color: 'var(--text)' }}>{product.code || 'N/A'}</span></p>
                              <p>Bảo hành: <span style={{ color: 'var(--text)' }}>{product.warranty || '36 Tháng'}</span></p>
                              <p>Kho hàng: <span style={{ color: product.stock === 'Còn hàng' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{product.stock || 'Còn hàng'}</span></p>
                            </div>
                            <div className="list-product-price">
                              {product.price.toLocaleString()} VNĐ
                            </div>
                          </div>
                          
                          <div className="list-product-actions">
                            <button 
                              className="btn btn-add-config"
                              onClick={() => handleSelectComponent(product)}
                            >
                              THÊM VÀO CẤU HÌNH <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="modal-empty" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
                        <p>Không tìm thấy linh kiện nào.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
