import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, ChevronDown, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminOrders, deleteOrder } from '../../services/adminApi';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = (
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_phone && o.customer_phone.toLowerCase().includes(q))
    );
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này? Việc này không thể hoàn tác.")) {
      try {
        await deleteOrder(id);
        fetchOrders();
      } catch (error) {
        alert("Lỗi khi xóa đơn hàng!");
        console.error(error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', fontSize: '12px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'CONFIRMED': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(33, 150, 243, 0.2)', color: '#2196f3', fontSize: '12px', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'SHIPPING': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(156, 39, 176, 0.2)', color: '#9c27b0', fontSize: '12px', fontWeight: 'bold' }}>Đang giao</span>;
      case 'DELIVERED': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>Đã giao</span>;
      case 'CANCELLED': return <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(244, 67, 54, 0.2)', color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--cyan)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Tạo đơn thủ công
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '12px', padding: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ padding: '0 12px', color: 'var(--text-muted)' }}><Filter size={18} /></div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '10px 16px 10px 4px', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'var(--text-muted)', display: 'none' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Mã Đơn</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Khách hàng</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Ngày đặt</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Tổng tiền</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px' }}>Trạng thái</th>
                <th style={{ padding: '16px 12px', fontWeight: '600', fontSize: '14px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có đơn hàng nào</td></tr>
              ) : currentOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', color: 'var(--cyan)' }}>{order.id.substring(0, 8).toUpperCase()}</td>
                  <td style={{ padding: '16px 12px' }}>{order.customer_name}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td style={{ padding: '16px 12px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                  </td>
                  <td style={{ padding: '16px 12px' }}>{getStatusBadge(order.status)}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => navigate(`/admin/orders/${order.id}`)} style={{ padding: '6px', background: 'rgba(0, 210, 255, 0.1)', border: 'none', color: 'var(--cyan)', borderRadius: '6px', cursor: 'pointer' }} title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(order.id)} style={{ padding: '6px', background: 'rgba(255, 23, 68, 0.1)', border: 'none', color: '#ff1744', borderRadius: '6px', cursor: 'pointer' }} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <div>Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} của {filteredOrders.length} đơn hàng</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ 
                    padding: '6px 12px', 
                    background: currentPage === page ? 'var(--cyan)' : 'var(--bg-card)', 
                    border: currentPage === page ? 'none' : '1px solid var(--border)', 
                    borderRadius: '4px', 
                    color: currentPage === page ? 'black' : 'var(--text)', 
                    fontWeight: currentPage === page ? 'bold' : 'normal',
                    cursor: 'pointer' 
                  }}>
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
