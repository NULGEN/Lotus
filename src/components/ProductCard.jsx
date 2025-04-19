import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.image; // fallback to single image if images array is not available

  if (!imageUrl) {
    return null;
  }

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48">
          <img 
            src={imageUrl}
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            <button 
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic here
              }}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}