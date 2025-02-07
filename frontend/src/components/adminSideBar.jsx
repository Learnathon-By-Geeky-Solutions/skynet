import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const adminSideBar = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">Skynet</h1>
            <p className="text-gray-500">Admin Panel</p>
            </div>

            <nav className="mt-8">
            <a 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <BarChart className="mr-3" size={20} />
                Dashboard
            </a>
            <a 
                onClick={() => setActiveTab('rooms')}
                className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'rooms' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Home className="mr-3" size={20} />
                Rooms
            </a>
            <a 
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Calendar className="mr-3" size={20} />
                Bookings
            </a>
            <a 
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Users className="mr-3" size={20} />
                Users
            </a>
            <a 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-6 py-3 cursor-pointer ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                <Settings className="mr-3" size={20} />
                Settings
            </a>
            </nav>

            <div className="absolute bottom-0 w-64 p-4">
            <button className="flex items-center text-gray-700 hover:text-red-600">
                <LogOut className="mr-2" size={20} />
                Logout
            </button>
            </div>
        </div>
    )
}

export default adminSideBar;