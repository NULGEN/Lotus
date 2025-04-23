import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { fetchProduct } from '../store/actions/productActions';
import { addToCart } from '../store/actions/cartActions';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, fetchState } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProduct(productId));
    }
  }, [dispatch, productId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(currentProduct));
  };

  if (fetchState === 'FETCHING_PRODUCT') {
    return <LoadingSpinner />;
  }

  if (fetchState === 'FAILED_PRODUCT') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load product details. Please try again later.</p>
        <button
          onClick={handleGoBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={handleGoBack}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <button
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentProduct.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={currentProduct.name}
              className="w-full h-full object-center object-contain"
            />
          </div>
          {currentProduct.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-full object-center object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
            <p className="mt-2 text-gray-600">{currentProduct.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(currentProduct.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({currentProduct.rating} / 5)</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{currentProduct.sell_count} sold</span>
          </div>

          <div className="text-3xl font-bold text-gray-900">
            ${currentProduct.price?.toFixed(2)}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Availability:</span>
              <span className={`font-medium ${currentProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            disabled={currentProduct.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}