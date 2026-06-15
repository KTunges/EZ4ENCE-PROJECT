import { useState, useEffect } from 'react';
import { Search, Trash2, Star } from 'lucide-react';
import { getReviews, deleteReview } from '../../services/adminApi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đánh giá", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này? Việc này không thể hoàn tác.")) {
      try {
        await deleteReview(id);
        fetchReviews();
      } catch (error) {
        alert("Lỗi khi xóa đánh giá!");
        console.error(error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Đánh giá</h1>
      </div>

      <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung..." 
              style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '150px' }}>Ngày đăng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '180px' }}>Người dùng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '200px' }}>Sản phẩm</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '120px' }}>Đánh giá</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', minWidth: '250px' }}>Nội dung</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', width: '100px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có đánh giá nào</td></tr>
              ) : reviews.map(rv => (
                <tr key={rv.id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '13px' }}>{formatDate(rv.created_at)}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontSize: '14px' }}>{rv.user_name}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--cyan)', fontSize: '13px' }}>{rv.product_name}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rv.rating ? "currentColor" : "none"} color={i < rv.rating ? "currentColor" : "var(--border-hover)"} />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{rv.comment || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Không có nội dung</span>}</div>
                    {rv.images && rv.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {rv.images.map(img => (
                          <img key={img.id} src={img.url} alt="Review" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingTop: '10px' }}>
                      <button onClick={() => handleDelete(rv.id)} style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa đánh giá">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
