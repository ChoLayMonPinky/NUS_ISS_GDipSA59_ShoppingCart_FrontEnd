import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';

const ReviewOrderPage = () => {
  const [showAllItems, setShowAllItems] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [user, setUser] = useState(null); // current user
  const navigate = useNavigate();
  const location = useLocation();

  // get data from CheckoutPage
  const selectedCartItems = location.state?.orderData.selectedCartItems || [];
  const total = Number(location.state?.orderData.total) || 0; // make sure the total is number!!!
  const shippingDetails = location.state?.orderData.shippingDetails;
  const paymentMethod = location.state?.orderData.paymentMethod;

  // shipping
  const shippingCost = 0;
  const grandTotal = Number(total) + shippingCost; // 确保 grandTotal 是数字

  // check the session - finish
  useEffect(() =>{
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status === 200){
          setUser(response.data);
        } else {
          navigate('/signin');
        }
      } catch (error) {
        navigate('/signin')
      }
    };
    checkSession();
  }, [navigate]);

  // confetti - finish
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handlePlaceOrder = async () => {
    const data = {
      total: grandTotal,
      payment: paymentMethod,
      order: selectedCartItems
    };
    console.log(data);
    // post to the back end
    try {
      const response = await axios.post('/orders/create', data, { withCredentials: true });
      if (response.status === 201){
        setShowConfetti(true);
        setShowSuccessMessage(true);
      }
    } catch (error){
      alert('Can not place order');
    }
  };

  const displayedItems = showAllItems ? selectedCartItems : selectedCartItems.slice(0, 4);

  return (
    <div className="min-h-screen flex relative">
      {showConfetti && <Confetti />}
      {/* 左侧 - 订单摘要 */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-extrabold text-blue-600 mb-6">ShoppingCart</h2>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <p className="text-3xl font-bold mb-6">Total: ${grandTotal.toFixed(2)}</p>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {displayedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedCartItems.length > 4 && (
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
              >
                {showAllItems ? (
                  <>
                    <ChevronUp className="mr-1" size={16} />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1" size={16} />
                    Show all {selectedCartItems.length} items
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 右侧 - 订单审查 */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Review Your Order</h2>
          </div>

          <div className="flex justify-between mb-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium text-green-500">Shipping address</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
              <span className="font-medium text-blue-600">Review order</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <div className="mt-2 flex justify-between">
                <span className="text-sm text-gray-500">Products ({selectedCartItems.length} selected)</span>
                <span className="text-sm font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex justify-between">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Shipment Details</h3>
              {shippingDetails ? (
                <>
                  <p className="mt-2 text-sm text-gray-500">{shippingDetails.firstName} {shippingDetails.lastName}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {shippingDetails.address1} {shippingDetails.address2 ? `, ${shippingDetails.address2}` : ''}, {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zip}, {shippingDetails.country}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">No shipping details provided.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
              <p className="mt-1 text-sm text-gray-500">
                {paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Digital Wallet'}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => navigate('/checkout')}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="mr-2" size={16} />
              Previous
            </button>
            <button
              onClick={handlePlaceOrder}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Place Order
              <ArrowRight className="ml-2" size={16} />
            </button>
          </div>

          {showSuccessMessage && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Order Placed Successfully!</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Thank you for your order. We'll send you a confirmation email with your order details.
                    </p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      id="ok-btn"
                      onClick={() => setShowSuccessMessage(false)}
                      className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
