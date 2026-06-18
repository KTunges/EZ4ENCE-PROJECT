import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Tag, User } from 'lucide-react';
import CyberBackground from '../../components/ui/CyberBackground';

export default function NewsDetails() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/news/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="news-details-page" style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CyberBackground />
        <div style={{ color: 'var(--cyan)', fontSize: '20px' }}>Đang tải tin tức...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-details-page" style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CyberBackground />
        <h2 className="glitch-text" data-text="404 - Bài viết không tồn tại" style={{ fontSize: '32px', marginBottom: '20px' }}>404 - Bài viết không tồn tại</h2>
        <Link to="/" className="btn btn-primary">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="news-details-page relative" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <CyberBackground />
      
      <div className="container relative z-10" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ChevronLeft size={20} /> Quay lại trang chủ
        </Link>
        
        <article className="glass-panel" style={{ padding: '40px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.8)' }}>
          <h1 className="news-title glitch-text" data-text={news.title} style={{ fontSize: '36px', lineHeight: '1.3', marginBottom: '24px', color: '#fff' }}>
            {news.title}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {new Date(news.published_at || news.created_at).toLocaleDateString('vi-VN')}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={16} /> {news.category || 'Công nghệ'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> EZ4GEAR Admin</span>
          </div>

          {news.image_url && (
            <div style={{ marginBottom: '40px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={news.image_url} alt={news.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          {news.summary && (
            <div style={{ fontSize: '18px', fontWeight: '500', color: '#e2e8f0', marginBottom: '32px', fontStyle: 'italic', borderLeft: '4px solid var(--cyan)', paddingLeft: '20px' }}>
              {news.summary}
            </div>
          )}

          <div 
            className="news-content-body" 
            style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}
            dangerouslySetInnerHTML={{ __html: news.content }} 
          />
        </article>
      </div>
    </div>
  );
}
