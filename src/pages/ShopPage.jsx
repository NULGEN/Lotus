import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProducts, fetchCategories } from '../store/actions/productActions';

export default function ShopPage() {
  const dispatch = useDispatch();
  const { productList, categories, fetchState, total } = useSelector((state) => state.products);
  const { gender, category, id } = useParams();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(id));
  }, [dispatch, id]);

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

  // Group categories by gender
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? `${getGenderLabel(gender)} - ${categoryName}` : 'All Products'}
        </h1>
        <p className="text-gray-600">Showing {productList.length} of {total} products</p>
      </div>

      {/* Mobile Category Filter */}
      <div className="md:hidden">
        <select 
          value={id || ''}
          onChange={(e) => {
            const selectedCategory = categories.find(cat => String(cat.id) === e.target.value);
            if (selectedCategory) {
              window.location.href = `/shop/${selectedCategory.gender}/${selectedCategory.code?.split(':')[1] || ''}/${selectedCategory.id}`;
            } else {
              window.location.href = '/shop';
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
          <a
            href="/shop"
            className={`block w-full text-left px-4 py-2 rounded-md mb-4 ${
              !id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Categories
          </a>
          
          {Object.entries(categoriesByGender).map(([gender, cats]) => (
            <div key={gender} className="space-y-2 mb-6">
              <h3 className="font-semibold text-gray-900 px-4 py-2 bg-gray-50 rounded-md">
                {getGenderLabel(gender)}
              </h3>
              {cats.map(cat => (
                <a
                  key={cat.id}
                  href={`/shop/${cat.gender}/${cat.code?.split(':')[1] || ''}/${cat.id}`}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                    String(id) === String(cat.id)
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getCategoryName(cat)}
                </a>
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
        </div>
      </div>
    </div>
  );
}