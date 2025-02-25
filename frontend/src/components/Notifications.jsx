import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get("/api/user/notifications/unread-count", { withCredentials: true });
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count", error);
    }
  };

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/user/notifications", { withCredentials: true });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching notifications", error);
      setNotifications([]); // Prevent crash
    }
  };

  // Mark notifications as read
  const markAsRead = async () => {
    try {
      await axios.put("/api/user/notifications/mark-as-read", {}, { withCredentials: true });
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = async () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      await fetchNotifications();
      await markAsRead();
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative p-2 bg-gray-800 text-white rounded-full cursor-pointer">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No new notifications</p>
          ) : (
            <ul>
              {Array.isArray(notifications) &&
                notifications.map((notif, index) => (
                  <li key={index} className="p-2 border-b border-gray-200">
                    {notif.message}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;