// Author
// HUANG ZHENJIA A0298312B
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, ChartColumnStacked, Menu, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // check the session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        console.log(response);
        if (response.status !== 200) {
          navigate('/signin'); 
        }
        if (response.data.data.role !== 'ADMIN'){
          navigate('/gallery')
        }
      } catch (error) {
        navigate('/signin');
      }
    };
    checkSession();
  }, [navigate]);

  const navItems = [
    { path: '/admin/categories', icon: <ChartColumnStacked size={24} />, label: 'Category' },
    { path: '/admin/products', icon: <Package size={24} />, label: 'Product' },
    { path: '/admin/orders', icon: <ShoppingCart size={24} />, label: 'Order' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white text-gray-800 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && <h2 className="text-2xl font-bold text-blue-600">Admin</h2>}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 transition-colors duration-200 ${location.pathname === item.path? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
              {item.icon}
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;