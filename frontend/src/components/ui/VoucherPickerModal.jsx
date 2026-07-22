import React, { useState, useEffect } from 'react';
import { X, Ticket, Truck, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VoucherPickerModal({ isOpen, onClose, onApply, subtotal }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualCode, setManualCode] = useState('');
  
  const [selectedProductPromo, setSelectedProductPromo] = useState(null);
  const [selectedShippingPromo, setSelectedShippingPromo] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchVouchers();
    }
  }, [isOpen]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/promotions/available`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setVouchers(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách voucher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyManual = async () => {
    if (!manualCode.trim()) return;
    const code = manualCode.trim().toUpperCase();
    
    let found = vouchers.find(v => v.code === code);
    
    if (!found) {
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/promotions/code/${code}`, { headers });
        if (res.ok) {
          found = await res.json();
          // Thêm vào danh sách hiển thị
          setVouchers(prev => [found, ...prev]);
        } else {
          const data = await res.json();
          window.toast.error(data.detail || 'Mã giảm giá không tồn tại, hết hạn hoặc bạn đã hết lượt sử dụng.');
          return;
        }
      } catch (error) {
        console.error('Lỗi kiểm tra mã:', error);
        window.toast.error('Lỗi khi kiểm tra mã giảm giá.');
        return;
      }
    }
    
    if (found) {
      if (found.min_order_value && subtotal < found.min_order_value) {
        window.toast.error(`Đơn hàng chưa đạt tối thiểu ${new Intl.NumberFormat('vi-VN').format(found.min_order_value)}đ để dùng mã này.`);
        return;
      }
      
      if (found.type === 'shipping') {
        setSelectedShippingPromo(found);
      } else {
        setSelectedProductPromo(found);
      }
      setManualCode('');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getDiscountText = (v) => {
    if (v.discount_percent) {
      let text = `Giảm ${v.discount_percent}%`;
      if (v.max_discount_amount) {
        text += ` tối đa ${formatPrice(v.max_discount_amount)}`;
      }
      return text;
    }
    return `Giảm ${formatPrice(v.discount_amount)}`;
  };

  const handleSubmit = () => {
    onApply({
      productPromo: selectedProductPromo,
      shippingPromo: selectedShippingPromo
    });
    onClose();
  };

  if (!isOpen) return null;

  const shippingVouchers = vouchers.filter(v => v.type === 'shipping');
  const productVouchers = vouchers.filter(v => v.type === 'product');

  const renderVoucherCard = (v, isSelected, onSelect) => {
    const isEligible = subtotal >= (v.min_order_value || 0);
    const cardClass = `voucher-card ${isSelected ? 'is-selected' : ''} ${!isEligible ? 'is-disabled' : ''}`;
    const codeClass = `voucher-card-code type-${v.type}`;
    
    return (
      <div key={v.id} className={cardClass} onClick={() => isEligible && onSelect(v)}>
        <div className="voucher-card-left">
          <div>
            <span className={codeClass}>{v.code}</span>
            <span className="voucher-card-title">{getDiscountText(v)}</span>
          </div>
          <div className="voucher-card-desc">
            {v.min_order_value ? `Đơn tối thiểu ${formatPrice(v.min_order_value)}` : 'Không yêu cầu đơn tối thiểu'}
          </div>
          <div className="voucher-card-meta">
             {v.usage_limit && (
               <div className="voucher-progress-container">
                 <div className="voucher-progress-bar">
                   <div className="voucher-progress-fill" style={{ width: `${((v.usage_limit - v.usage_count) / v.usage_limit) * 100}%` }}></div>
                   <span className="voucher-progress-text">
                     Còn {v.usage_limit - v.usage_count}
                   </span>
                 </div>
               </div>
             )}
             <span style={{ marginLeft: v.usage_limit ? '0' : 'auto' }}>
               {v.expiration_date ? `HSD: ${new Date(v.expiration_date).toLocaleDateString('vi-VN')}` : 'Không giới hạn'}
             </span>
          </div>
        </div>
        <div className="voucher-card-right">
           {!isEligible ? (
             <div className="voucher-status-icon disabled">
               <AlertCircle size={24} />
               <span>Chưa đủ điều kiện</span>
             </div>
           ) : isSelected ? (
             <div className="voucher-status-icon selected">
               <Check size={24} />
             </div>
           ) : (
             <span className="voucher-status-text">Áp dụng</span>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="voucher-modal-overlay">
      <div className="voucher-modal-container">
        
        {/* Header */}
        <div className="voucher-modal-header">
          <h2>
            <Ticket size={28} /> Chọn Mã Giảm Giá
          </h2>
          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        {/* Manual Input */}
        <div className="voucher-modal-input-section">
          <input 
            type="text" 
            placeholder="Nhập mã voucher..." 
            value={manualCode}
            onChange={e => setManualCode(e.target.value.toUpperCase())}
          />
          <button 
            onClick={handleApplyManual}
            disabled={!manualCode.trim()}
            className="btn btn-primary"
            style={{ padding: '0 24px' }}
          >
            ÁP DỤNG
          </button>
        </div>

        {/* Scrollable List */}
        <div className="voucher-modal-body">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid var(--cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : (
            <>
              {shippingVouchers.length > 0 && (
                <div>
                  <h3 className="voucher-group-title">
                    <Truck size={20} /> Mã Vận Chuyển
                  </h3>
                  <div>
                    {shippingVouchers.map(v => renderVoucherCard(v, selectedShippingPromo?.id === v.id, (selected) => {
                      if (selectedShippingPromo?.id === selected.id) {
                        setSelectedShippingPromo(null);
                      } else {
                        setSelectedShippingPromo(selected);
                      }
                    }))}
                  </div>
                </div>
              )}

              {productVouchers.length > 0 && (
                <div>
                  <h3 className="voucher-group-title">
                    <Ticket size={20} /> Mã Sản Phẩm
                  </h3>
                  <div>
                    {productVouchers.map(v => renderVoucherCard(v, selectedProductPromo?.id === v.id, (selected) => {
                      if (selectedProductPromo?.id === selected.id) {
                        setSelectedProductPromo(null);
                      } else {
                        setSelectedProductPromo(selected);
                      }
                    }))}
                  </div>
                </div>
              )}

              {vouchers.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '1.1rem' }}>
                  Không có mã giảm giá nào khả dụng lúc này.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="voucher-modal-footer">
          <div className="voucher-modal-summary">
            <span>Đã chọn:</span>
            <span>
              {[selectedProductPromo, selectedShippingPromo].filter(Boolean).length} mã
            </span>
          </div>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}
          >
            ĐỒNG Ý VÀ ÁP DỤNG
          </button>
        </div>

      </div>
    </div>
  );
}

