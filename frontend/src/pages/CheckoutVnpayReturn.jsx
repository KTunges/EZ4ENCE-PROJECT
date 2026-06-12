import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';

export default function CheckoutVnpayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      // Nếu không có query params, quay về trang chủ
      if (!location.search) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/payment/vnpay/verify-return${location.search}`);
        const data = await response.json();
        
        if (data.success) {
          // Thành công -> Chuyển sang trang Success
          navigate('/checkout/success', { 
            state: { 
              method: 'vnpay', 
              total: data.amount, 
              orderId: data.order_id 
            },
            replace: true
          });
        } else {
          setError(data.message || "Giao dịch thất bại hoặc đã bị hủy.");
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi kết nối khi xác thực giao dịch.");
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 fade-in">
        <div className="glass max-w-md w-full p-8 text-center border-t-4 border-pink">
          <XCircle size={64} className="text-pink mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-white">Thanh Toán Thất Bại</h2>
          <p className="text-muted mb-8">{error}</p>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full">
            Quay lại trang Thanh Toán
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center fade-in">
      <Loader2 size={48} className="text-cyan animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-white">Đang xác thực giao dịch VNPAY...</h2>
      <p className="text-muted mt-2">Vui lòng không đóng trình duyệt lúc này.</p>
    </div>
  );
}
