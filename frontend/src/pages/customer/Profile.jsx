import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Package, Clock, LogOut, Edit3, CheckCircle, Clock3, Truck, ShoppingCart, MapPin, Settings, Heart, Star, X, Image as ImageIcon } from 'lucide-react';
import AddressBook from '../../components/profile/AddressBook';
import ProductCard from '../../components/ui/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

export default function Profile() {
  const { user, token, isAuthenticated, logout, updateProfile, updateAvatar, fetchCurrentUser } = useAuth();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'account');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear state so refresh doesn't force tab
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '0988123456'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const handleOpenReview = (order) => {
    setReviewOrder(order);
    if (order.items && order.items.length > 0) {
      setSelectedReviewItem(order.items[0]);
    }
    setReviewRating(5);
    setReviewComment('');
    setReviewImages([]);
    setReviewError('');
    setShowReviewModal(true);
  };

  const handleReviewImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
          alert('Chỉ được phép chọn tối đa 5 ảnh!');
          return;
      }
      setReviewImages(files);
  };

  const handleSubmitReview = async () => {
    if (!token || !selectedReviewItem) return;
    if (!reviewComment.trim()) {
        setReviewError('Vui lòng nhập nội dung đánh giá');
        return;
    }
    setIsSubmittingReview(true);
    setReviewError('');
    try {
      const formData = new FormData();
      formData.append('sku_id', selectedReviewItem.sku_id);
      formData.append('rating', reviewRating);
      formData.append('comment', reviewComment);
      reviewImages.forEach(img => formData.append('images', img));

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Lỗi gửi đánh giá');
      
      setReviewSuccessMessage('Cảm ơn bạn đã đánh giá sản phẩm!');
      setShowReviewModal(false);
      setReviewedOrderIds(prev => [...prev, reviewOrder.id]);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Email OTP state
  const [emailToVerify, setEmailToVerify] = useState(user?.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    } else if (activeTab === 'recent') {
      try {
        const recentStr = localStorage.getItem('recently_viewed');
        if (recentStr) {
          setRecentProducts(JSON.parse(recentStr));
        }
      } catch (err) {
        console.error("Failed to load recent products", err);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || ''
      }));
    }
  }, [user]);

  // Protect route
  if (!isAuthenticated && !localStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <div className="container" style={{paddingTop: '20px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData.fullName);
      // In real app, you would also save phone and address
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      await updateAvatar(file);
      alert("Đổi ảnh đại diện thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi: " + err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
      case 'processing':
        return <span className="status-badge status-warning"><Clock3 size={14} /> Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="status-badge status-info"><CheckCircle size={14} /> Đã xác nhận</span>;
      case 'SHIPPING':
      case 'shipped':
        return <span className="status-badge status-info"><Truck size={14} /> Đang giao</span>;
      case 'DELIVERED':
      case 'delivered':
        return <span className="status-badge status-success"><CheckCircle size={14} /> Đã giao</span>;
      case 'CANCELLED':
        return <span className="status-badge status-danger"><CheckCircle size={14} /> Đã hủy</span>;
      default:
        return null;
    }
  };

  const handleSendEmailOtp = async () => {
    if (!emailToVerify) { setEmailError('Vui lòng nhập email'); return; }
    setEmailError('');
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/send-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: emailToVerify })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Không thể gửi OTP');
      setShowOtpInput(true);
      setEmailSuccess('Đã gửi mã OTP đến email của bạn');
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (otp.length < 6) return;
    setIsSendingOtp(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/verify-email-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email: emailToVerify, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Xác thực OTP thất bại');
      
      // Update local user state
      await fetchCurrentUser(token);
      setIsEditingEmail(false);
      setShowOtpInput(false);
      setEmailSuccess('Xác thực email thành công!');
      setTimeout(() => setEmailSuccess(''), 3000);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="profile-page-container fade-in">
      <div className="container">
        
        <div className="profile-header">
          <h1 className="glitch-text text-3xl font-bold" data-text="QUẢN LÝ TÀI KHOẢN">QUẢN LÝ TÀI KHOẢN</h1>
          <p className="text-muted">Trung tâm kiểm soát thông tin và lịch sử mua hàng của bạn.</p>
        </div>

        <div className="profile-layout">
          
          {/* Sidebar Menu */}
          <aside className="profile-sidebar glass">
            <div className="profile-user-summary">
              <div className="profile-avatar-wrapper">
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload" className={`profile-avatar ${isUploadingAvatar ? 'uploading' : ''}`}>
                  {isUploadingAvatar ? (
                    <div className="spinner-border text-cyan w-6 h-6 border-2 rounded-full border-t-transparent animate-spin"></div>
                  ) : user.avatar || user.picture ? (
                    <img src={user.avatar || user.picture} alt="Avatar" />
                  ) : (
                    <User size={40} className="text-cyan" />
                  )}
                  <div className="avatar-overlay">
                    <Edit3 size={18} />
                  </div>
                </label>
              </div>
              <div className="profile-info">
                <h3>{user.fullName || 'Người dùng EZ4GEAR'}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`profile-nav-btn ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <User size={18} /> Thông tin cá nhân
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={18} /> Đơn hàng của tôi
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin size={18} /> Sổ địa chỉ
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveTab('recent')}
              >
                <Clock size={18} /> Sản phẩm đã xem
              </button>
              <button 
                className={`profile-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart size={18} /> Sản phẩm yêu thích
              </button>
              {user?.role === 'ADMIN' && (
                <button 
                  className="profile-nav-btn text-cyan"
                  onClick={() => window.location.href = '/admin'}
                >
                  <Settings size={18} /> Trang Quản Trị
                </button>
              )}
              <button className="profile-nav-btn text-pink" onClick={handleLogout}>
                <LogOut size={18} /> Đăng xuất
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="profile-content glass">
            
            {/* Tab: ACCOUNT */}
            {activeTab === 'account' && (
              <div className="tab-pane fade-in">
                <div className="tab-header flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Thông Tin Cá Nhân</h2>
                  {!isEditing && (
                    <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={() => setIsEditing(true)}>
                      <Edit3 size={16} /> Chỉnh sửa
                    </button>
                  )}
                </div>

                {saveSuccess && (
                  <div className="alert-success mb-6 p-4 rounded-md bg-green-900/30 border border-green-500/50 text-green-400 flex items-center gap-2">
                    <CheckCircle size={18} /> Cập nhật thông tin thành công!
                  </div>
                )}

                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input 
                        type="text" 
                        className="profile-input" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span>Email xác thực</span>
                        {user.is_email_verified ? (
                          <span className="text-green-400 flex items-center gap-2 text-xs px-2 py-1 bg-green-500/20 rounded border border-green-500/30">
                            <CheckCircle size={12} /> Đã xác thực
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-2 text-xs px-2 py-1 bg-red-500/20 rounded border border-red-500/30">
                            <CheckCircle size={12} /> Chưa xác thực
                          </span>
                        )}
                      </label>
                      
                      {!isEditingEmail ? (
                        <div className="flex gap-4 items-center">
                          <input 
                            type="email" 
                            className="profile-input flex-1" 
                            value={user.email || 'Chưa cập nhật email'}
                            disabled 
                          />
                          {user.provider === 'LOCAL' && !user.is_email_verified && (
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditingEmail(true)}>
                              Xác thực / Đổi Email
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="email-verification-flow flex flex-col gap-4 p-4 mt-2 bg-black/20 border border-white/5 rounded-lg">
                          {emailError && <div className="text-red-400 text-sm">{emailError}</div>}
                          {emailSuccess && <div className="text-green-400 text-sm">{emailSuccess}</div>}
                          
                          <div className="flex gap-4">
                            <input 
                              type="email" 
                              className="profile-input flex-1" 
                              value={emailToVerify}
                              onChange={(e) => setEmailToVerify(e.target.value)}
                              placeholder="Nhập email cần xác thực"
                              disabled={showOtpInput}
                            />
                            {!showOtpInput && (
                              <button type="button" className="btn btn-primary btn-sm whitespace-nowrap" onClick={handleSendEmailOtp} disabled={isSendingOtp}>
                                {isSendingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                              </button>
                            )}
                          </div>

                          {showOtpInput && (
                            <div className="flex gap-4 items-center mt-2 p-4 bg-black/30 rounded border border-cyan-500/30">
                              <input 
                                type="text" 
                                className="profile-input" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="Nhập 6 chữ số OTP"
                                maxLength={6}
                                style={{ width: '150px', letterSpacing: '4px', textAlign: 'center' }}
                              />
                              <button type="button" className="btn btn-primary btn-sm" onClick={handleVerifyEmailOtp} disabled={isSendingOtp || otp.length < 6}>
                                {isSendingOtp ? 'Đang xử lý...' : 'Xác Nhận'}
                              </button>
                              <button type="button" className="text-gray-400 text-sm hover:text-white" onClick={() => { setShowOtpInput(false); setOtp(''); }}>
                                Hủy
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {user.provider !== 'LOCAL' && (
                        <p className="text-xs text-gray-500 mt-2">Tài khoản liên kết mạng xã hội không thể đổi email.</p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="profile-input" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-actions" style={{ marginTop: '32px', display: 'flex', gap: '24px' }}>
                      <button type="submit" className="btn btn-primary shadow-glow">
                        Lưu Thay Đổi
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => {
                        setIsEditing(false);
                        // Reset form data if canceled
                        setFormData({
                          fullName: user.fullName || '',
                          phone: user.phone || '0988123456'
                        });
                      }}>
                        Hủy
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Tab: ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <AddressBook />
            )}

            {/* Tab: ORDERS */}
            {activeTab === 'orders' && (
              <div className="tab-pane fade-in">
                <h2 className="text-xl font-bold mb-6">Đơn Hàng Của Tôi</h2>
                
                {loadingOrders ? (
                  <div className="flex justify-center p-8"><span className="text-gray-400">Đang tải...</span></div>
                ) : orders.length === 0 ? (
                  <div className="text-center p-8 border border-white/10 rounded-xl bg-white/5">
                    <Package size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Bạn chưa có đơn hàng nào.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order, idx) => (
                      <div key={idx} className="order-card">
                        <div className="order-card-header">
                          <div>
                            <div className="order-id text-lg font-bold">Mã đơn: {order.id.split('-')[0].toUpperCase()}</div>
                            <div className="text-sm mt-1 flex gap-2" style={{ color: 'var(--text-muted)' }}>
                              <span>Phương thức: <span style={{ color: 'var(--text)', fontWeight: '500' }}>{order.payment_method}</span></span>
                              <span>|</span>
                              <span>Mã GD: {order.payment_transaction_id ? <span className="font-mono" style={{ color: 'var(--cyan)' }}>{order.payment_transaction_id}</span> : <span style={{ opacity: 0.7 }}>Chưa có</span>}</span>
                            </div>
                          </div>
                          {renderStatusBadge(order.status)}
                        </div>
                        <div className="order-card-body">
                          <div className="order-detail-item">
                            <span className="label">Ngày đặt:</span>
                            <span className="value" style={{ color: 'var(--text)' }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="order-detail-item">
                            <span className="label">Số sản phẩm:</span>
                            <span className="value" style={{ color: 'var(--text)' }}>{order.items ? order.items.length : 0}</span>
                          </div>
                          <div className="order-detail-item">
                            <span className="label">Tổng tiền:</span>
                            <span className="value font-mono font-bold" style={{ color: 'var(--cyan)' }}>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                            </span>
                          </div>
                        </div>
                        <div className="order-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            {order.status === 'DELIVERED' && !reviewedOrderIds.includes(order.id) && (
                              <button className="btn btn-primary btn-sm" onClick={() => handleOpenReview(order)}>Đánh giá</button>
                            )}
                          </div>
                          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/profile/orders/${order.id}`)}>Xem Chi Tiết</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: RECENTLY VIEWED */}
            {activeTab === 'recent' && (
              <div className="tab-pane fade-in">
                <h2 className="text-xl font-bold mb-6">Sản Phẩm Vừa Xem</h2>
                
                {recentProducts.length === 0 ? (
                  <div className="text-center p-8 border border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-400">Bạn chưa xem sản phẩm nào.</p>
                  </div>
                ) : (
                  <div className="recent-products-grid">
                    {recentProducts.map(product => (
                      <div key={product.id} className="recent-product-card cursor-pointer transition-transform hover:-translate-y-1" onClick={() => navigate(`/products/${product.slug}`)}>
                        <div className="recent-img-wrapper">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>No img</span>
                            </div>
                          )}
                          <div className="recent-actions">
                            <button className="icon-btn tooltip-trigger" aria-label="Add to cart" onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.slug}`); }}>
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="recent-info">
                          <h4 style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h4>
                          <div className="price text-cyan font-mono">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="tab-pane fade-in">
                <h2 className="text-xl font-bold mb-6">Sản Phẩm Yêu Thích</h2>
                
                {wishlistLoading ? (
                  <div className="text-center p-8">Đang tải danh sách...</div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center p-8 border border-white/10 rounded-xl bg-white/5">
                    <p className="text-gray-400">Bạn chưa có sản phẩm yêu thích nào.</p>
                  </div>
                ) : (
                  <div className="products-grid-container grid-view" style={{ gap: '16px' }}>
                    {wishlistItems.map((item, index) => {
                      const product = item.sku?.product;
                      if (!product) return null;
                      
                      const formattedProduct = {
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: item.sku?.promotional_price || item.sku?.price || 0,
                        originalPrice: item.sku?.promotional_price ? item.sku?.price : null,
                        image: product.images?.[0]?.url || '',
                        badge: item.sku?.promotional_price ? 'HOT' : null,
                        sku_id: item.sku_id
                      };
                      return (
                        <ProductCard key={item.id} product={formattedProduct} index={index} />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && reviewOrder && selectedReviewItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--card-bg, #fff)', color: 'var(--text)', width: '90%', maxWidth: '600px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Đánh giá sản phẩm</h3>
              <button onClick={() => setShowReviewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {/* Item selection if multiple */}
              {reviewOrder.items && reviewOrder.items.length > 1 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Chọn sản phẩm để đánh giá:</label>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {reviewOrder.items.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedReviewItem(item)}
                        style={{ 
                          padding: '10px', borderRadius: '8px', cursor: 'pointer', minWidth: '150px',
                          border: selectedReviewItem.id === item.id ? '1px solid #38bdf8' : '1px solid var(--border)',
                          background: selectedReviewItem.id === item.id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                          display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                      >
                        {item.image_url ? <img src={item.image_url} alt={item.product_name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : <div style={{ width: '40px', height: '40px', background: 'var(--border)', borderRadius: '4px' }}></div>}
                        <div style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product_name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: 'var(--bg, rgba(0,0,0,0.02))', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {selectedReviewItem.image_url ? <img src={selectedReviewItem.image_url} alt={selectedReviewItem.product_name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} /> : <div style={{ width: '60px', height: '60px', background: 'var(--border)', borderRadius: '8px' }}></div>}
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{selectedReviewItem.product_name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Phân loại: {selectedReviewItem.sku_code}</div>
                </div>
              </div>
              
              {reviewError && <div style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px', padding: '10px 14px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{reviewError}</div>}
              
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                 <label style={{ display: 'block', marginBottom: '10px', fontSize: '15px', fontWeight: 'bold' }}>Chất lượng sản phẩm</label>
                 <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                       <Star 
                          key={s} 
                          size={40} 
                          style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                          fill={s <= reviewRating ? '#38bdf8' : 'none'} 
                          stroke={s <= reviewRating ? '#38bdf8' : 'var(--text-dim)'}
                          onClick={() => setReviewRating(s)}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                       />
                    ))}
                 </div>
                 <div style={{ marginTop: '8px', fontSize: '14px', color: '#38bdf8', fontWeight: 'bold' }}>
                   {reviewRating === 1 ? 'Tệ' : reviewRating === 2 ? 'Không hài lòng' : reviewRating === 3 ? 'Bình thường' : reviewRating === 4 ? 'Hài lòng' : 'Tuyệt vời'}
                 </div>
              </div>

              <div style={{ marginBottom: '20px', background: 'var(--bg, rgba(0,0,0,0.02))', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <textarea 
                    className="checkout-input"
                    rows="4" 
                    placeholder="Hãy chia sẻ nhận xét cho sản phẩm này nhé..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    style={{ width: '100%', resize: 'vertical', minHeight: '100px', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)' }}
                 ></textarea>
                 
                 <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                   <label style={{ 
                     display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                     background: 'var(--bg)', border: '1px dashed var(--border)', 
                     borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text)', 
                     fontWeight: '500', transition: 'all 0.2s ease'
                   }}
                     onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'; e.currentTarget.style.color = '#38bdf8'; }}
                     onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
                   >
                     <ImageIcon size={16} /> Thêm hình ảnh
                     <input type="file" multiple accept="image/*" onChange={handleReviewImageChange} style={{ display: 'none' }} />
                   </label>
                   {reviewImages.length > 0 && (
                       <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                           {reviewImages.map((img, i) => (
                               <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                                 <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                                 <button 
                                   onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                   style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                 >
                                   <X size={10} />
                                 </button>
                               </div>
                           ))}
                       </div>
                   )}
                 </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setShowReviewModal(false)}>Trở lại</button>
              <button 
                 className="btn btn-primary" 
                 onClick={handleSubmitReview}
                 disabled={isSubmittingReview}
                 style={{ minWidth: '120px' }}
              >
                 {isSubmittingReview ? 'Đang gửi...' : 'Hoàn Thành'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Popup */}
      {reviewSuccessMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--card-bg, #fff)', color: 'var(--text)', padding: '36px 48px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transform: 'translateY(0)', opacity: 1 }}>
             <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', border: '2px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <CheckCircle size={36} />
             </div>
             <div style={{ textAlign: 'center' }}>
               <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 'bold' }}>Đánh giá thành công!</h3>
               <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>{reviewSuccessMessage}</p>
             </div>
             <button className="btn btn-primary" onClick={() => setReviewSuccessMessage('')} style={{ marginTop: '12px', padding: '12px 40px', borderRadius: '100px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ĐÓNG</button>
          </div>
        </div>
      )}
    </div>
  );
}
