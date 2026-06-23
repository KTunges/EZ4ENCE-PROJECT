import { useState, useEffect } from 'react';
import { Search, Trash2, Star, MessageCircle, Eye, EyeOff, X, CornerDownRight } from 'lucide-react';
import { getReviews, deleteReview, replyReview, toggleHideReview } from '../../services/adminApi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter(rv => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rv.user_name && rv.user_name.toLowerCase().includes(q)) ||
      (rv.product_name && rv.product_name.toLowerCase().includes(q)) ||
      (rv.comment && rv.comment.toLowerCase().includes(q))
    );
  });

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

  const handleToggleHide = async (id, currentStatus) => {
    try {
      await toggleHideReview(id, !currentStatus);
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi thay đổi trạng thái!");
      console.error(error);
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    try {
      await replyReview(replyingTo.id, replyText);
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      alert("Lỗi khi gửi trả lời!");
      console.error(error);
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              ) : filteredReviews.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có đánh giá nào</td></tr>
              ) : filteredReviews.map(rv => (
                <tr key={rv.id} style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'top', opacity: rv.is_hidden ? 0.5 : 1 }}>
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
                    {rv.admin_reply && (
                      <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(0, 220, 255, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--cyan)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '12px', color: 'var(--cyan)', fontWeight: 'bold' }}>
                          <CornerDownRight size={14} /> Admin trả lời:
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{rv.admin_reply}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingTop: '10px', gap: '8px' }}>
                      <button onClick={() => { setReplyingTo(rv); setReplyText(rv.admin_reply || ''); }} style={{ padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} title="Trả lời">
                        <MessageCircle size={16} />
                      </button>
                      <button onClick={() => handleToggleHide(rv.id, rv.is_hidden)} style={{ padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: rv.is_hidden ? 'var(--text-muted)' : 'var(--text)', borderRadius: '6px', cursor: 'pointer' }} title={rv.is_hidden ? "Hiện đánh giá" : "Ẩn đánh giá"}>
                        {rv.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
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

      {replyingTo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass" style={{ width: '500px', maxWidth: '95%', background: 'var(--bg-card)', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Trả lời đánh giá</h2>
              <button onClick={() => setReplyingTo(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '24px', flex: 1 }}>
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)' }}>
                <strong>{replyingTo.user_name}:</strong> {replyingTo.comment || 'Không có nội dung'}
              </div>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập nội dung trả lời của bạn..."
                style={{ width: '100%', height: '120px', padding: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-surface)', borderRadius: '0 0 16px 16px' }}>
              <button onClick={() => setReplyingTo(null)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={submitReply} style={{ padding: '8px 16px', background: 'var(--cyan)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Gửi trả lời</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
