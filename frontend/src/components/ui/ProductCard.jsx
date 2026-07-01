import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = React.memo(({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const skuId = product.skus?.[0]?.id || product.skus?.[0]?.sku_id || product.sku_id;
  const wishlisted = skuId ? isWishlisted(skuId) : false;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card glass">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="product-card-img-wrapper">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Chưa có hình</span>
          </div>
        )}
        <div className="product-card-overlay" />

        {/* Badges */}
        <div className="product-card-badges">
          {product.badge === 'HOT' && <span className="badge badge-hot">HOT</span>}
          {product.badge === 'NEW' && <span className="badge badge-new">NEW</span>}
          {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
        </div>

        {/* Quick Actions */}
        <div className="product-card-actions">
          <button
            className={`card-action-btn wishlist-btn ${wishlisted ? 'active' : ''}`}
            onClick={async (e) => { 
              e.preventDefault(); 
              if (skuId) {
                await toggleWishlist(skuId);
              }
            }}
            aria-label="Yêu thích"
          >
            <Heart size={16} fill={wishlisted ? 'var(--pink)' : 'none'} />
          </button>
          <button
            className="card-action-btn cart-btn"
            onClick={(e) => { 
              e.preventDefault(); 
              if (product.skus && product.skus.length > 0) {
                addToCart(product.skus[0].id, 1);
              } else {
                console.warn('No SKU found for product', product.id);
              }
            }}
            aria-label="Thêm giỏ hàng"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="product-card-info">
        {product.brand && <span className="product-card-brand">{product.brand}</span>}

        <Link to={`/products/${product.slug}`} className="product-card-name">
          {product.name}
        </Link>

        {/* Specs Pills */}
        {product.specs && product.specs.length > 0 && (
          <div className="product-card-specs" style={{ maxHeight: '60px', overflow: 'hidden' }}>
            {product.specs.slice(0, 4).map((spec, idx) => (
              <span key={idx} className="spec-pill" style={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spec}</span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="product-card-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              fill={star <= (product.rating || 0) ? 'var(--cyan)' : 'none'}
              stroke={star <= (product.rating || 0) ? 'var(--cyan)' : 'var(--text-dim)'}
            />
          ))}
          {product.reviewCount > 0 && (
            <span className="rating-count">({product.reviewCount})</span>
          )}
          {product.soldCount > 0 && (
            <span className="rating-count" style={{ marginLeft: '6px', paddingLeft: '6px', borderLeft: '1px solid var(--border)' }}>Đã bán {product.soldCount}</span>
          )}
        </div>

        {/* Price & Stock */}
        <div className="product-card-price-row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
            <span className="product-card-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-card-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="product-card-stock" style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--cyan)' : 'var(--text-dim)', whiteSpace: 'nowrap' }}>
            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
