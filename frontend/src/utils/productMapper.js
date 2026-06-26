export const mapProduct = (item) => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  brand: item.brand?.name || 'Unknown',
  category: item.category?.name || 'Unknown',
  categorySlug: item.category?.slug || '',
  price: item.skus?.[0]?.promotional_price || item.skus?.[0]?.price || 0,
  originalPrice: item.skus?.[0]?.promotional_price ? item.skus?.[0]?.price : null,
  image: item.images?.[0]?.url || '',
  rating: item.rating || 5,
  reviewCount: item.review_count || 0,
  soldCount: item.sold_count || 0,
  badge: item.skus?.[0]?.promotional_price < item.skus?.[0]?.price ? 'HOT' : null,
  specs: Object.values(item.specifications || {}).slice(0, 4),
  fullSpecs: item.specifications || {},
  stock: item.skus ? item.skus.reduce((sum, sku) => sum + (sku.stock_quantity || 0), 0) : 0,
  skus: item.skus || []
});
