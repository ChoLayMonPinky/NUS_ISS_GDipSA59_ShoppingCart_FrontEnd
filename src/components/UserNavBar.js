// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, Search, ShoppingCart, User, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-extrabold text-blue-600">Food Delights</Link>
          <div className="flex items-center space-x-4">
            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-40'}`}>
              <input
                type="text"
                placeholder="Search foods..."
                className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600">
              <User size={20} />
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-blue-600">
              <ScrollText size={20} />
            </Link>
            <button onClick={toggleLogin} className="text-gray-600 hover:text-blue-600">
              {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
