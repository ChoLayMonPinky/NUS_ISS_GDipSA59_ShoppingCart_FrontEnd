import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/UserNavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); 
  const [selectedItems, setSelectedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status === 200) {
          console.log(response.data)
          setUser(response.data);
        } else {
          navigate('/signin');
        }
      } catch (error) {
        navigate('/signin');
      }
    };
    checkSession();
  }, [navigate]);

  // 从后端获取购物车数据
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart', { withCredentials: true });
        setCartItems(response.data);
        console.log(response.data);
        // 初始化选中状态
        const initialSelected = {};
        response.data.forEach(item => {
          initialSelected[item.productId] = false;
        });
        setSelectedItems(initialSelected);
      } catch (error) {
        console.error('获取购物车数据失败:', error);
      }
    };

    fetchCartItems();
  }, []);

    // 计算选中的商品总价
    const calculateTotal = () => {
      return cartItems.reduce((total, item) => 
        selectedItems[item.productId] ? total + (item.price * item.quantity) : total, 0
      ).toFixed(2);
    };

  // get all selected items
  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems[item.productId]);
  }

  // jump to checkoutpage, and send data
  const handleCheckOut = () => {
    const selectedCartItems = getSelectedItems();
    const total = calculateTotal();
    if (selectedCartItems.length > 0){
      navigate('/checkout', {state: {selectedCartItems, total}});
    } else{
      alert("Select one product");
    }
  }

  // 更新数量
  const updateQuantity = async (id, newQuantity) => {
    try {
      await axios.put(`/cart/item/${id}`, { quantity: newQuantity }, { withCredentials: true });
      setCartItems(cartItems.map(item => 
        item.productId === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      ));
    } catch (error) {
      console.error('更新购物车数量失败:', error);
    }
  };

  // 删除商品
  const removeItem = async (id) => {
    try {
      await axios.delete(`/cart/item/${id}`, { withCredentials: true });
      setCartItems(cartItems.filter(item => item.productId !== id));
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[id];
      setSelectedItems(newSelectedItems);
    } catch (error) {
      console.error('删除购物车项失败:', error);
    }
  };

  // 单个选中框切换
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every(Boolean);
    const newSelectedItems = {};
    cartItems.forEach(item => {
      newSelectedItems[item.productId] = !allSelected; // 根据当前全选状态决定每个商品的选中状态
    });
    setSelectedItems(newSelectedItems);
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex items-center p-4 border-b">
            <input 
              type="checkbox" 
              className="mr-4" 
              onChange={toggleSelectAll} 
              checked={cartItems.length > 0 && Object.values(selectedItems).every(Boolean)} 
            />
            <div className="flex-grow">Product</div>
            <div className="w-24 text-center">Unit Price</div>
            <div className="w-32 text-center">Quantity</div>
            <div className="w-24 text-center">Total Price</div>
            <div className="w-24 text-center">Action</div>
          </div>

          {currentItems.map(item => (
            <div key={item.productId} className="flex items-center p-4 border-b">
              <input
                type="checkbox"
                className="mr-4"
                checked={selectedItems[item.productId] || false} // 单个商品的选中状态
                onChange={() => toggleSelectItem(item.productId)}
              />
              <div className="flex-grow flex">
                <img 
                  src={`http://localhost:8080${item.imageUrl || ''}`} 
                  alt={item.productName || 'Product'} 
                  className="w-20 h-20 object-cover mr-4" 
                />
                <div>
                  <h3 className="font-semibold">{item.productName || 'Unnamed Product'}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.product.description || 'No description available'}</p>
                  <p className="text-xs text-gray-500 mt-1">Category: {item.product.category.name || 'No category'}</p>
                </div>
              </div>
              <div className="w-24 text-center">${item.price?.toFixed(2) || 'N/A'}</div>
              <div className="w-32 flex justify-center items-center">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 border rounded">
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={item.quantity || 1}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                  className="w-12 text-center mx-1 border rounded"
                />
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 border rounded">
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-center font-semibold text-blue-600">${(item.price * item.quantity)?.toFixed(2) || 'N/A'}</div>
              <div className="w-24 text-center">
                <button onClick={() => removeItem(item.productId)} className="text-gray-500 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 mb-8">
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

      <div className="bg-white shadow-md">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={cartItems.length > 0 && Object.values(selectedItems).every(Boolean)} 
              onChange={toggleSelectAll}
              className="mr-3 w-5 h-5"
            />
            <button onClick={toggleSelectAll} className="text-gray-600 hover:text-blue-600 text-base">
              Select All ({cartItems.length})
            </button>
            <button className="ml-6 text-gray-600 hover:text-blue-600 text-base">Delete</button>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-lg">Total ({selectedCount} items): </span>
            <span className="text-3xl font-bold text-blue-600 mr-6">${calculateTotal()}</span>
            <button 
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold">
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
