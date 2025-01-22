// Author
// Siti Alifah Binte Yahya A0295324B
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, DollarSign, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../components/MessageBox';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showAllItems, setShowAllItems] = useState(false);
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '',
    address1: '', address2: '',
    city: '', country: '', zip: ''
  });

  // get the detail from CartPage
  const selectedCartItems = location.state?.selectedCartItems || [];
  // console.log(selectedCartItems);

  // calculate total price
  const total = location.state?.total || 0;

  const displayedItems = showAllItems ? selectedCartItems : selectedCartItems.slice(0, 4);

  // handel form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // next button
  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.address1 || !formData.city || !formData.country || !formData.zip) {
      addToast("Please fill in all the required fields.", "error", 3000);
      return;
    } else {
      const orderData = {
        selectedCartItems,
        total,
        shippingDetails: formData,
        paymentMethod
      };
      navigate('/placeOrder', { state: { orderData } });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Order summary */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-extrabold text-blue-600 mb-6">ShoppingCart</h2>
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <p className="text-3xl font-bold mb-6">Total: ${total}</p>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {displayedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p> {/* show item quantity */}
                  </div>
                </div>
              ))}
            </div>
            {selectedCartItems.length > 4 && (
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
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

      {/* Right side - Shipping address form and payment method */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Checkout</h2>
          </div>

          <form className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input id="firstName" name="firstName" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="First Name" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input id="lastName" name="lastName" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Last name" onChange={handleInputChange} />
              </div>
              <div className="col-span-2">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
                <input id="address1" name="address1" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Address line 1" onChange={handleInputChange} />
              </div>
              <div className="col-span-2">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address line 2 (optional)</label>
                <input id="address2" name="address2" type="text" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Address line 2 (optional)" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input id="city" name="city" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="City" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input id="country" name="country" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Country" onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal code</label>
                <input id="zip" name="zip" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Zip / Postal code" onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-md text-sm ${
                    paymentMethod === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                  <CreditCard className="mb-1" size={20} />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-md text-sm ${
                    paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                  <DollarSign className="mb-1" size={20} />
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('digital_wallet')}
                  className={`flex flex-col items-center justify-center p-2 border rounded-md text-sm ${
                    paymentMethod === 'digital_wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                  <Wallet className="mb-1" size={20} />
                  Digital Wallet
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <ArrowLeft className="mr-2" size={16} />
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Next
                <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
