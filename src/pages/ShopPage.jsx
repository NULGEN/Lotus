import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../store/actions/productActions';

export default function ShopPage() {
  const dispatch = useDispatch();
  const { productList, categories, fetchState } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { gender, category, id } = useParams();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (category && id) {
      setSelectedCategory(id);
    }
  }, [category, id]);

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

  const filteredProducts = selectedCategory === 'all' 
    ? productList 
    : productList.filter(product => product.category_id === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Mobile Category Filter */}
      <div className="md:hidden">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
        >
          <option value="all">All Categories</option>
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
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-4 py-2 rounded-md mb-4 ${
              selectedCategory === 'all' 
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
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                    selectedCategory === cat.id
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
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}