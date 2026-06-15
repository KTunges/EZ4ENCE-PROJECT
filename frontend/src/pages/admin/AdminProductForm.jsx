import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Cpu, HardDrive, MemoryStick, Monitor, Zap, Plus, X, Upload } from 'lucide-react';
import { createProduct, updateProduct, getAdminProductById, getCategories, getBrands, uploadAdminImage } from '../../services/adminApi';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, brandsData] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        setCategories(catsData);
        setBrands(brandsData);
        if (catsData.length > 0) setFormData(prev => ({ ...prev, category: catsData[0].name }));
        if (brandsData.length > 0) setFormData(prev => ({ ...prev, brand: brandsData[0].name }));
        
        if (isEditing) {
          setIsLoading(true);
          const product = await getAdminProductById(id);
          setFormData({
            name: product.name || '',
            category: product.category || (catsData.length > 0 ? catsData[0].name : ''),
            brand: product.brand || (brandsData.length > 0 ? brandsData[0].name : ''),
            price: product.price || '',
            salePrice: product.sale_price || '',
            stock: product.stock || '',
            status: product.is_published ? 'ACTIVE' : 'HIDDEN',
            description: product.description || '',
            imageUrl: product.image_url || '',
            specs: {
              cpu: product.specifications?.cpu || '',
              ram: product.specifications?.ram || '',
              vga: product.specifications?.vga || '',
              storage: product.specifications?.storage || '',
              mainboard: product.specifications?.mainboard || '',
              psu: product.specifications?.psu || '',
              case: product.specifications?.case || ''
            }
          });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu form:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['cpu', 'ram', 'vga', 'storage', 'mainboard', 'psu', 'case'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      specs: { ...prev.specs, [name]: value }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await uploadAdminImage(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Không thể tải ảnh lên. Vui lòng kiểm tra cấu hình Cloudinary trên Backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        specifications: formData.specs,
        is_published: formData.status === 'ACTIVE',
        price: parseFloat(formData.price) || 0,
        sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0,
        image_url: formData.imageUrl
      };
      
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
        alert("Thêm sản phẩm thành công!");
      }
      navigate('/admin/products');
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm", error);
      alert("Có lỗi xảy ra khi lưu. Vui lòng kiểm tra console.");
    } finally {
      setIsLoading(false);
    }
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
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
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Thương hiệu</label>
                <select name="brand" value={formData.brand} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '15px', appearance: 'none' }}>
                  {brands.map(brand => <option key={brand.id} value={brand.name}>{brand.name}</option>)}
                </select>
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
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Tải ảnh từ máy tính</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <label htmlFor="image-upload" style={{ flex: 1, padding: '10px 16px', background: 'rgba(0, 210, 255, 0.1)', border: '1px dashed var(--cyan)', color: 'var(--cyan)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <Upload size={16} /> {isUploading ? 'Đang tải lên...' : 'Chọn file ảnh'}
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>Hoặc nhập URL trực tiếp:</div>

            <div style={{ marginBottom: '16px' }}>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '13px' }} placeholder="https://..." />
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
