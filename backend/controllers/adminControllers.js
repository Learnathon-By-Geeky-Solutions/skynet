const { User } = require('../models/userSchemas');
const { VendorRequest } = require("../models/vendorRequestSchemas");
const mongoose = require('mongoose');


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role lastLogin");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getVendorRequests = async(req, res) => {
  try {
    const requests = await VendorRequest.find().populate("requesterID", "username email role");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests", error);
    res.status(500).json({ message: "Internal Server Error" })
  }
};

// const getVendorRequests = async (req, res) => {
//   try {
//     const requests = await User.find({ requests: { $exists: true, $ne: [] } })
//       .select("requests")
//       .populate("requests.requesterID", "username email role"); // Populate requester details

//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch requests", details: error.message });
//   }
// };


const postVendorRequests = async(req, res) => {  
  try {  
    const { requesterID, message } = req.body;  

    if (!requesterID || !message || !mongoose.Types.ObjectId.isValid(requesterID)){  
      return res.status(400).json({error: "requesterID and message are required"})  
    }  

    const session = await mongoose.startSession();  
    session.startTransaction();  
    await User.findByIdAndUpdate(requesterID, { pendingStatus: 'pending' });  

    const newRequest = new VendorRequest({ requesterID, message });  
    await newRequest.save();  
    await session.commitTransaction();  
    res.status(201).json({message: "Message saved successfully!", data: newRequest});  
    
  } catch (error) {  
      if (session) {  
        await session.abortTransaction();  
      }  
      console.error("Error saving request", error);  
      res.status(500).json({error: "Internal Server Error"});  
  }  
};  

const updateVendorRequests = async (req, res) => {  
  const { requestId, action } = req.body;  
  let session;  

  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {  
    return res.status(400).json({ message: "Invalid request ID" });  
  }  

  try {  
    session = await mongoose.startSession();  
    session.startTransaction();  

    const request = await VendorRequest.findById(requestId);  
    if (!request) return res.status(404).json({ message: "Request not found" });  

    const userId = request.requesterID;  
    // let notificationMessage = "";  

    if (action === "approve") {  
      await User.findByIdAndUpdate(  
        userId,  
        {  
          role: "Vendor",  
          pendingStatus: "not_pending",  
          $push: { notifications: { message: "Your vendor request has been approved! 🎉", read: false } }  
        },  
        { session }  
      );  
    } else if (action === "reject") {  
      await User.findByIdAndUpdate(  
        userId,  
        {  
          pendingStatus: "not_pending",  
          $push: { notifications: { message: "Your vendor request has been rejected. ❌", read: false } }  
        },  
        { session }  
      );  
    } else {  
      return res.status(400).json({ message: "Invalid action" });  
    }  

    await VendorRequest.findByIdAndDelete(requestId).session(session);  
    await session.commitTransaction();  

    return res.status(200).json({ message: "Request processed, user updated, and notification saved" });  
  } catch (error) {  
    if (session) {  
      await session.abortTransaction();  
    }  
    console.error("Error updating request:", error);  
    res.status(500).json({ message: "Internal Server Error" });  
  }  
};  



// const updateVendorRequests = async (req, res) => {
//   const { requestId, action } = req.body;

//   try {
//     if (action === "approve") {
//       // Find the request and update the user's role to "Vendor"
//       const request = await VendorRequest.findById(requestId);
//       if (!request) return res.status(404).json({ message: "Request not found" });

//       await User.findByIdAndUpdate(request.requesterID, { role: "Vendor", pendingStatus: 'not_pending' });
//       await VendorRequest.findByIdAndDelete(requestId); // Remove the request after approval

//       return res.status(200).json({ message: "User role updated to Vendor and request removed" });

//     } else if (action === "reject") {
//       // Just remove the request from the database
//       const request = await VendorRequest.findById(requestId);
//       if (!request) return res.status(404).json({ message: "Request not found" });

//       await User.findByIdAndUpdate(request.requesterID, { pendingStatus: 'not_pending' });
//       await VendorRequest.findByIdAndDelete(requestId);
      
//       return res.status(200).json({ message: "Request removed" });

//     } else {
//       return res.status(400).json({ message: "Invalid action" });
//     }
//   } catch (error) {
//     console.error("Error updating request:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


module.exports = {
  getUsers,
  postVendorRequests,
  getVendorRequests,
  updateVendorRequests,
};