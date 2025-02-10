import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const AdminSideBar = () => {
    const location = useLocation();
    // const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate(); 

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        navigate('/login'); // Redirect to login page after logout
      };
    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">Skynet</h1>
            <p className="text-gray-500">Admin Panel</p>
            </div>

            <nav className="mt-8">
            <Link
                to="/admin/dashboard"
                className={`flex items-center px-6 py-3 cursor-pointer ${location.pathname === '/admin/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <BarChart className="mr-3" size={20} />
                Dashboard
            </Link>
            <Link
                to="/admin/rooms"
                className={`flex items-center px-6 py-3 cursor-pointer ${location.pathname === '/admin/rooms' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Home className="mr-3" size={20} />
                Rooms
            </Link>
            <Link 
                to="/admin/bookings"
                className={`flex items-center px-6 py-3 cursor-pointer ${location.pathname === '/admin/bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Calendar className="mr-3" size={20} />
                Bookings
            </Link>
            <Link 
                to="/admin/users"
                className={`flex items-center px-6 py-3 cursor-pointer ${location.pathname === '/admin/users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Users className="mr-3" size={20} />
                Users
            </Link>
            <a 
    
                className={`flex items-center px-6 py-3 cursor-pointer ${location.pathname === '/admin/settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Settings className="mr-3" size={20} />
                Settings
            </a>
            </nav>

            <div className="absolute bottom-0 w-64 p-4">
            <button className="flex items-center text-gray-700 hover:text-red-600" onClick={handleLogout}>
                <LogOut className="mr-2" size={20} />
                Logout
            </button>
            </div>
        </div>
    )
}

export default AdminSideBar;