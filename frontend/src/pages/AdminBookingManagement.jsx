import React, { useState } from 'react';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      guest: "Emily Chen", 
      room: "Deluxe Suite", 
      checkIn: "2024-02-15", 
      checkOut: "2024-02-18", 
      totalGuests: 2, 
      status: "Confirmed" 
    },
    { 
      id: 2, 
      guest: "Robert Kim", 
      room: "Family Room", 
      checkIn: "2024-02-20", 
      checkOut: "2024-02-25", 
      totalGuests: 4, 
      status: "Pending" 
    },
    { 
      id: 3, 
      guest: "Sarah Rodriguez", 
      room: "Standard Room", 
      checkIn: "2024-03-01", 
      checkOut: "2024-03-03", 
      totalGuests: 1, 
      status: "Cancelled" 
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-3" size={24} /> Booking Management
        </h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus className="mr-2" size={20} /> Add New Booking
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td className="px-6 py-4">{booking.id}</td>
                <td className="px-6 py-4">{booking.guest}</td>
                <td className="px-6 py-4">{booking.room}</td>
                <td className="px-6 py-4">{booking.checkIn}</td>
                <td className="px-6 py-4">{booking.checkOut}</td>
                <td className="px-6 py-4">{booking.totalGuests}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={20} />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagementPage;