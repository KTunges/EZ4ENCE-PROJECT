import { useState } from 'react';
import { Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders] = useState([
    { id: 'ORD-001', customer: 'Nguyễn Văn A', date: '14/06/2026', total: '45.000.000 đ', status: 'pending', items: 3 },
    { id: 'ORD-002', customer: 'Trần Thị B', date: '14/06/2026', total: '12.500.000 đ', status: 'processing', items: 1 },
    { id: 'ORD-003', customer: 'Lê Văn C', date: '13/06/2026', total: '5.200.000 đ', status: 'shipped', items: 2 },
    { id: 'ORD-004', customer: 'Phạm Thị D', date: '12/06/2026', total: '110.000.000 đ', status: 'delivered', items: 5 },
    { id: 'ORD-005', customer: 'Hoàng Văn E', date: '10/06/2026', total: '3.500.000 đ', status: 'cancelled', items: 1 },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', fontSize: '12px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'processing': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(33, 150, 243, 0.2)', color: '#2196f3', fontSize: '12px', fontWeight: 'bold' }}>Đang xử lý</span>;
      case 'shipped': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(156, 39, 176, 0.2)', color: '#9c27b0', fontSize: '12px', fontWeight: 'bold' }}>Đang giao</span>;
      case 'delivered': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>Đã giao</span>;
      case 'cancelled': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
        <button className="btn btn-primary">Tạo đơn thủ công</button>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..." 
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: 'pointer' }}>
            <Filter size={18} /> Bộ lọc
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Mã Đơn</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Khách hàng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Ngày đặt</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>SL SP</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tổng tiền</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', color: 'var(--cyan)' }}>{order.id}</td>
                  <td style={{ padding: '16px 12px' }}>{order.customer}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{order.date}</td>
                  <td style={{ padding: '16px 12px' }}>{order.items}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{order.total}</td>
                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(order.status)}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }} 
                        title="Xem chi tiết"
                      >
                        <Eye size={14} /> Chi tiết
                      </button>
                      <button style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Tùy chọn khác">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <div>Hiển thị 1 - 5 của 120 đơn hàng</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>Trước</button>
            <button style={{ padding: '6px 12px', background: 'var(--cyan)', border: 'none', borderRadius: '4px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>2</button>
            <button style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', cursor: 'pointer' }}>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
