import { useState, useEffect, useContext } from "react";
import { Users, Check, X } from "lucide-react";
import SideBar from "../components/adminSideBar.jsx";
import TopBar from "../components/adminTopbar.jsx";
import axios from "axios";
import { RequestContext } from "../context/RequestContext"; // Import context

const VendorRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const { requestCount, setRequestCount } = useContext(RequestContext); // Get global state

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/getVendorRequests", {
          withCredentials: true, // Enable credentials
        });
        console.log("Fetched vendor requests:", response.data);
  
        setRequests(response.data.data);
        setRequestCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
  
    fetchRequests();
  }, [setRequestCount]);

  const handleAction = async (requestId, action) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/admin/updateVendorRequests",
        { requestId, action },
        { withCredentials: true } // Enable credentials
      );
  
      if (response.status === 200) {
        setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
        setRequestCount((prevCount) => Math.max(prevCount - 1, 0));
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

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
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4">{request.requesterID.username}</td>
                    <td className="px-6 py-4">{request.requesterID.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          request.requesterID.role === "Admin"
                            ? "bg-red-100 text-red-800"
                            : request.requesterID.role === "Vendor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.requesterID.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{request.message}</td>
                    <td className="px-6 py-4 flex justify-center space-x-2">
                      <button
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                        onClick={() => handleAction(request._id, "approve")}
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => handleAction(request._id, "reject")}
                      >
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
