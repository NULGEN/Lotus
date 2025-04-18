import { Menu, Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button className="p-2 md:hidden">
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            LOTUS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link>
            <Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search size={20} />
            </button>
            <button className="p-2">
              <User size={20} />
            </button>
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