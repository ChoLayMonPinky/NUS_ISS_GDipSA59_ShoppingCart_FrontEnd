// Author
// HUANG ZHENJIA A0298312B

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/MessageBox';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation input
    if (form.username.trim() === '' || form.password.trim() === '') {
      addToast("Username or Password can not be empty!", "error", 3000)
      return;
    }
    try {
      const response = await axios.post('/users/login', { username: form.username, password: form.password}, { withCredentials: true });
      if (response.data.statusCode === 200) {
        addToast(response.data.message, "success", 3000);
        const role = response.data.data.role;
        if (role === 'USER'){
          navigate('/gallery');
        } else if (role === 'ADMIN') {
          navigate('/admin/products');
        }
      } 
    } catch (error) {
      addToast("Login Failure", "error", 3000)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* left part */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 bg-white">
        <div className="mb-6">
          {/* <img src="/logo.png" alt="Sitemark Logo" className="w-32 mb-6" /> */}
          <h2 className="text-2xl font-extrabold text-blue-600">ShoppingCart</h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">⚙️</span>
            <div>
              <h3 className="font-bold">Adaptable performance</h3>
              <p className="text-gray-500">Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.</p>
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
              <p className="text-gray-500">Integrate our product into your routine with an intuitive and easy-to-use interface.</p>
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

      {/* right part sign in form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-12 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
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
                  Sign in with Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Sign in with Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
