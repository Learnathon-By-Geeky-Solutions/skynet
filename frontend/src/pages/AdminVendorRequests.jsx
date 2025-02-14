import { useState, useEffect } from 'react';
import { 
  Users, 
  Check, 
  X
} from 'lucide-react';
import SideBar from '../components/AdminSideBar.jsx';
import TopBar from '../components/AdminTopbar.jsx';
import axios from 'axios';

const VendorRequestPage = () => {
  const handleAction = async (requestId, action) => {
    try {
      const response = await axios.put("http://localhost:4000/api/vendorRequest/update", {
        requestId,
        action
      });
  
      if (response.status === 200) {
        // Remove the request from state after successful update
        setRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };
  
  const [requests, setRequests] = useState([])
  useEffect(() => {
    fetch('http://localhost:4000/api/vendorRequests')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched vendor requests:", data);//
        setRequests(data)})
      .catch((error) => console.error('Error fetching requests:', error));
  }, []) 

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

    <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <TopBar />
    
    {/* Main Content */}
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3" size={24} /> Requests
        </h1>
        {/* <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus className="mr-2" size={20} /> Add New User
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map(request => (
              <tr key={request._id}>
                <td className="px-6 py-4">{request.userID._id}</td>
                <td className="px-6 py-4">{request.userID.username}</td>
                <td className="px-6 py-4">{request.userID.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.userID.role === 'Admin' ? 'bg-red-100 text-red-800' : 
                    request.userID.role === 'Vendor' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.userID.role}
                  </span>
                </td>
                <td className="px-6 py-4">{request.message}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button className="text-green-600 hover:text-green-800 cursor-pointer"
                  onClick = {() => {handleAction(request._id, "approve")}}>
                    <Check size={20} />
                  </button>
                  <button className="text-red-600 hover:text-red-800 cursor-pointer" 
                  onClick = {() => {handleAction(request._id, "reject")}}>
                    <X size={20} />
                    
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
};

export default VendorRequestPage;