import React, { useState } from 'react';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login logic here
    console.log('Login submitted', formData);
  };

  const handleGoogleLogin = () => {
    // Google login logic
    console.log('Initiating Google Login');
    // Implement Google OAuth flow
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
          >
            Login
          </button>
        </form>

         {/* Google Login Button */}
         <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition duration-300"
        >
          <Chrome className="mr-2" size={20} />
          Login with Google
        </button>

        <div className="text-center mt-4 space-y-2">
          <a href="#" className="text-blue-600 hover:underline block">Forgot Password?</a>
          <Link to="/signup" className="text-blue-600 hover:underline block">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;