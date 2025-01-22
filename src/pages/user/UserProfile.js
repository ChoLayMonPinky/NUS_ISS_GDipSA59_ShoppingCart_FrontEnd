// Author
// HUANG ZHENJIA A0298312B
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit2, Save } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../components/MessageBox';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null); // save original data
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

  // get user profile - finish
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/users/profile', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data.data);
          setOriginalUser(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, []);

  // input change - finish
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({...prevUser,[name]: value}));
  };

  // submit change - finish
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the form submit by it self
    try {
      const response = await axios.post('/users/update', user, { withCredentials: true });
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        addToast('Profile updated successfully', 'success', 3000);
        setIsEditing(false); // when submit successful
      } else {
        console.error('Failed to update profile:', response.status);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast(error.response.data.message, 'error', 3000);
      setUser(originalUser); // return to original data
      setIsEditing(false);  // if submit failed
    }
  };

  // cancel edit and return the origianl data - finish
  const handleCancel = () => {
    setUser(originalUser); // return to the original data
    setIsEditing(false); // exisit the edit model
  };

  if (!user) {
    // if user not load, show loading status
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/gallery" className="flex items-center text-blue-600 mb-8">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {/* editing model */}
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center text-blue-600 hover:text-blue-800">
                    <Edit2 size={20} className="mr-1" />Edit
                  </button>
                )}
              </div>
              
              {/* form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
                      <User size={16} className="inline mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={user.username || ''} // if can not get the data will use ''
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                      <Mail size={16} className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                      <Phone size={16} className="inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={user.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
                      <MapPin size={16} className="inline mr-2" />
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={user.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={user.firstName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={user.lastName || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Save size={20} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}