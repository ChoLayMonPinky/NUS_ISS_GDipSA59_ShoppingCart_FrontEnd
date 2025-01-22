// Author
// Wang Chang A0310544R
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/UserNavBar';
import { useToast } from '../../components/MessageBox';

export default function GalleryPage() {
  const [products, setProducts] = useState([]); // save product from backend
  const [isSearching, setIsSearching] = useState(false); // to handle the search status
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation(); // get current url msg
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const { addToast } = useToast();

  // check the session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/signin'); 
        }
      } catch (error) {
        navigate('/signin');
      }
    };
    checkSession();
  }, [navigate]);

  // get infor from url
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  // get product detail
  useEffect(() => {
    const fetchProducts = async () => {
      try { // show all products
        if (searchQuery.trim() === '') {
          const response = await axios.get('/product/all', { withCredentials: true });
          setProducts(response.data);
        } else { // query method
          setIsSearching(true);
          const response = await axios.get(`/product/search?query=${searchQuery}`, { withCredentials: true });
          setProducts(response.data);
          setIsSearching(false);
        }
      } catch (error) {
        addToast('Error fetching products', 'error', 3000);
        console.error('Error fetching products:', error);
      }
    };
    // set the time out for search
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500); // delay 500 ms
    return () => clearTimeout(timeoutId); // clear time out
  }, [searchQuery, addToast]);

  // set scroll - finish
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // To product detail - finish
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.filter(product => product.stock > 0) // filter the product which stock = 0
  .slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage); // total pages

  // pages change - finish
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-8 py-8 mt-16">
      {isSearching && <p>Searching...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md cursor-pointer"
              onClick={() => handleProductClick(product.id)}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={16}/>
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}>
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
