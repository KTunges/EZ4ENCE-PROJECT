import { useState, useEffect } from 'react';
import { getAdminReviews, replyToReview, toggleHideReview } from '../../services/adminApi';
import { Star, ShieldAlert, Check, X, Shield } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAdminReviews();
      setReviews(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id, currentStatus) => {
    try {
      const updated = await toggleHideReview(id, !currentStatus);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      alert(updated.is_hidden ? 'Đã ẩn đánh giá' : 'Đã hiển thị đánh giá');
    } catch (err) {
      alert('Lỗi khi ẩn/hiện đánh giá');
    }
  };

  const handleReplySubmit = async (id) => {
    const text = replyText[id];
    if (!text?.trim()) {
      alert('Vui lòng nhập nội dung phản hồi');
      return;
    }
    try {
      const updated = await replyToReview(id, text);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      alert('Đã gửi phản hồi');
      setReplyText(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert('Lỗi khi gửi phản hồi');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400 animate-pulse">Đang tải dữ liệu đánh giá...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold glitch-text" data-text="QUẢN LÝ ĐÁNH GIÁ">QUẢN LÝ ĐÁNH GIÁ</h1>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '16px', fontWeight: '600', color: '#334155', width: '15%', fontSize: '14px' }}>Khách Hàng</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#334155', width: '25%', fontSize: '14px' }}>Sản Phẩm</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#334155', width: '25%', fontSize: '14px' }}>Đánh Giá</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#334155', width: '25%', fontSize: '14px' }}>Phản Hồi (Admin)</th>
              <th style={{ padding: '16px', fontWeight: '600', color: '#334155', width: '10%', textAlign: 'right', fontSize: '14px' }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: review.is_hidden ? '#f8fafc' : '#ffffff', opacity: review.is_hidden ? 0.6 : 1, transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{review.user_name || 'Unknown'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{new Date(review.created_at).toLocaleDateString('vi-VN')}</div>
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>
                  {review.product_name}
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} fill={s <= review.rating ? '#f59e0b' : 'none'} stroke={s <= review.rating ? '#f59e0b' : '#cbd5e1'} />
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', margin: 0 }}>{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                          {review.images.map((img, idx) => (
                              <img key={idx} src={img.url} alt="review" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => window.open(img.url, '_blank')} />
                          ))}
                      </div>
                  )}
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top' }}>
                  {review.admin_reply ? (
                    <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                       <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <Shield size={14} color="#2563eb" style={{ marginRight: '6px' }}/> 
                          <span style={{ fontWeight: '600', color: '#1e3a8a', fontSize: '13px' }}>Admin đã phản hồi:</span>
                       </div>
                       <div style={{ color: '#1e40af', fontSize: '14px', lineHeight: '1.5' }}>{review.admin_reply}</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <textarea 
                         placeholder="Nhập nội dung trả lời..." 
                         rows="2"
                         style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#0f172a', outline: 'none', resize: 'vertical', minHeight: '60px' }}
                         value={replyText[review.id] || ''}
                         onChange={(e) => setReplyText(prev => ({...prev, [review.id]: e.target.value}))}
                       />
                       <button 
                         onClick={() => handleReplySubmit(review.id)} 
                         style={{ alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                       >
                         Gửi Phản Hồi
                       </button>
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px', verticalAlign: 'top', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleToggleHide(review.id, review.is_hidden)}
                    style={{ padding: '8px', borderRadius: '50%', backgroundColor: review.is_hidden ? '#e2e8f0' : '#fee2e2', color: review.is_hidden ? '#64748b' : '#ef4444', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    title={review.is_hidden ? "Hiển thị lại" : "Ẩn đánh giá"}
                  >
                    {review.is_hidden ? <Check size={18} /> : <X size={18} />}
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px', backgroundColor: '#f8fafc' }}>
                  Chưa có đánh giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
