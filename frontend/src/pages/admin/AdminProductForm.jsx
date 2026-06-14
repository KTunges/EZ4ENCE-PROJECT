import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Cpu, HardDrive, MemoryStick, Monitor, Zap, Plus, X } from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'CPU',
    brand: '',
    price: '',
    salePrice: '',
    stock: '',
    status: 'ACTIVE',
    description: '',
    imageUrl: '',
    specs: {
      cpu: '',
      ram: '',
      vga: '',
      storage: '',
      mainboard: '',
      psu: '',
      case: ''
    }
  });

  // Mock data loading
  useEffect(() => {
    if (isEditing) {
      // Simulate fetch
      setFormData({
        name: 'PC Gaming EZ4-Destroyer i9',
        category: 'PC_ASSEMBLED',
        brand: 'EZ4ENCE Build',
        price: '45000000',
        salePrice: '42990000',
        stock: '5',
        status: 'ACTIVE',
        description: 'Cỗ máy chiến game tối thượng...',
        imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop',
        specs: {
          cpu: 'Intel Core i9-14900K',
          ram: '32GB (2x16GB) DDR5 6000MHz',
          vga: 'RTX 4080 Super 16GB',
          storage: '2TB NVMe Gen4',
          mainboard: 'Z790 AORUS ELITE',
          psu: '1000W 80 Plus Gold',
          case: 'Lian Li O11 Dynamic EVO'
        }
      });
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      specs: { ...prev.specs, [name]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin/products');
    }, 1000);
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
          style={{ padding: '10px 20px', background: 'var(--cyan)', color: '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? <span className="spinner-border w-4 h-4 border-2 rounded-full border-t-transparent animate-spin"></span> : <Save size={18} />}
          LƯU SẢN PHẨM
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Basic Info & Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Information */}
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
                  <option value="PC_ASSEMBLED" style={{ color: '#000' }}>PC Lắp ráp</option>
                  <option value="VGA" style={{ color: '#000' }}>Card Đồ Họa (VGA)</option>
                  <option value="CPU" style={{ color: '#000' }}>Vi xử lý (CPU)</option>
                  <option value="MAINBOARD" style={{ color: '#000' }}>Bo mạch chủ (Mainboard)</option>
                  <option value="RAM" style={{ color: '#000' }}>RAM</option>
                  <option value="SSD" style={{ color: '#000' }}>Ổ cứng (SSD/HDD)</option>
                  <option value="PSU" style={{ color: '#000' }}>Nguồn máy tính (PSU)</option>
                  <option value="CASE" style={{ color: '#000' }}>Vỏ máy tính (Case)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Thương hiệu</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="VD: ASUS, Gigabyte, Intel..." />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px', resize: 'vertical' }} placeholder="Nhập bài viết mô tả sản phẩm ở đây..."></textarea>
            </div>
          </div>

          {/* PC Specifications */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} color="var(--cyan)" /> Thông số Kỹ thuật (PC Specs)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>Chỉ nhập các trường liên quan đến sản phẩm này. Bỏ trống nếu không áp dụng.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><Cpu size={14} /> CPU</label>
                <input type="text" name="cpu" value={formData.specs.cpu} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: Core i7 13700K" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><MemoryStick size={14} /> RAM</label>
                <input type="text" name="ram" value={formData.specs.ram} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: 32GB DDR5 6000MHz" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><Monitor size={14} /> VGA (Card Màn Hình)</label>
                <input type="text" name="vga" value={formData.specs.vga} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: RTX 4070 Ti 12GB" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><HardDrive size={14} /> Ổ cứng (SSD/HDD)</label>
                <input type="text" name="storage" value={formData.specs.storage} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: 1TB NVMe PCIe Gen 4" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Bo mạch chủ (Mainboard)</label>
                <input type="text" name="mainboard" value={formData.specs.mainboard} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: Z790 AORUS MASTER" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}><Zap size={14} /> Nguồn (PSU)</label>
                <input type="text" name="psu" value={formData.specs.psu} onChange={handleSpecChange} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }} placeholder="VD: 850W 80 Plus Gold" />
              </div>
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
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>URL Ảnh (Link trực tiếp)</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px' }} placeholder="https://..." />
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
