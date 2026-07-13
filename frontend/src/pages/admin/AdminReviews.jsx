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

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 font-semibold text-cyan">Khách Hàng</th>
              <th className="p-4 font-semibold text-cyan">Sản Phẩm</th>
              <th className="p-4 font-semibold text-cyan">Đánh Giá</th>
              <th className="p-4 font-semibold text-cyan">Phản Hồi (Admin)</th>
              <th className="p-4 font-semibold text-cyan text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className={`border-b border-white/10 hover:bg-white/5 transition-colors ${review.is_hidden ? 'opacity-50' : ''}`}>
                <td className="p-4">
                  <div className="font-medium text-white">{review.user_name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('vi-VN')}</div>
                </td>
                <td className="p-4 text-sm text-gray-300">
                  {review.product_name}
                </td>
                <td className="p-4 max-w-xs">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill={s <= review.rating ? 'var(--cyan)' : 'none'} stroke={s <= review.rating ? 'var(--cyan)' : 'var(--text-dim)'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 truncate-2-lines">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                          {review.images.map((img, idx) => (
                              <img key={idx} src={img.url} className="w-10 h-10 object-cover rounded cursor-pointer border border-white/20" onClick={() => window.open(img.url, '_blank')} />
                          ))}
                      </div>
                  )}
                </td>
                <td className="p-4">
                  {review.admin_reply ? (
                    <div className="bg-cyan-900/30 p-2 rounded border border-cyan/20 text-sm text-gray-300">
                       <Shield size={12} className="inline mr-1 text-cyan"/> {review.admin_reply}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                       <input 
                         type="text" 
                         placeholder="Nhập phản hồi..." 
                         className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-cyan"
                         value={replyText[review.id] || ''}
                         onChange={(e) => setReplyText(prev => ({...prev, [review.id]: e.target.value}))}
                       />
                       <button onClick={() => handleReplySubmit(review.id)} className="text-xs bg-cyan text-black px-2 py-1 rounded font-bold hover:bg-cyan-light self-start">Gửi</button>
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleToggleHide(review.id, review.is_hidden)}
                    className={`p-2 rounded ${review.is_hidden ? 'bg-gray-600' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'} transition-colors`}
                    title={review.is_hidden ? "Hiển thị lại" : "Ẩn đánh giá"}
                  >
                    {review.is_hidden ? <Check size={18} /> : <X size={18} />}
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
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
