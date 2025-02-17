import { createContext, useState, useEffect } from "react";

// Create the context
export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/getVendorRequests");
        const data = await response.json();
        setRequestCount(data.length); // Assuming data is an array of requests
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <RequestContext.Provider value={{ requestCount, setRequestCount }}>
      {children}
    </RequestContext.Provider>
  );
};