import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../store/actions/productActions';

export default function HomePage() {
  const dispatch = useDispatch();
  const { productList, fetchState, total } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useState({
    limit: 25,
    offset: 0
  });

  const totalPages = Math.ceil(total / searchParams.limit);
  const currentPage = Math.floor(searchParams.offset / searchParams.limit) + 1;

  useEffect(() => {
    dispatch(fetchProducts(searchParams));
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      offset: (newPage - 1) * prev.limit
    }));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {startPage > 1 && <span className="px-2">...</span>}
        {pages}
        {endPage < totalPages && <span className="px-2">...</span>}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Last
        </button>
      </div>
    );
  };

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-gray-600">
            Showing {productList.length} of {total} products
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {renderPagination()}
      </section>
    </div>
  );
}