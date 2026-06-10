import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, index = 0 }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="product-card glass"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="product-card-img-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
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
            className={`card-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            aria-label="Yêu thích"
          >
            <Heart size={16} fill={isWishlisted ? 'var(--pink)' : 'none'} />
          </button>
          <button
            className="card-action-btn cart-btn"
            onClick={(e) => { e.preventDefault(); /* TODO: Add to cart */ }}
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
          <div className="product-card-specs">
            {product.specs.slice(0, 4).map((spec, idx) => (
              <span key={idx} className="spec-pill">{spec}</span>
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
        </div>

        {/* Price */}
        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-card-original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
