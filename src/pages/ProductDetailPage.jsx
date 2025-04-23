import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (image) => {
    if (typeof image === 'object' && image.url) {
      return image.url;
    }
    if (typeof image === 'string') {
      return image;
    }
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.currentTarget.src);
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="space-y-4">
          <div className="relative">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
              onError={handleImageError}
            />
            {images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      selectedImage === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl font-bold text-blue-600">${product.price?.toFixed(2) || '0.00'}</p>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Category: {product.category}</p>
              <p className="font-medium text-gray-900">Stock: {product.stock}</p>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-w-3 aspect-h-4">
            <img
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
              onError={handleImageError}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square ${
                  selectedImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 px-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600">${product.price?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Category: {product.category}</p>
              <p className="font-medium text-gray-900">Stock: {product.stock}</p>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}