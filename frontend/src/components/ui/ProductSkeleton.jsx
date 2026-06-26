import React from 'react';

export default function ProductSkeleton({ index = 0 }) {
  return (
    <div 
      className="product-card glass" 
      style={{ opacity: 1, transform: 'none', animationDelay: `${index * 0.06}s` }}
    >
      {/* Image Skeleton */}
      <div className="product-card-img-wrapper skeleton" style={{ minHeight: '200px' }}></div>
      
      {/* Info Skeleton */}
      <div className="product-card-info" style={{ padding: '16px' }}>
        {/* Brand */}
        <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
        
        {/* Title */}
        <div className="skeleton skeleton-title" style={{ width: '90%' }}></div>
        <div className="skeleton skeleton-title" style={{ width: '70%', marginBottom: '16px' }}></div>
        
        {/* Specs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
           <div className="skeleton skeleton-text" style={{ width: '60px', height: '24px', borderRadius: '4px' }}></div>
           <div className="skeleton skeleton-text" style={{ width: '80px', height: '24px', borderRadius: '4px' }}></div>
           <div className="skeleton skeleton-text" style={{ width: '70px', height: '24px', borderRadius: '4px' }}></div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
           {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton" style={{ width: '13px', height: '13px', borderRadius: '50%' }}></div>
           ))}
        </div>

        {/* Price Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
           <div className="skeleton skeleton-title" style={{ width: '100px', margin: 0 }}></div>
           <div className="skeleton skeleton-text" style={{ width: '50px', margin: 0 }}></div>
        </div>
      </div>
    </div>
  );
}
