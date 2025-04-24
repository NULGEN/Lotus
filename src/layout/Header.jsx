import { Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../store/actions/authActions';
import { fetchCategories } from '../store/actions/productActions';
import { toggleCart } from '../store/actions/cartActions';
import CartDropdown from '../components/CartDropdown';

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.products);
  const { cart, isOpen } = useSelector((state) => state.cart);
  const [showCategories, setShowCategories] = useState(false);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

  const categoriesByGender = categories.reduce((acc, category) => {
    const gender = category.gender === 'k' ? 'KADIN' : category.gender === 'e' ? 'ERKEK' : category.gender;
    if (!acc[gender]) {
      acc[gender] = [];
    }
    acc[gender].push(category);
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

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              LOTUS
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <div 
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="text-gray-600 hover:text-gray-900">
                  Shop
                </button>
                {showCategories && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg p-6 w-[600px] -ml-4 border border-gray-100 z-50">
                    <div className="grid grid-cols-2 gap-8">
                      {Object.entries(categoriesByGender).map(([gender, cats]) => (
                        <div key={gender} className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                            {gender}
                          </h3>
                          <ul className="space-y-2">
                            {cats.map(cat => (
                              <li key={cat.id}>
                                <Link 
                                  to={`/shop/${cat.gender}/${cat.code?.split(':')[1] || ''}/${cat.id}`}
                                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block py-1"
                                >
                                  {getCategoryName(cat)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link to="/team" className="text-gray-600 hover:text-gray-900">
                Team
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900">
              <Search size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-8 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-8 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-8 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="relative">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <CartDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}