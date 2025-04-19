import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import md5 from 'md5';
import { logout } from '../store/actions/authActions';

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const gravatarUrl = user?.email 
    ? `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp&s=40` 
    : null;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button className="p-2 md:hidden">
            <Menu size={24} />
          </button>

          <Link to="/" className="text-2xl font-bold text-gray-800">
            LOTUS
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search size={20} />
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {gravatarUrl && (
                    <img
                      src={gravatarUrl}
                      alt={user.email}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2">
                <User size={20} />
              </Link>
            )}
            <button className="p-2 relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}