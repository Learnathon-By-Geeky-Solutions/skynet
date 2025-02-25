import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import MessageModal from "./vendorRequestMessageModal.jsx";
import axios from "axios";
import Notifications from "./Notifications";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/me", {
          withCredentials: true,
        });
        if (response.data) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        setUser(null);
        setIsLoggedIn(false);
        console.error("Auth error:", error.response?.data || error.message);
      }
    };
    
    fetchUser();
  }, []);

  // Handle dropdown closing when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handleSendRequest = () => {
    setIsMessageModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleMessageSubmit = async (message) => {
    if (!user) {
        console.error("No user is logged in.");
        return;
    }

    try {
        setIsPending(true);

        await axios.post("/api/admin/postVendorRequests", { message }, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Ensures cookies are sent
        });

        console.log("Message sent successfully");
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
    } 
  };


  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">Skynet</Link>
          </div>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <a href="#" className="text-gray-700 hover:text-blue-600">Bookings</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>

            {!isLoggedIn ? (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            ) : (
              <div ref={dropdownRef} className="relative inline-block">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Hello, {user?.username || "User"}</span>
                  <Notifications />
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
                    {user?.role === "user" && (
                      isPending || user?.pendingStatus === "pending" ? (
                        <button className="block w-full text-left px-4 py-2 text-gray-500 bg-gray-100 cursor-not-allowed" disabled>
                          Processing Request
                        </button>
                      ) : (
                        <button
                          onClick={handleSendRequest}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
                        >
                          Send Request
                        </button>
                      )
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} onSubmit={handleMessageSubmit} />
    </>
  );
};

export default Navbar;
