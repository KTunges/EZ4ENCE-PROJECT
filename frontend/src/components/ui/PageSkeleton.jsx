import React from 'react';

/**
 * PageSkeleton — Skeleton Loading cho toàn bộ trang.
 * Có nhiều variant: 'home', 'detail', 'list', 'cart', 'news'
 */
export default function PageSkeleton({ variant = 'home' }) {
  if (variant === 'home') {
    return (
      <div className="page-skeleton fade-in" style={{ padding: '0' }}>
        {/* Hero Skeleton */}
        <div className="skeleton skeleton-block" style={{ height: '500px', borderRadius: '0', marginBottom: '0' }}></div>

        {/* Category Bar */}
        <div style={{ padding: '40px 5%' }}>
          <div className="skeleton skeleton-title" style={{ width: '200px', height: '28px', margin: '0 auto 30px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ padding: '40px 5%' }}>
          <div className="skeleton skeleton-title" style={{ width: '250px', height: '28px', margin: '0 auto 30px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '200px', borderRadius: '12px 12px 0 0' }}></div>
                <div style={{ padding: '16px' }}>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-title" style={{ width: '85%' }}></div>
                  <div className="skeleton skeleton-title" style={{ width: '65%' }}></div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <div className="skeleton" style={{ width: '60px', height: '22px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skeleton skeleton-title" style={{ width: '100px', margin: 0 }}></div>
                    <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'cart') {
    return (
      <div className="page-skeleton fade-in" style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="skeleton skeleton-title" style={{ width: '180px', height: '32px', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '140px', marginBottom: '32px' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
          {/* Cart Items */}
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-cart-item glass" style={{
                display: 'flex', gap: '20px', padding: '20px', borderRadius: '12px', marginBottom: '16px',
                background: 'var(--bg-card)', border: '1px solid var(--border-color)'
              }}>
                <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '10px', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                  <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '16px' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: '100px', height: '32px', borderRadius: '8px' }}></div>
                    <div className="skeleton skeleton-title" style={{ width: '120px', margin: 0 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass" style={{ padding: '24px', borderRadius: '12px', height: 'fit-content', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="skeleton skeleton-title" style={{ width: '60%', marginBottom: '24px' }}></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="skeleton skeleton-text" style={{ width: '35%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '25%' }}></div>
              </div>
            ))}
            <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: '10px', marginTop: '16px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'news') {
    return (
      <div className="page-skeleton fade-in" style={{ padding: '40px 5%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div className="skeleton skeleton-text" style={{ width: '60px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '8px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '150px' }}></div>
        </div>
        {/* Title */}
        <div className="skeleton skeleton-title" style={{ width: '90%', height: '36px', marginBottom: '12px' }}></div>
        <div className="skeleton skeleton-title" style={{ width: '60%', height: '36px', marginBottom: '24px' }}></div>
        {/* Meta */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '80px' }}></div>
        </div>
        {/* Featured Image */}
        <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: '12px', marginBottom: '32px' }}></div>
        {/* Content lines */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${70 + Math.random() * 30}%`, marginBottom: '12px' }}></div>
        ))}
        <div style={{ marginBottom: '24px' }}></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${60 + Math.random() * 40}%`, marginBottom: '12px' }}></div>
        ))}
      </div>
    );
  }

  if (variant === 'order') {
    return (
      <div className="page-skeleton fade-in" style={{ padding: '40px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div className="skeleton skeleton-title" style={{ width: '280px', height: '32px', marginBottom: '8px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '200px' }}></div>
          </div>
          <div className="skeleton" style={{ width: '140px', height: '36px', borderRadius: '20px' }}></div>
        </div>

        {/* Status Timeline */}
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                {i < 4 && <div className="skeleton" style={{ flex: 1, height: '3px', margin: '0 8px' }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="glass" style={{ padding: '24px', borderRadius: '12px', marginBottom: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="skeleton skeleton-title" style={{ width: '180px', marginBottom: '20px' }}></div>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '8px', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-title" style={{ width: '70%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
              </div>
              <div className="skeleton skeleton-title" style={{ width: '100px', margin: 0 }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default / generic skeleton
  return (
    <div className="page-skeleton fade-in" style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="skeleton skeleton-title" style={{ width: '250px', height: '32px', marginBottom: '12px' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '180px', marginBottom: '40px' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: '180px' }}></div>
            <div style={{ padding: '16px' }}>
              <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '45%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
