import React from 'react';
import CyberBackground from './CyberBackground';

export default function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page">
      <CyberBackground />
      
      <section className="product-detail-header">
        <div className="container">
          <div className="breadcrumb skeleton skeleton-text" style={{ width: '200px' }}></div>
        </div>
      </section>

      <section className="container product-detail-main">
        <div className="product-detail-grid">
          
          {/* LEFT: Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main-wrapper glass skeleton" style={{ minHeight: '400px' }}></div>
            <div className="gallery-thumbs" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '8px' }}></div>
               ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="product-info">
            <div className="skeleton skeleton-title" style={{ width: '30%', height: '14px', marginBottom: '8px' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '90%', height: '32px' }}></div>
            <div className="skeleton skeleton-title" style={{ width: '70%', height: '32px', marginBottom: '16px' }}></div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '100px', height: '20px' }}></div>
              <div className="skeleton" style={{ width: '150px', height: '20px' }}></div>
            </div>

            <div className="product-price-box glass" style={{ padding: '24px', marginBottom: '32px' }}>
               <div className="skeleton skeleton-title" style={{ width: '200px', height: '36px', marginBottom: '10px' }}></div>
               <div className="skeleton skeleton-text" style={{ width: '150px', height: '16px' }}></div>
            </div>

            <div className="product-spec-preview" style={{ marginBottom: '32px' }}>
               <div className="skeleton skeleton-title" style={{ width: '120px', height: '20px', marginBottom: '16px' }}></div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '20px' }}>
                       <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
                       <div className="skeleton skeleton-text" style={{ flex: 1 }}></div>
                    </div>
                 ))}
               </div>
            </div>

            <div className="product-actions" style={{ display: 'flex', gap: '16px' }}>
               <div className="skeleton" style={{ width: '150px', height: '54px', borderRadius: '8px' }}></div>
               <div className="skeleton" style={{ flex: 1, height: '54px', borderRadius: '8px' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
