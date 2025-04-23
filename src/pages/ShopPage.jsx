import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProducts, fetchCategories } from '../store/actions/productActions';

export default function ShopPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, categories, fetchState, total } = useSelector((state) => state.products);
  const { gender, category, id } = useParams();
  const searchInputRef = useRef(null);
  
  const [searchParams, setSearchParams] = useState({
    sort: '',
    filter: '',
    limit: 25,
    offset: 0
  });

  const totalPages = Math.ceil(total / searchParams.limit);
  const currentPage = Math.floor(searchParams.offset / searchParams.limit) + 1;

  const debouncedSearch = useCallback(
    debounce((params) => {
      dispatch(fetchProducts(params));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = { ...searchParams };
    if (id) {
      params.category = id;
    }
    debouncedSearch(params);
  }, [id, searchParams, debouncedSearch]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      filter: value,
      offset: 0 // Reset to first page on search
    }));
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      sort: value,
      offset: 0 // Reset to first page on sort
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      offset: (newPage - 1) * prev.limit
    }));
  };

  if (fetchState === 'FETCHING_PRODUCTS') {
    return <LoadingSpinner />;
  }

  if (fetchState === 'FAILED_PRODUCTS') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to fetch products. Please try again later.</p>
      </div>
    );
  }

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'k':
        return 'KADIN';
      case 'e':
        return 'ERKEK';
      default:
        return gender;
    }
  };

  const categoriesByGender = categories.reduce((acc, cat) => {
    const genderKey = cat.gender || 'other';
    if (!acc[genderKey]) {
      acc[genderKey] = [];
    }
    acc[genderKey].push(cat);
    return acc;
  }, {});

  const getCategoryName = (category) => {
    if (category.code) {
      const [, name] = category.code.split(':');
      if (name) {
        return name.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    return category.name || 'Category';
  };

  const selectedCategory = categories.find(cat => String(cat.id) === String(id));
  const categoryName = selectedCategory ? getCategoryName(selectedCategory) : category;

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? `${getGenderLabel(gender)} - ${categoryName}` : 'All Products'}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={searchParams.filter}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={searchParams.sort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by...</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:asc">Rating: Low to High</option>
            <option value="rating:desc">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="md:hidden">
        <select 
          value={id || ''}
          onChange={(e) => {
            const selectedCategory = categories.find(cat => String(cat.id) === e.target.value);
            if (selectedCategory) {
              navigate(`/shop/${selectedCategory.gender}/${selectedCategory.code?.split(':')[1] || ''}/${selectedCategory.id}`);
            } else {
              navigate('/shop');
            }
          }}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
        >
          <option value="">All Categories</option>
          {Object.entries(categoriesByGender).map(([gender, cats]) => (
            <optgroup key={gender} label={getGenderLabel(gender)}>
              {cats.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Category Sidebar */}
        <aside className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-4">
          <button
            onClick={() => navigate('/shop')}
            className={`block w-full text-left px-4 py-2 rounded-md mb-4 ${
              !id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
          
          {Object.entries(categoriesByGender).map(([gender, cats]) => (
            <div key={gender} className="space-y-2 mb-6">
              <h3 className="font-semibold text-gray-900 px-4 py-2 bg-gray-50 rounded-md">
                {getGenderLabel(gender)}
              </h3>
              {cats.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/shop/${cat.gender}/${cat.code?.split(':')[1] || ''}/${cat.id}`)}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                    String(id) === String(cat.id)
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {productList.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No products found in this category.
            </div>
          )}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}