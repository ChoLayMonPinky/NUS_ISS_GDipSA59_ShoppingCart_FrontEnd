// Author
// HUANG ZHENJIA A0298312B

import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../../components/MessageBox';

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToast();

  // validate part
  const validateForm = () => {
    if (!form.username || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setErrorMessage('All fields are required')
      return false
    }

    // to validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setErrorMessage('Please enter a valid email address')
      alert('Please enter a valid email address');
      return false
    }

    // to validate the phone number
    const phoneRegex = /^[0-9]{8,11}$/
    if (!phoneRegex.test(form.phone)) {
      setErrorMessage('Please enter a valid phone number with 8 to 11 digits')
      return false
    }

    // to validate the phone number, whether if password same with the comfirmpassword
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match')
      return false
    }

    setErrorMessage('')
    return true
  }

  // submit method
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      const response = await axios.post('/users/register', {
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      if (response.data.statusCode === 200) {
        addToast('Successfully register!', 'success', 3000);
        navigate('/signin');
      }
    } catch (error) {
      addToast(error.response.data.message, 'error', 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left content area just a introduction part */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-blue-600">ShoppingCart</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">⚙️</span>
            <div>
              <h3 className="font-bold">Adaptable performance</h3>
              <p className="text-gray-500">
                Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">🛠️</span>
            <div>
              <h3 className="font-bold">Built to last</h3>
              <p className="text-gray-500">Experience unmatched durability that goes above and beyond with lasting investment.</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">👍</span>
            <div>
              <h3 className="font-bold">Great user experience</h3>
              <p className="text-gray-500">
                Integrate our product into your routine with an intuitive and easy-to-use interface.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">✨</span>
            <div>
              <h3 className="font-bold">Innovative functionality</h3>
              <p className="text-gray-500">Stay ahead with features that set new standards, addressing your evolving needs better than the rest.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right registration form area */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-12 bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign up</h2>
            <p className="text-sm text-gray-600 mt-1">Create your account to get started</p>
          </div>

          {/* error message username, phone, emial password or confrim password error */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <div className="flex items-center">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="mt-6">
            <div className="mb-10"></div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Sign up
              </button>
            </div>
          </form>

          {/* other sigin up method */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Sign up with Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Sign up with Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}