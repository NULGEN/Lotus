import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../store/actions/productActions';

export default function HomePage() {
  const dispatch = useDispatch();
  const { productList, fetchState } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (fetchState === 'FETCHING_PRODUCTS') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (fetchState === 'FAILED_PRODUCTS') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to fetch products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-gray-100 py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LOTUS</h1>
        <p className="text-xl text-gray-600">Discover the latest fashion trends</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}