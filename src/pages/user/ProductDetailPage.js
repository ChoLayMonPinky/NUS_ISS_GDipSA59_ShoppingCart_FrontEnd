// Author
// Wang Chang A0310544R
// Cho Lay Mon A0310252Y
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Plus, Minus } from 'lucide-react';
import Navbar from '../../components/UserNavBar';
import { useToast } from '../../components/MessageBox';

export default function ProductDetail() {
  const { id } = useParams(); // get id from url
  const [product, setProduct] = useState(null); // product
  const [reviews, setReviews] = useState(null); // review
  const [quantity, setQuantity] = useState(1); // quantity
  const [loading, setLoading] = useState(true); // loading status
  const [error, setError] = useState(null); // error status
  const [user, setUser] = useState(null); // current user
  const [averageRating, setAverageRating] = useState(0); // average rating
  const navigate = useNavigate();
  const { addToast } = useToast();

  // check the session - finish
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/users/session', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data)  // get current User
        } else {
          navigate('/signin'); // if user not login
        }
      } catch (error) {
        navigate('/signin'); // if error happen
      }
    };
    checkSession();
  }, [navigate]);

  // get detial data from backend - finish
  // if id change, will run useEffect
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`); // get product detail from backend
        setProduct(response.data);
        setLoading(false); // loading finish
      } catch (error) {
        setError('Can not get product data');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]); // when id changed, reget the detail

  // get the review by product id - finish
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/${id}`);
        const fetchedReviews = response.data.data;
        setReviews(fetchedReviews);
        // Calculate average rating
        if (fetchedReviews && fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
          const avgRating = totalRating / fetchedReviews.length;
          setAverageRating(avgRating.toFixed(1)); // Keep one decimal place
        } else {
          setAverageRating(0);
        }
        setLoading(false);
      } catch (error) {
        setError('Can not get product review');
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);
  

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append('productId', product.id);
      formData.append('quantity', quantity);
      const response = await axios.post('/cart/add', formData, {withCredentials: true});
      if (response.status === 200) {
        addToast('Product already added to the cart!', 'success', 3000)
      }
    } catch (error) {
      addToast('Cannot add product to cart', 'error', 3000)
    }
  };

  // increase the quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // decrease the quantity
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  // loading page
  if (loading) {
    return <div>loading...</div>;
  }

  // error page
  if (error) {
    return <div>{error}</div>;
  }

  // if can't find product
  if (!product) {
    return <div>can't find product</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* navigation bar */}
      <Navbar />
      {/* product detail */}
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* image */}
          <div>
            <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
          </div>

          {/* detail */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-600 mr-2">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">({product.stock} stock)</span>
            </div>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className={i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({reviews ? reviews.length : 0} comments)
              </span> {/* confirm whether reviews exist */}
            </div>
            <div className="flex items-center mb-6">
              <button onClick={decrementQuantity} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-l">
                <Minus size={16} />
              </button>
              <span className="bg-gray-100 text-gray-800 px-4 py-1">{quantity}</span>
              <button onClick={incrementQuantity} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-r">
                <Plus size={16} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-600 transition-colors duration-300">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Review */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">{review.username}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  {/* <p className="text-sm text-gray-500 mt-2">{review.date}</p> */}
                </div>
              ))
            ) : (
              <div>Not Review</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
