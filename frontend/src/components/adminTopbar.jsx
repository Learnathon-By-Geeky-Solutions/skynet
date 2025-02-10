import React, { useState, useEffect } from 'react';
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

const AdmintTopBar = () => {

    const [username, setUsername] = useState("");
  
    useEffect(() => {
      // Check if the user is logged in by looking for a token in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (user) {
        setUsername(user.username || 'Admin User'); // Use the stored username or default to 'User'
      } 
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
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{username}</span>
            </div>
          </div>
        </div>
    )
}

export default AdmintTopBar;