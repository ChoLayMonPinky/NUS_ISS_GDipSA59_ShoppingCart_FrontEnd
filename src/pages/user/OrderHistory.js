// Author
// YAO YIYANG A0294873L
// Cho Lay Mon A0310252Y
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Package, Truck, CheckCircle, XCircle, Home, Clock, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/UserNavBar';
import { useToast } from '../../components/MessageBox';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ itemId: null, rating: 0, comment: '' });
  const { addToast } = useToast();
  const navigate = useNavigate();

  // check the session - finish
  useEffect(() =>{
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status !== 200){
          navigate('/signin');
        }
      } catch (error) {
        navigate('/signin')
      }
    };
    checkSession();
  }, [navigate]);

  // get order history - finish
  useEffect(() => {
    const fetchedOrders = async() => {
        try {
            const response = await axios.get('/orders/customer');
            if (response.status === 200){
                setOrders(response.data);
            } else {
                console.error('Failed to fetch orders: Status code', response.status);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);  
        }
    }
    fetchedOrders();
  }, []);

  // 
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId); 
  };

  // statusInfo
  const getStatusInfo = (status) => {
    const statusInfo = {
      PENDING: { icon: <Package className="w-5 h-5" />, text: 'Pending' },
      CONFIRMED: { icon: <CheckCircle className="w-5 h-5" />, text: 'Confirmed' },
      SHIPPED: { icon: <Truck className="w-5 h-5" />, text: 'Shipped' },
      DELIVERED: { icon: <CheckCircle className="w-5 h-5" />, text: 'Delivered' },
      CANCELLED: { icon: <XCircle className="w-5 h-5" />, text: 'Cancelled' },
    };
    return statusInfo[status] || { icon: <XCircle className="w-5 h-5" />, text: 'Unknown' };
  };

  const OrderStatus = ({ status }) => {
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const currentIndex = statuses.indexOf(status);

    return (
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mt-4">
        {statuses.map((step, index) => {
          const { icon, text } = getStatusInfo(step);
          const isActive = index <= currentIndex;
          const isCancelled = status === 'CANCELLED';
          return (
            // 
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCancelled ? 'bg-red-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  {icon}
                </div>
                <span className={`mt-2 text-xs ${isCancelled ? 'text-red-500' : isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                  {text}
                </span>
              </div>
              {index < statuses.length - 1 && (
                <div className={`flex-1 h-1 ${isCancelled ? 'bg-red-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // set the pages 
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // change page - finish
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // open review modal - finish
  const openReviewModal = (itemId) => {
    setReviewData({ itemId, rating: 0, comment: '' });
    setIsReviewModalOpen(true);
  };

  // close - finish
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewData({ itemId: null, rating: 0, comment: '' });
  };

  // rating - finish
  const handleRatingChange = (newRating) => {
    setReviewData({ ...reviewData, rating: newRating });
  };

  // comment change - finish
  const handleCommentChange = (event) => {
    setReviewData({ ...reviewData, comment: event.target.value });
  };

  // submit - finish
  const submitReview = async () => {
    const reviewPayload = {
      productId: reviewData.itemId,  
      rating: reviewData.rating,    
      comment: reviewData.comment    
    };
    try {
      // console.log(reviewPayload)
      const response = await axios.post('/reviews/add', reviewPayload);
      if (response.status === 200) {
        // console.log('Review submitted successfully');
        addToast('Review submitted successfully', 'success', 3000);
      } else {
        // console.error('Failed to submit review:', response.status);
        addToast('Failed to submit review', 'error', 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      addToast('Error submitting review', 'error', 3000);
    }
    closeReviewModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
      <div className="flex-grow container mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {currentOrders.map((order) => (
            <div key={order.orderId} className="border-b border-gray-200 last:border-b-0 transition duration-150 ease-in-out">
              <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderDetails(order.orderId)}>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-lg text-gray-700">Order #{order.orderId}</span>
                  <span className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg text-gray-900">${order.totalPrice.toFixed(2)}</span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-150">
                    {expandedOrder === order.orderId ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                </div>
              </div>
              {expandedOrder === order.orderId && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <OrderStatus status={order.status} />
                  
                  {/* Address and Time Information */}
                  <div className="mt-4">
                    <div className="flex items-center text-gray-600 space-x-2">
                      <Home className="w-5 h-5" />
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 space-x-2 mt-2">
                      <Clock className="w-5 h-5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-700 mt-6 mb-4">Order Details</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.productName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-700">${item.subtotal.toFixed(2)}</span>
                          {['PENDING', 'DELIVERED', 'SHIPPED'].includes(order.status) && (
                            <button
                              onClick={() => openReviewModal(item.productId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors duration-150 flex items-center space-x-1">
                              <Star size={14} />
                              <span>Review</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Rating:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRatingChange(star)} className="focus:outline-none">
                    <Star size={24} className={`${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-150`}
                      fill={star <= reviewData.rating ? 'currentColor' : 'none'}/>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">Comment:</label>
              <textarea
                id="comment" value={reviewData.comment}onChange={handleCommentChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4">
              </textarea>
            </div>
            {/* button */}
            <div className="flex justify-end space-x-2">
              <button onClick={closeReviewModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-150">
                Cancel
              </button>
              <button onClick={submitReview} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
