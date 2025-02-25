import { useState, useEffect } from "react";
import { Users, Edit, Trash2, Plus } from "lucide-react";
import SideBar from "../components/adminSideBar.jsx";
import TopBar from "../components/adminTopbar.jsx";
import axios from "axios";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/getUsers", { withCredentials: true });

        if (response.data.success) {
          setUsers(response.data.data); // Access users inside 'data' key
        } else {
          console.error("Failed to fetch users:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Never Logged In";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      weekday: "short", // Mon, Tue, etc.
      year: "numeric",
      month: "short", // Jan, Feb, etc.
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // AM/PM format
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <TopBar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-3" size={24} /> User Management
            </h1>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Plus className="mr-2" size={20} /> Add New User
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === "Admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "Vendor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{formatTimestamp(user.lastLogin)}</td>
                      <td className="px-6 py-4 flex justify-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={20} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
