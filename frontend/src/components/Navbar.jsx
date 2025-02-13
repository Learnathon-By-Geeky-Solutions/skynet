// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//     return(
//         <header className="bg-white shadow-md">
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//                 <div className="text-2xl font-bold text-blue-600"><Link to="/">Skynet</Link></div>
//                 <nav className="space-x-4">
//                 <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
//                 <a href="#" className="text-gray-700 hover:text-blue-600">Bookings</a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
//                 </nav>
//             </div>
//         </header>
//     )
// }

// export default Navbar;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      setIsLoggedIn(true);

      setUsername(user.username || 'User'); // Use the stored username or default to 'User'
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername("");
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">Skynet</Link>
        </div>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Bookings
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/signup" className="text-gray-700 hover:text-blue-600">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="relative inline-block">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Hello, {username}</span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Toggle menu"
                  >
                    <Menu className="w-5 h-5 text-gray-700 hover:text-blue-600 cursor-pointer" />
                  </button>
                </div>                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;