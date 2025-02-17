import { useState } from "react";
import { X } from 'lucide-react';
import PropTypes from 'prop-types';


const MessageModal = ({ isOpen, onClose, onSubmit }) => {
    const [message, setMessage] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(message);
      setMessage(""); // Clear the message
      onClose(); // Close the modal
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 w-96 relative shadow-x1">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Vendor Approval Request</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              placeholder="Type your message here..."
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  };

MessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // Must be a boolean
  onClose: PropTypes.func.isRequired, // Must be a function
  onSubmit: PropTypes.func.isRequired // Must be a function
};

export default MessageModal;