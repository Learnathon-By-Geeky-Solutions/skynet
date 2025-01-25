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


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      // If the token exists, fetch user data (e.g., username)
      // Here, you could make an API request to get the user's details
      // For now, assume the username is stored in localStorage as well
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername || 'User'); // Use the stored username or default to 'User'
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
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
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">Hello, {username}</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;