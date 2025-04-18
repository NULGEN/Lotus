import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  if (!product || !product.images || !product.images.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.images[0]} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}