// Author
// HUANG ZHENJIA A0298312B
// LI WEIYI A0307246H
import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/UserNavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/MessageBox';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]); 
  const [selectedItems, setSelectedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // get session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        // get session
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status === 200) {
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

  // get cart data from backend - finish
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart', { withCredentials: true });
        setCartItems(response.data);
        // console.log(response.data);
        // initial select status
        const initialSelected = {};
        response.data.forEach(item => {
          initialSelected[item.productId] = false;
        });
        setSelectedItems(initialSelected);
      } catch (error) {
        addToast('can not get data from backend, error: ' + error, 'error', 3000);
        console.error('Get cart information failed:', error);
      }
    };

    fetchCartItems();
  }, []);

  // calculate the total price - finish
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      selectedItems[item.productId] ? total + (item.price * item.quantity) : total, 0).toFixed(2);
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
      // alert("Select one product");
      addToast('Please select at least one product', 'warning', 3000);
    }
  }

  // update quantity - TODO
  const updateQuantity = async (itemId, id, newQuantity) => {
    try {
      const response = await axios.put(`/cart/item/${id}`, { cartItemId: itemId, quantity: newQuantity }, { withCredentials: true });
      if (response.data.statusCode === 200) {
        setCartItems(cartItems.map(item => 
          item.productId === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
        ));
      } else if (response.data.statusCode === 409){
        addToast(response.data.message, 'error', 3000)
      }
    } catch (error) {
      addToast(error.response.data.message, 'error', 3000);
    }
  };

  // delete product - TODO
  const removeItem = async (id) => {
    try {
      const response = await axios.delete(`/cart/item/${id}`, { withCredentials: true });
      if (response.status === 200) {
        // 使用不可变数据结构更新状态
        setCartItems((prevItems) => prevItems.filter(item => item.productId !== id));
  
        // update selectedItems status
        setSelectedItems((prevSelectedItems) => {
          const newSelectedItems = { ...prevSelectedItems };
          delete newSelectedItems[id];
          return newSelectedItems;
        });
  
        addToast('Item deleted successfully', 'success', 3000);
      }
    } catch (error) {
      addToast('Cannot delete the cart item', 'error', 3000);
      console.error('Failed to delete cart item:', error);
    }
  };
  
  // change select box - finish
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // select all/ cancel all - updated
  const toggleSelectAll = () => {
    const allSelected = cartItems
      .filter(item => item.quantity > 0)
      .every(item => selectedItems[item.productId]);

    const newSelectedItems = {};
    cartItems.forEach(item => {
      if (item.quantity > 0) {
        newSelectedItems[item.productId] = !allSelected; // Toggle selection for items with quantity > 0
      } else {
        newSelectedItems[item.productId] = false; // Items with quantity 0 should remain unselected
      }
    });
    setSelectedItems(newSelectedItems);
  };


  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  // handle page change - finish
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
              checked={
                cartItems.length > 0 && 
                cartItems.some(item => item.quantity > 0) && 
                cartItems.filter(item => item.quantity > 0).every(item => selectedItems[item.productId])
              }
            />
            <div className="flex-grow">Product</div>
            <div className="w-24 text-center">Unit Price</div>
            <div className="w-32 text-center">Quantity</div>
            <div className="w-24 text-center">Total Price</div>
            <div className="w-24 text-center">Action</div>
          </div>

          {currentItems.map(item => (
            <div key={item.productId} className={`flex items-center p-4 border-b ${item.quantity === 0 ? 'bg-gray-100 text-gray-500' : ''}`}>
              <input
                type="checkbox"
                className="mr-4"
                checked={selectedItems[item.productId] || false} // one product status
                onChange={() => toggleSelectItem(item.productId)}
                disabled={item.quantity === 0}
              />
              <div className="flex-grow flex">
                <img 
                  src={`http://localhost:8080${item.imageUrl || ''}`} 
                  alt={item.productName || 'Product'} 
                  className="w-20 h-20 object-cover mr-4" 
                />
                <div>
                  <h3 className="font-semibold">{item.productName || 'Unnamed Product'}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description || 'No description available'}</p>
                  <p className="text-xs text-gray-500 mt-1">Category: {item.category || 'No category'}</p>
                </div>
              </div>
              <div className="w-24 text-center">${item.price?.toFixed(2) || 'N/A'}</div>
              <div className="w-32 flex justify-center items-center">
                <button 
                  onClick={() => updateQuantity(item.cartItemId, item.productId, item.quantity - 1)} 
                  disabled={item.quantity === 0}
                  className="p-1 border rounded">
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  className="w-12 text-center mx-1 border rounded"
                  disabled={item.quantity === 0}/>
                <button onClick={() => updateQuantity(item.cartItemId, item.productId, item.quantity + 1)} 
                  // disabled={item.quantity === 0}
                  className="p-1 border rounded">
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-center font-semibold text-blue-600">${(item.price * item.quantity)?.toFixed(2) || 'N/A'}</div>
              <div className="w-24 text-center">
                <button onClick={() => removeItem(item.cartItemId)} className="text-gray-500 hover:text-red-500">
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
              className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
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

      <div className="bg-white shadow-md">
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={
                cartItems.length > 0 && 
                cartItems.some(item => item.quantity > 0) && 
                cartItems.filter(item => item.quantity > 0).every(item => selectedItems[item.productId])
              }
              onChange={toggleSelectAll}
              className="mr-3 w-5 h-5"/>
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
