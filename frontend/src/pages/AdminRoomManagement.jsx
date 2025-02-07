import React, { useState } from 'react';
import { 
  Home, 
  Edit, 
  Trash2, 
  Plus 
} from 'lucide-react';

const RoomManagementPage = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Deluxe Suite", type: "Suite", capacity: 2, price: "$200/night", status: "Available" },
    { id: 2, name: "Family Room", type: "Family", capacity: 4, price: "$250/night", status: "Occupied" },
    { id: 3, name: "Standard Room", type: "Standard", capacity: 2, price: "$100/night", status: "Maintenance" },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Home className="mr-3" size={24} /> Room Management
        </h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus className="mr-2" size={20} /> Add New Room
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map(room => (
              <tr key={room.id}>
                <td className="px-6 py-4">{room.id}</td>
                <td className="px-6 py-4">{room.name}</td>
                <td className="px-6 py-4">{room.type}</td>
                <td className="px-6 py-4">{room.capacity} persons</td>
                <td className="px-6 py-4">{room.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    room.status === 'Available' ? 'bg-green-100 text-green-800' : 
                    room.status === 'Occupied' ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {room.status}
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

export default RoomManagementPage;