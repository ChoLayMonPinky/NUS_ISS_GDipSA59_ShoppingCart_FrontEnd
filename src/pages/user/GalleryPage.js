import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/UserNavBar';
import axios from 'axios';

export default function GalleryPage() {
  const [products, setProducts] = useState([]); // 用于存储从后端获取的产品数据
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate(); // 使用 useNavigate 进行页面跳转

  // check the session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/signin'); // 如果用户未登录，重定向回登录页面
        }
      } catch (error) {
        navigate('/signin'); // 如果发生错误，重定向到登录页面
      }
    };
    checkSession();
  }, [navigate]);
  
  // 使用 axios 从后端获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/product/all', { withCredentials: true }); 
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理点击商品卡片时的跳转
  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // 跳转到产品详情页
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* 使用导航栏 */}

      <div className="container mx-auto px-8 py-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md cursor-pointer"
              onClick={() => handleProductClick(product.id)} // 点击卡片时跳转到详情页
            >
              <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-2 h-12 overflow-hidden">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Category: {product.category.name}</span>
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <button className="text-blue-500 underline text-sm hover:text-blue-600 transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
