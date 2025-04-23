import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const getImageUrl = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      }
      if (typeof firstImage === 'string') {
        return firstImage;
      }
    }
    if (typeof product.image === 'string') {
      return product.image;
    }
    if (typeof product.thumbnail === 'string') {
      return product.thumbnail;
    }
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.currentTarget.src);
    e.currentTarget.onerror = null; // Prevent infinite loop
    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  };

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleProductClick = () => {
    const category = product.category || {};
    const nameSlug = createSlug(product.name);
    navigate(`/shop/${category.gender || 'all'}/${category.code?.split(':')[1] || 'uncategorized'}/${category.id || 0}/${nameSlug}/${product.id}`);
  };

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
    >
      <div className="relative h-48 bg-gray-100">
        <img 
          src={getImageUrl()}
          alt={product.name || 'Product Image'} 
          className="w-full h-full object-contain"
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {product.name || 'Unnamed Product'}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description || 'No description available'}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">
            ${product.price?.toFixed(2) || '0.00'}
          </span>
          <button 
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}