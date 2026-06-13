import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, Clock, LogOut, Edit3, CheckCircle, Clock3, Truck, ShoppingCart, MapPin } from 'lucide-react';
import AddressBook from '../components/profile/AddressBook';

const mockOrders = [
  {
    id: '#EZ4-9988',
    date: '10/06/2026',
    total: 58200000,
    status: 'processing', // processing, shipped, delivered
    items: 3
  },
  {
    id: '#EZ4-8821',
    date: '02/06/2026',
    total: 3200000,
    status: 'delivered',
    items: 1
  }
];

const mockRecentProducts = [
  {
    id: 1,
    name: 'VGA ASUS ROG Strix GeForce RTX 4090 OC Edition',
    price: 55000000,
    image: 'https://via.placeholder.com/200/1a1a2e/00d2ff?text=RTX+4090',
  },
  {
    id: 2,
    name: 'Bàn phím cơ Razer Huntsman V2 Analog',
    price: 4500000,
    image: 'https://via.placeholder.com/200/1a1a2e/7000ff?text=Huntsman',
  }
];

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '0988123456', // Mock phone
    address: '123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM' // Mock address
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;
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
      case 'processing':
        return <span className="status-badge status-warning"><Clock3 size={14} /> Đang xử lý</span>;
      case 'shipped':
        return <span className="status-badge status-info"><Truck size={14} /> Đang giao</span>;
      case 'delivered':
        return <span className="status-badge status-success"><CheckCircle size={14} /> Đã giao</span>;
      default:
        return null;
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
                <h3>{user.fullName || 'Người dùng EZ4ENCE'}</h3>
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
                    <div className="form-group col-span-2 md-col-span-1">
                      <label>Họ và tên</label>
                      <input 
                        type="text" 
                        className="profile-input" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group col-span-2 md-col-span-1">
                      <label>Email (Không thể thay đổi)</label>
                      <input 
                        type="email" 
                        className="profile-input" 
                        value={user.email}
                        disabled 
                      />
                    </div>
                    <div className="form-group col-span-2 md-col-span-1">
                      <label>Số điện thoại</label>
                      <input 
                        type="tel" 
                        className="profile-input" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group col-span-2">
                      <label>Địa chỉ giao hàng mặc định</label>
                      <textarea 
                        className="profile-input" 
                        rows="3"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                      ></textarea>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-actions mt-6 flex gap-4">
                      <button type="submit" className="btn btn-primary shadow-glow">
                        Lưu Thay Đổi
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => {
                        setIsEditing(false);
                        // Reset form data if canceled
                        setFormData({
                          fullName: user.fullName || '',
                          phone: '0988123456',
                          address: '123 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'
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
                
                <div className="orders-list">
                  {mockOrders.map((order, idx) => (
                    <div key={idx} className="order-card">
                      <div className="order-card-header">
                        <div className="order-id">{order.id}</div>
                        {renderStatusBadge(order.status)}
                      </div>
                      <div className="order-card-body">
                        <div className="order-detail-item">
                          <span className="label">Ngày đặt:</span>
                          <span className="value">{order.date}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="label">Số sản phẩm:</span>
                          <span className="value">{order.items}</span>
                        </div>
                        <div className="order-detail-item">
                          <span className="label">Tổng tiền:</span>
                          <span className="value text-cyan font-mono font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                          </span>
                        </div>
                      </div>
                      <div className="order-card-footer">
                        <button className="btn btn-outline btn-sm">Xem Chi Tiết</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: RECENTLY VIEWED */}
            {activeTab === 'recent' && (
              <div className="tab-pane fade-in">
                <h2 className="text-xl font-bold mb-6">Sản Phẩm Vừa Xem</h2>
                
                <div className="recent-products-grid">
                  {mockRecentProducts.map(product => (
                    <div key={product.id} className="recent-product-card">
                      <div className="recent-img-wrapper">
                        <img src={product.image} alt={product.name} />
                        <div className="recent-actions">
                          <button className="icon-btn tooltip-trigger" aria-label="Add to cart">
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="recent-info">
                        <h4>{product.name}</h4>
                        <div className="price text-cyan font-mono">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
