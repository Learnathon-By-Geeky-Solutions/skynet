import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/getVendorRequests", {
          withCredentials: true, // Ensures cookies/session are sent if needed
        });

        if (response.data.success) {
          setRequestCount(response.data.data.length); // Assuming response.data.data is an array
        } else {
          console.error("Failed to fetch vendor requests:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching vendor requests:", error);
      }
    };

    fetchRequests();
  }, []); // Runs once when the component mounts

  return (
    <RequestContext.Provider value={{ requestCount, setRequestCount }}>
      {children}
    </RequestContext.Provider>
  );
};
