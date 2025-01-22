// Author
// HUANG ZHENJIA A0298312B

import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRoundPen, House, ScrollText, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useToast } from './MessageBox';

export default function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '') {
      navigate(`/gallery?search=${encodeURIComponent(query)}`);
    }
  };

  // log out function - finish
  const handleLogout = async () => {
    try {
      const response = await axios.post('/users/logout', {}, { withCredentials: true });
      if (response.status === 200) { // if log out successful
        addToast('Successfully logged out', 'success', 3000);
        navigate('/signin');
      } else {
        addToast('Failed to log out', 'error', 3000);
      }
    } catch (error) {
      addToast('Logout failed, please try again', 'error', 3000);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-3xl font-extrabold text-blue-600">ShoppingCart</Link>
          <div className="flex items-center space-x-4">
            {/* search bar */}
            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-40'}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search foods..."
                className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* home link */}
            <Link to="/gallery" className="text-gray-600 hover:text-blue-600">
              <House size={20} />
            </Link>

            {/* user dropdown */}
            <div className="relative">
              <button 
                className="text-gray-600 hover:text-blue-600"
                onClick={toggleDropdown} // Toggle dropdown on click
              >
                <User size={20} />
              </button>
              
              {/* dropdown menu */}
              {isDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10"
                  style={{ top: '100%' }}
                >
                  <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                    <UserRoundPen size={16} className="mr-2 inline" /> Profile
                  </Link>
                  <Link to="/cart" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                    <ShoppingCart size={16} className="mr-2 inline" /> Cart
                  </Link>
                  <Link to="/history" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                    <ScrollText size={16} className="mr-2 inline" /> Order History
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  >
                    <LogOut size={16} className="mr-2 inline" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
