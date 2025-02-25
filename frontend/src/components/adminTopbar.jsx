import React, { useState, useEffect,  useContext  } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Home, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus,
  BarChart,
  Bell,
  Search
} from 'lucide-react';
import { RequestContext } from "../context/RequestContext";  // Import context
import axios from "axios";

const AdminTopBar = () => {

    const [user, setUser] = useState("");
    const { requestCount } = useContext(RequestContext);
  
    // Fetch user data from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/me", {
          withCredentials: true,
        });
        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
        console.error("Auth error:", error.response?.data || error.message);
      }
    };
    
    fetchUser();
  }, []);


    return (
      <div className="bg-white p-4 shadow-sm flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Link to="/admin/requests" className="text-gray-700 hover:text-blue-600 mr-4">
              Requests
            </Link>
            {requestCount > 0 && (
              <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {requestCount}
              </span>
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <span className="font-medium">{user.username}</span>
          </div>
        </div>
      </div>
    );
  };

export default AdminTopBar;