import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PolicyPage() {
  const { slug } = useParams();

  const policyLinks = [
    { name: 'Giới thiệu', slug: 'gioi-thieu' },
    { name: 'Hệ thống cửa hàng', slug: 'he-thong-cua-hang' },
    { name: 'Bảng giá thu sản phẩm cũ', slug: 'thu-cu-doi-moi' },
    { name: 'Hỗ trợ kỹ thuật tận nơi', slug: 'dich-vu-ky-thuat-tai-nha' },
    { name: 'Tra cứu thông tin bảo hành', slug: 'tra-cuu-bao-hanh' },
    { name: 'Chính sách giao hàng', slug: 'chinh-sach-giao-hang' },
    { name: 'Chính sách bảo hành', slug: 'chinh-sach-bao-hanh' },
    { name: 'Thanh toán', slug: 'thanh-toan' },
    { name: 'Mua hàng trả góp', slug: 'mua-hang-tra-gop' },
    { name: 'Hướng dẫn mua hàng', slug: 'huong-dan-mua-hang' },
    { name: 'Chính sách bảo mật', slug: 'chinh-sach-bao-mat' },
    { name: 'Điều khoản dịch vụ', slug: 'dieu-khoan-dich-vu' },
    { name: 'Dịch vụ vệ sinh miễn phí', slug: 've-sinh-mien-phi' }
  ];

  // Mock content for specific policies. In a real app, this might come from a DB or CMS.
  const policyContent = {
    'thu-cu-doi-moi': {
      title: 'Chính sách & bảng giá thu sản phẩm đã qua sử dụng',
      content: (
        <div className="policy-content" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p>EZ4ENCE ra mắt dịch vụ <strong>"Thu cũ đổi mới sản phẩm cũ"</strong> nhằm hỗ trợ khách hàng dễ dàng nâng cấp linh kiện với chi phí hợp lý. Chúng tôi cam kết mang đến trải nghiệm thuận tiện và giá trị tốt nhất cho khách hàng.</p>
          <p>Các dòng sản phẩm nằm trong chính sách thu cũ đổi mới bao gồm VGA, Mainboard và CPU đã qua sử dụng.</p>
          <p>Đối với dòng sản phẩm Mainboard, hiện tại EZ4ENCE chỉ áp dụng cho các thương hiệu Gigabyte, MSI, Asus và Asrock.</p>
          <p>EZ4ENCE hiện chỉ thu lại sản phẩm cũ khi bạn mua sản phẩm mới tại cửa hàng; hiện tại, chúng tôi chưa cung cấp dịch vụ thu mua sản phẩm cũ riêng lẻ. Mong quý khách thông cảm.</p>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Ưu đãi đặc biệt</h3>
          <p>Xem chi tiết chương trình tại cửa hàng hoặc liên hệ nhân viên tư vấn.</p>
          <p><em>Lưu ý: Chương trình thu cũ đổi mới diễn ra tại tất cả các cửa hàng thuộc hệ thống bán lẻ của EZ4ENCE.</em></p>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Bảng giá thu sản phẩm cũ tham khảo:</h3>
          <p><em>Lưu ý: Giá thu mua có thể thay đổi tùy theo biến động thị trường. Vui lòng liên hệ trực tiếp để có báo giá chính xác nhất.</em></p>
          <p>Giá thu trên chỉ mang tính tham khảo, giá thu sẽ được xác định chính xác sau khi hoàn tất kiểm tra trực tiếp và thông báo bởi bộ phận kỹ thuật tại các cửa hàng.</p>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Quy trình thu cũ đổi mới</h3>
          <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Khách hàng mang sản phẩm cũ đến cửa hàng EZ4ENCE hoặc liên hệ để được tư vấn qua tổng đài 1900 5301.</li>
            <li>Nhân viên kỹ thuật kiểm tra và định giá sản phẩm cũ.</li>
            <li>Báo giá thu mua và tư vấn sản phẩm mới phù hợp.</li>
          </ol>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Chính sách định giá</h3>
          <p>Giá thu mua được xác định dựa trên các yếu tố sau:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Tình trạng hoạt động của sản phẩm</li>
            <li>Thương hiệu và model</li>
            <li>Thời gian bảo hành còn lại</li>
            <li>Tình trạng ngoại hình</li>
            <li>Phụ kiện đi kèm (hộp, cáp, v.v.)</li>
          </ul>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Các loại sản phẩm không thu:</h3>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Các sản phẩm hư hỏng nặng, móp méo, cháy nổ dẫn đến biến dạng hoặc gãy vỡ.</li>
            <li>Các sản phẩm đã thay thế linh kiện không đúng tiêu chuẩn.</li>
            <li>Các sản phẩm không thể xác định rõ tên, thương hiệu.</li>
          </ul>

          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px' }}>Liên hệ</h3>
          <p>Để biết thêm thông tin chi tiết hoặc đặt lịch kiểm tra sản phẩm cũ, vui lòng liên hệ:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px', listStyle: 'none' }}>
            <li>📞 Hotline: 1900 5301</li>
            <li>📧 Email: cskh@ez4ence.com</li>
            <li>📍 Khu vực miền Bắc:<br />162 - 164 Thái Hà, Phường Trung Liệt, Đống Đa, Hà Nội.</li>
            <li>📍 Khu vực miền Nam:<br />82 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, Tp.HCM.</li>
          </ul>
        </div>
      )
    },
    'dich-vu-ky-thuat-tai-nha': {
      title: 'EZ4ENCE cung cấp dịch vụ kỹ thuật tại nhà',
      content: (
        <div className="policy-content" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          <p>Dịch vụ hỗ trợ kỹ thuật tại nhà của EZ4ENCE giúp bạn khắc phục mọi sự cố máy tính nhanh chóng và tiện lợi nhất.</p>
          <p>Với sự hợp tác cùng các đối tác uy tín, chúng tôi cam kết mang đến dịch vụ chất lượng cao, đáp ứng nhanh chóng nhu cầu của khách hàng.</p>
          <h3 style={{ color: 'var(--text)', marginTop: '24px', marginBottom: '12px', textAlign: 'center', color: 'var(--primary)' }}>YÊU CẦU DỊCH VỤ: Gọi ngay 1900.5301</h3>
        </div>
      )
    }
  };

  const currentPolicy = policyContent[slug] || {
    title: policyLinks.find(l => l.slug === slug)?.name || 'Chính sách & Dịch vụ',
    content: <p style={{ color: 'var(--text-muted)' }}>Nội dung đang được cập nhật. Vui lòng quay lại sau.</p>
  };

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh', display: 'flex', gap: '30px' }}>

      {/* Sidebar */}
      <div style={{ width: '300px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '16px 0', overflow: 'hidden' }}>
          <h3 style={{ padding: '0 20px 16px', margin: '0', fontSize: '18px', fontWeight: 'bold', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
            Trung tâm hỗ trợ
          </h3>
          <div style={{ marginTop: '12px' }}>
            {policyLinks.map((link, idx) => {
              const isActive = slug === link.slug;
              return (
                <Link
                  key={idx}
                  to={`/policy/${link.slug}`}
                  replace={true}
                  className={`policy-sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                  {isActive && <span style={{ display: 'flex', alignItems: 'center' }}>›</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-panel" style={{ flex: 1, padding: '40px', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          {currentPolicy.title}
        </h1>
        {currentPolicy.content}
      </div>
    </div>
  );
}
