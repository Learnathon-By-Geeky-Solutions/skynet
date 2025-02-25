import React, { useState } from 'react';
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
import SideBar from '../components/adminSideBar.jsx';
import TopBar from '../components/adminTopbar.jsx';

const AdminDashboard = () => {
  // Sample data
  const recentBookings = [
    { id: 1, room: "Deluxe Suite", guest: "John Doe", checkIn: "2024-02-15", checkOut: "2024-02-18", status: "Confirmed" },
    { id: 2, room: "Standard Room", guest: "Jane Smith", checkIn: "2024-02-16", checkOut: "2024-02-17", status: "Pending" },
  ];

  const rooms = [
    { id: 1, name: "Deluxe Suite", status: "Occupied", price: "$200/night" },
    { id: 2, name: "Standard Room", status: "Available", price: "$100/night" },
    { id: 3, name: "Family Room", status: "Maintenance", price: "$150/night" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <TopBar />

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Total Bookings</h3>
              <p className="text-2xl font-bold">1,234</p>
              <span className="text-green-500 text-sm">+12% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Available Rooms</h3>
              <p className="text-2xl font-bold">45</p>
              <span className="text-red-500 text-sm">-3% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold">$52,389</p>
              <span className="text-green-500 text-sm">+8% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm mb-2">Active Users</h3>
              <p className="text-2xl font-bold">892</p>
              <span className="text-green-500 text-sm">+5% from last month</span>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <button className="flex items-center text-blue-600 hover:text-blue-700">
                <Plus size={20} className="mr-1" /> Add Booking
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4">{booking.id}</td>
                      <td className="px-6 py-4">{booking.room}</td>
                      <td className="px-6 py-4">{booking.guest}</td>
                      <td className="px-6 py-4">{booking.checkIn}</td>
                      <td className="px-6 py-4">{booking.checkOut}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Room Status */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Room Status</h2>
              <button className="flex items-center text-blue-600 hover:text-blue-700">
                <Plus size={20} className="mr-1" /> Add Room
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td className="px-6 py-4">{room.id}</td>
                      <td className="px-6 py-4">{room.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.status === 'Available' ? 'bg-green-100 text-green-800' : 
                          room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{room.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;