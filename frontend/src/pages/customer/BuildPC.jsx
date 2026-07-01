import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Box, HardDrive, Zap,
  Monitor, Search, X, Plus,
  Check, Trash2, RefreshCw, ShoppingCart,
  Settings2, LucideFan, ChevronRight, Sparkles, Loader2, Bot
} from 'lucide-react';
import CyberBackground from '../../components/ui/CyberBackground';
import CustomSelect from '../../components/ui/CustomSelect';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

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
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // AI Advisor state
  const [aiBudget, setAiBudget] = useState(15000000);
  const [aiPurpose, setAiPurpose] = useState('Gaming');
  const [aiGameType, setAiGameType] = useState('FPS');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiError, setAiError] = useState('');

  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products?limit=1000`)
      .then(res => res.json().then(d => d.data || d))
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand?.name || 'Unknown',
          rawCategory: item.category?.name || '',
          price: item.skus?.[0]?.price || 0,
          image: item.images?.[0]?.url || '',
          code: item.skus?.[0]?.sku_code || 'N/A',
          warranty: item.specifications?.['Bảo hành'] || '36 Tháng',
          stock: (item.skus ? item.skus.reduce((sum, sku) => sum + (sku.stock_quantity || 0), 0) : 0) > 0 ? 'Còn hàng' : 'Hết hàng',
          skus: item.skus || []
        }));
        setProductsList(mapped);
      })
      .catch(err => console.error(err));
  }, []);

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
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  const handleOpenModal = (slotId) => {
    setActiveModalSlot(slotId);
    setSearchQuery('');
    setSelectedBrands([]);
    setCurrentPage(1);
    setSortBy('Tùy chọn');
    setInStockOnly(false);
  };

  const handleCloseModal = () => {
    setActiveModalSlot(null);
    setSearchQuery('');
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  const handleRemoveComponent = (slotId) => {
    const updated = { ...selectedComponents };
    delete updated[slotId];
    setSelectedComponents(updated);
  };

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = () => {
    let addedCount = 0;
    let missingCount = 0;
    Object.values(selectedComponents).forEach(product => {
      if (product && product.skus && product.skus.length > 0) {
        addToCart(product.skus[0].id, 1, true);
        addedCount++;
      } else if (product) {
        missingCount++;
      }
    });

    if (addedCount > 0) addToast(`Đã thêm ${addedCount} linh kiện vào giỏ hàng thành công!`, 'success');
    if (missingCount > 0) addToast(`Lỗi: ${missingCount} linh kiện không có mã SKU để thanh toán.`, 'error');
  };

  // Gọi AI Advisor API
  const handleAiAdvisor = async () => {
    setAiLoading(true);
    setAiSuggestion(null);
    setAiError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/build-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: aiBudget, purpose: aiPurpose, game_type: aiGameType })
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiSuggestion(data);
      }
    } catch (e) {
      setAiError('Không thể kết nối đến AI. Vui lòng thử lại!');
    } finally {
      setAiLoading(false);
    }
  };

  // Áp dụng gợi ý AI vào các slot
  const handleApplySuggestion = () => {
    if (!aiSuggestion) return;
    const slots = ['CPU', 'Mainboard', 'RAM', 'VGA', 'SSD', 'Nguồn', 'Case', 'Tản nhiệt'];
    const newComponents = { ...selectedComponents };
    let applied = 0;
    slots.forEach(slot => {
      const suggested = aiSuggestion[slot];
      if (suggested && suggested.name) {
        // Tìm sản phẩm thật trong productsList theo tên
        const found = productsList.find(p =>
          p.name.toLowerCase().includes(suggested.name.toLowerCase().slice(0, 20)) ||
          suggested.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 20))
        );
        if (found) {
          newComponents[slot] = found;
          applied++;
        }
      }
    });
    setSelectedComponents(newComponents);
    addToast(`Đã áp dụng ${applied} gợi ý AI vào cấu hình!`, 'success');
  };

  // Keywords theo từng slot — chỉ dùng tên sản phẩm, không phụ thuộc vào category DB
  const SLOT_KEYWORDS = {
    'CPU':       ['cpu', 'core i', 'core ultra', 'ryzen', 'intel core', 'amd ryzen'],
    'Mainboard': ['mainboard', 'bo mạch', 'z790', 'z690', 'z590', 'b760', 'b660', 'h610', 'x670', 'b650', 'b550', 'h570'],
    'RAM':       ['ram', 'ddr4', 'ddr5', 'dimm'],
    'VGA':       ['rtx', 'gtx', 'radeon', 'rx 7', 'rx 6', 'rx 5', 'rx 4', 'arc a', 'geforce'],
    'SSD':       ['ssd', 'nvme', 'm.2', 'hdd', 'ổ cứng', 'kingston', 'samsung 9', 'wd black', 'seagate'],
    'Nguồn':   ['nguồn', 'psu', 'power supply', 'rm', 'cx', 'tx', 'hx', 'corsair rm', 'cooler master mwe', 'seasonic'],
    'Case':      ['case', 'vỏ máy', 'lian li', 'nzxt h', 'corsair 4', '5000d', 'fractal', 'phanteks'],
    'Tản nhiệt': ['tản nhiệt', 'cooler', 'kraken', 'nh-d', 'aio', 'liquid', 'noctua', 'be quiet', 'dark rock'],
  };

  // Lấy danh sách brand thực tế từ products đang hiển thị
  const modalBrands = useMemo(() => {
    if (!activeModalSlot) return [];
    const keywords = SLOT_KEYWORDS[activeModalSlot] || [];
    const filtered = productsList.filter(p => {
      const text = p.name.toLowerCase();
      return keywords.some(kw => text.includes(kw.toLowerCase()));
    });
    const brands = [...new Set(filtered.map(p => p.brand).filter(Boolean))].sort();
    return brands;
  }, [activeModalSlot, productsList]);

  // Toggle brand filter
  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  // Filter products for modal — dùng keyword matching trên tên sản phẩm
  const allFilteredProducts = useMemo(() => {
    if (!activeModalSlot) return [];
    const keywords = SLOT_KEYWORDS[activeModalSlot] || [];

    let products = productsList.filter(p => {
      const text = p.name.toLowerCase();
      // Match nếu tên sản phẩm chứa ít nhất 1 keyword của slot
      return keywords.some(kw => text.includes(kw.toLowerCase()));
    });

    // Lọc theo brand
    if (selectedBrands.length > 0) {
      products = products.filter(p => selectedBrands.includes(p.brand));
    }

    // Lọc theo search query
    if (searchQuery.trim()) {
      const kws = searchQuery.toLowerCase().trim().split(/\s+/);
      products = products.filter(p => {
        const text = (p.name + ' ' + p.brand).toLowerCase();
        return kws.every(kw => text.includes(kw));
      });
    }

    // Lọc theo tồn kho
    if (inStockOnly) {
      products = products.filter(p => p.stock === 'Còn hàng');
    }

    // Sắp xếp
    const result = [...products];
    if (sortBy === 'Giá tăng dần') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Giá giảm dần') result.sort((a, b) => b.price - a.price);

    return result;
  }, [activeModalSlot, searchQuery, inStockOnly, productsList, sortBy, selectedBrands]);

  // Phân trang
  const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
  const modalProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allFilteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [allFilteredProducts, currentPage]);

  return (
    <div className="build-pc-page">
      <CyberBackground />

      <div className="container relative z-10" style={{ paddingTop: '20px', paddingBottom: '60px' }}>

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
                      <div className="build-slot-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {selectedItem.image && (
                          <img src={selectedItem.image} alt={selectedItem.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}
                          />
                        )}
                        <div>
                          <p className="build-item-name">{selectedItem.name}</p>
                          <p className="build-item-price highlight">{selectedItem.price.toLocaleString()}đ</p>
                        </div>
                      </div>
                    ) : (
                      <p className="build-slot-placeholder">Vui lòng chọn linh kiện</p>
                    )}
                  </div>

                  <div className="build-slot-actions">
                    {isSelected ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenModal(slot.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)',
                            color: 'var(--cyan)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                        >
                          <RefreshCw size={13} /> Thay đổi
                        </button>
                        <button
                          onClick={() => handleRemoveComponent(slot.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                            color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(slot.id)}
                      >
                        <Plus size={16} /> Chọn
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: SUMMARY + AI ADVISOR (STICKY CONTAINER) */}
          <div className="build-pc-summary-container sticky-panel">
            <div className="build-pc-summary glass-panel">
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

              <div className="summary-actions" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <button
                  className="btn btn-primary w-full"
                  disabled={componentsCount === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng
                </button>
                <button
                  className="btn btn-outline w-full"
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

            {/* ===== AI ADVISOR PANEL ===== */}
            <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#a855f7' }}>AI PC ADVISOR</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Gợi ý cấu hình theo ngân sách</p>
                </div>
              </div>

              {/* Budget Input */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  💰 Ngân sách: <strong style={{ color: '#a855f7' }}>{aiBudget.toLocaleString()}đ</strong>
                </label>
                <input
                  type="range"
                  min={5000000} max={80000000} step={1000000}
                  value={aiBudget}
                  onChange={e => setAiBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>5 triệu</span><span>80 triệu</span>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>🎯 Mục đích</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['Gaming', 'Đồ hoạ', 'Văn phòng', 'Streaming'].map(p => (
                    <button
                      key={p}
                      onClick={() => setAiPurpose(p)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', border: '1px solid',
                        borderColor: aiPurpose === p ? '#a855f7' : 'var(--border)',
                        background: aiPurpose === p ? 'rgba(168,85,247,0.2)' : 'transparent',
                        color: aiPurpose === p ? '#a855f7' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                      }}
                    >{p}</button>
                  ))}
                </div>
              </div>

              {/* Game Type (chỉ hiện khi Gaming) */}
              {aiPurpose === 'Gaming' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>🎮 Thể loại game</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['FPS', 'MOBA', 'AAA', 'Esports'].map(g => (
                      <button
                        key={g}
                        onClick={() => setAiGameType(g)}
                        style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', border: '1px solid',
                          borderColor: aiGameType === g ? '#0ea5e9' : 'var(--border)',
                          background: aiGameType === g ? 'rgba(14,165,233,0.2)' : 'transparent',
                          color: aiGameType === g ? '#0ea5e9' : 'var(--text-muted)',
                          transition: 'all 0.2s'
                        }}
                      >{g}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={handleAiAdvisor}
                disabled={aiLoading}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px', border: 'none', cursor: aiLoading ? 'wait' : 'pointer',
                  background: aiLoading ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white', fontWeight: '700', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', boxShadow: aiLoading ? 'none' : '0 4px 15px rgba(168,85,247,0.4)'
                }}
              >
                {aiLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                {aiLoading ? 'AI đang phân tích...' : '✨ Để AI gợi ý cho tôi'}
              </button>

              {/* Error */}
              {aiError && (
                <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444' }}>
                  {aiError}
                </div>
              )}

              {/* AI Suggestion Result */}
              {aiSuggestion && !aiError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '16px' }}
                >
                  {/* AI Note */}
                  {aiSuggestion.ai_note && (
                    <div style={{
                      padding: '10px 12px', borderRadius: '8px', marginBottom: '12px',
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))',
                      border: '1px solid rgba(168,85,247,0.3)', fontSize: '12px', color: 'var(--text)', lineHeight: '1.5'
                    }}>
                      🤖 {aiSuggestion.ai_note}
                    </div>
                  )}

                  {/* Danh sách gợi ý */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                    {['CPU', 'Mainboard', 'RAM', 'VGA', 'SSD', 'Nguồn', 'Case', 'Tản nhiệt'].map(slot => {
                      const item = aiSuggestion[slot];
                      if (!item) return null;
                      const name = typeof item === 'object' ? item.name : item;
                      const price = typeof item === 'object' ? item.price : 0;
                      return (
                        <div key={slot} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border)'
                        }}>
                          <div>
                            <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: '700', textTransform: 'uppercase' }}>{slot}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text)', lineHeight: '1.3', marginTop: '2px' }}>{name || 'Không có'}</div>
                          </div>
                          {price > 0 && (
                            <div style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                              {price.toLocaleString()}đ
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={handleApplySuggestion}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #a855f7',
                      background: 'rgba(168,85,247,0.15)', color: '#a855f7', fontWeight: '700',
                      fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.15)'}
                  >
                    <Check size={14} /> Áp dụng gợi ý vào build
                  </button>
                </motion.div>
              )}
            </div>
            {/* ===== END AI ADVISOR PANEL ===== */}
          </div>
        </div>
      </div>

      {/* COMPONENT SELECTION MODAL */}
      <AnimatePresence>
        {activeModalSlot && (
          <motion.div
            className="build-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="build-modal new-modal-design"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="new-modal-header">
                <h2 style={{ textTransform: 'uppercase' }}>CHỌN {activeModalSlot}</h2>
                <div className="new-modal-search">
                  <input
                    type="text" placeholder="Tìm kiếm linh kiện..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    autoFocus
                  />
                  <Search size={18} className="search-icon" style={{ color: 'var(--cyan)' }} />
                </div>
                <button
                  style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid #ff4444', borderRadius: '8px', padding: '6px', marginLeft: '20px', cursor: 'pointer' }}
                  onClick={handleCloseModal}
                >
                  <X size={24} color="#ff4444" />
                </button>
              </div>

              {/* BODY */}
              <div className="new-modal-body">
                {/* SIDEBAR FILTERS */}
                <div className="new-modal-sidebar">
                  <h3 className="filter-title">LỌC SẢN PHẨM</h3>

                  {/* Brand filter — dynamic từ dữ liệu thật */}
                  <div className="filter-group">
                    <h4 className="filter-group-title">HÃNG SẢN XUẤT</h4>
                    <div className="checkbox-list">
                      {modalBrands.length > 0 ? modalBrands.map(brand => (
                        <label key={brand} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            style={{ cursor: 'pointer' }}
                          />
                          {brand}
                        </label>
                      )) : <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đang tải...</p>}
                    </div>
                  </div>

                  {/* Còn hàng filter */}
                  <div className="filter-group">
                    <h4 className="filter-group-title">TÌNH TRẠNG</h4>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={e => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
                        style={{ cursor: 'pointer' }}
                      />
                      Còn hàng
                    </label>
                  </div>

                  {/* Xóa bộ lọc */}
                  {(selectedBrands.length > 0 || inStockOnly || searchQuery) && (
                    <button
                      onClick={() => { setSelectedBrands([]); setInStockOnly(false); setSearchQuery(''); setCurrentPage(1); }}
                      style={{
                        width: '100%', marginTop: '12px', padding: '8px', borderRadius: '8px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                        color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: '600'
                      }}
                    >
                      ✕ Xóa bộ lọc
                    </button>
                  )}
                </div>

                {/* MAIN CONTENT */}
                <div className="new-modal-main">
                  {/* Toolbar */}
                  <div className="new-modal-toolbar">
                    <div className="toolbar-left">
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {allFilteredProducts.length} sản phẩm
                      </span>
                      <div style={{ width: '160px', marginLeft: '12px' }}>
                        <CustomSelect
                          value={sortBy}
                          onChange={val => { setSortBy(val); setCurrentPage(1); }}
                          options={[
                            { value: 'Tùy chọn', label: 'Mặc định' },
                            { value: 'Giá tăng dần', label: 'Giá tăng dần' },
                            { value: 'Giá giảm dần', label: 'Giá giảm dần' }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Real Pagination */}
                    {totalPages > 1 && (
                      <div className="toolbar-pagination">
                        <button
                          className="page-btn"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                        >‹</button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                          const page = start + i;
                          return page <= totalPages ? (
                            <button
                              key={page}
                              className={`page-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                            >{page}</button>
                          ) : null;
                        })}
                        <button
                          className="page-btn"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
                        >›</button>
                      </div>
                    )}
                  </div>

                  {/* Product List */}
                  <div className="new-modal-product-list">
                    {modalProducts.length > 0 ? (
                      modalProducts.map(product => (
                        <div key={product.id} className="list-product-card">
                          <div className="list-product-img">
                            <img src={product.image} alt={product.name} loading="lazy" />
                          </div>
                          <div className="list-product-info">
                            <h4 className="list-product-name">{product.name}</h4>
                            <div className="list-product-specs">
                              <p>Hãng: <span style={{ color: 'var(--cyan)' }}>{product.brand}</span></p>
                              <p>Mã SP: <span style={{ color: 'var(--text)' }}>{product.code || 'N/A'}</span></p>
                              <p>Kho: <span style={{ color: product.stock === 'Còn hàng' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{product.stock}</span></p>
                            </div>
                            <div className="list-product-price">{product.price.toLocaleString()} VNĐ</div>
                          </div>
                          <div className="list-product-actions">
                            <button className="btn btn-add-config" onClick={() => handleSelectComponent(product)}>
                              THÊM VÀO CẤU HÌNH <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                          {productsList.length === 0 ? 'Đang tải sản phẩm...' : 'Không tìm thấy linh kiện phù hợp.'}
                        </p>
                        {(selectedBrands.length > 0 || inStockOnly || searchQuery) && (
                          <button
                            onClick={() => { setSelectedBrands([]); setInStockOnly(false); setSearchQuery(''); }}
                            style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '8px', background: 'var(--cyan)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                          >
                            Xóa bộ lọc
                          </button>
                        )}
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
