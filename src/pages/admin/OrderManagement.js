// Author
// LI WEIYI A0307246H
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react'; // Add edit and delete icons
import { useNavigate } from 'react-router-dom';

export default function OrderList() {
  const [orders, setOrders] = useState([]); // Store all orders
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null); // Store the order being edited

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Number of orders per page
  const navigate = useNavigate();


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

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/all'); // Get all orders from the backend
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call fetchOrders when the component mounts
  }, []);

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`/order/delete/${orderId}`);
      if (response.status === 200) {
        fetchOrders(); // Refresh order list after deletion
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Edit order
  const handleEditOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/order/update/${editingOrder.id}`, editingOrder);
      if (response.status === 200) {
        fetchOrders(); // Refresh order list after update
        setIsEditModalOpen(false); // Close modal
        setEditingOrder(null); // Clear edit state
      }
    } catch (error) {
      console.error('Error editing order:', error);
    }
  };

  // Update editing order state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Order List</h2>
      </div>

      {/* Order table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creation Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => { 
                      setEditingOrder(order);
                      setIsEditModalOpen(true); 
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex justify-between items-center border-t">
        <span>Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders</span>
        <div>
          {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Edit order modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-transform transform-gpu hover:scale-105 duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Order</h2>
            <form onSubmit={handleEditOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <input 
                  type="text" 
                  name="orderId" 
                  value={editingOrder?.orderId || ''} 
                  onChange={handleInputChange} 
                  disabled 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 px-3 py-2"
                  placeholder="Order ID"/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editingOrder?.name || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 px-3 py-2"
                  placeholder="Customer Name"/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Creation Time</label>
                <input 
                  type="text" 
                  name="createdAt" 
                  value={editingOrder?.createdAt || ''} 
                  onChange={handleInputChange} 
                  disabled 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 px-3 py-2"
                  placeholder="Creation Time"/>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  name="status" 
                  value={editingOrder?.status || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 px-3 py-2">
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingOrder(null); // Clear editing order state
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 border border-gray-400 rounded-md hover:bg-gray-400 transition-colors duration-300"
                >
                Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
