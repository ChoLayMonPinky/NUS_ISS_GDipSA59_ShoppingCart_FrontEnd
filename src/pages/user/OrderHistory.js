import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Package, Truck, CheckCircle, XCircle, Star } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/UserNavBar'; // 确保 Navbar 路径正确

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null); // 当前展开的订单 ID
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ productId: null, rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // 处理提交状态
  const [submissionMessage, setSubmissionMessage] = useState(null); // 显示成功或错误消息

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders/all');
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          console.error('获取订单失败：状态码', response.status);
        }
      } catch (error) {
        console.error('获取订单时出错：', error);
      }
    };
    fetchOrders();
  }, []);

  // 切换订单详情显示
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId); // 仅展开一个订单
  };

  // 获取订单状态信息
  const getStatusInfo = (status) => {
    const statusInfo = {
      PENDING: { icon: <Package className="w-5 h-5" />, text: '待处理' },
      Processing: { icon: <Package className="w-5 h-5" />, text: '处理中' },
      Shipped: { icon: <Truck className="w-5 h-5" />, text: '已发货' },
      OutForDelivery: { icon: <Truck className="w-5 h-5" />, text: '配送中' },
      Delivered: { icon: <CheckCircle className="w-5 h-5" />, text: '已送达' },
      Cancelled: { icon: <XCircle className="w-5 h-5" />, text: '已取消' },
    };
    return statusInfo[status] || { icon: <XCircle className="w-5 h-5" />, text: '未知' };
  };

  // 订单状态进度条组件
  const OrderStatus = ({ status }) => {
    const statuses = ['PENDING', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered'];
    const currentIndex = statuses.indexOf(status);

    return (
      <div className="flex items-center justify-between w-full max-w-2xl mx-auto mt-4">
        {statuses.map((step, index) => {
          const { icon, text } = getStatusInfo(step);
          const isActive = index <= currentIndex;
          const isCancelled = status === 'Cancelled';

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCancelled
                      ? 'bg-red-500'
                      : isActive
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                >
                  {icon}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isCancelled
                      ? 'text-red-500'
                      : isActive
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {text}
                </span>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    isCancelled
                      ? 'bg-red-500'
                      : isActive
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 打开评价模态框
  const openReviewModal = (productId) => {
    setReviewData({ productId, rating: 0, comment: '' });
    setIsReviewModalOpen(true);
    setSubmissionMessage(null); // 重置任何先前的消息
  };

  // 关闭评价模态框
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewData({ productId: null, rating: 0, comment: '' });
    setIsSubmitting(false);
    setSubmissionMessage(null);
  };

  // 处理评分变化
  const handleRatingChange = (newRating) => {
    setReviewData({ ...reviewData, rating: newRating });
  };

  // 处理评论变化
  const handleCommentChange = (event) => {
    setReviewData({ ...reviewData, comment: event.target.value });
  };

  // 提交评价
  const submitReview = async () => {
    const { productId, rating, comment } = reviewData;

    // 基本验证
    if (rating === 0) {
      setSubmissionMessage({ type: 'error', text: '请提供评分。' });
      return;
    }

    if (comment.trim() === '') {
      setSubmissionMessage({ type: 'error', text: '请填写评论。' });
      return;
    }

    const reviewPayload = {
      productId, // 确保这与后端预期匹配
      rating,
      comment,
    };

    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      const response = await axios.post('/reviews/add', reviewPayload);
      if (response.status === 200) {
        setSubmissionMessage({ type: 'success', text: 'Submit successfully！' });
        // 可选：您可以刷新订单或相应地更新 UI
      } else {
        setSubmissionMessage({ type: 'error', text: `Submit failure：${response.status}` });
        console.error('Submit failure：', response.status);
      }
    } catch (error) {
      setSubmissionMessage({ type: 'error', text: 'Submit failure' });
      console.error('Submit failure：', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-8 py-8">
        <h1 className="text-2xl font-extrabold mb-6">订单历史</h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {currentOrders.map((order) => (
            <div key={order.orderId} className="border-b border-gray-200 last:border-b-0 transition duration-150 ease-in-out">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderDetails(order.orderId)}
              >
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-lg text-gray-700">订单 #{order.orderId}</span>
                  <span className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
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
                  <h3 className="font-semibold text-lg text-gray-700 mt-6 mb-4">订单详情</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.productName}</p>
                            <p className="text-sm text-gray-600">数量：{item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-700">${item.subtotal.toFixed(2)}</span>
                          {['PENDING', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered'].includes(order.status) && (
                            <button
                              onClick={() => openReviewModal(item.productId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors duration-150 flex items-center space-x-1"
                            >
                              <Star size={14} />
                              <span>评价</span>
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

        {/* 分页控件 */}
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

      {/* 评价模态框 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeReviewModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">撰写评价</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">评分：</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } transition-colors duration-150`}
                      fill={star <= reviewData.rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">评论：</label>
              <textarea
                id="comment"
                value={reviewData.comment}
                onChange={handleCommentChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="在这里写下您的评价..."
              ></textarea>
            </div>
            {submissionMessage && (
              <div
                className={`mb-4 p-2 rounded ${
                  submissionMessage.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {submissionMessage.text}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-150"
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                onClick={submitReview}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
