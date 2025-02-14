const { User } = require('../models/schemas');
const { VendorRequest } = require("../models/vendorRequestSchema");


// Signup controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const newUser = new User({ username, email, password, lastLogin: new Date() });

      await newUser.save();
      res.status(201).json({ message: 'Signup successful', user: newUser });
      
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Error during signup. Please try again later.' });
    }
  };
  
// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password directly (no hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role == 'Admin') {
      return res.status(400).json({ message: 'Please Use Admin Login' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Login successful, return the user data (without token)
    res.status(200).json({ message: 'Login successful', user: user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error during login. Please try again later.' });
  }
};

// adminLogin controller
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password directly (no hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role !== "Admin") {
      return res.status(400).json({ message: 'User not authorized' });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Login successful, return the user data (without token)
    res.status(200).json({ message: 'Login successful', user: user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error during login. Please try again later.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const resetPassword = async (req, res) => {
//     try {
//         const { email, securityquestion, securityanswer, firsttry, secondtry } = req.body;

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // Check if the provided security question and answer match
//         // console.log(user.securityQuestion.question);
//         // console.log(user.securityQuestion.answer);
//         // console.log(securityquestion);
//         // console.log(securityanswer);
//         if (user.securityQuestion.question !== securityquestion || user.securityQuestion.answer !== securityanswer) {
//             return res.status(400).json({ error: 'Incorrect security question or answer' });
//         }

//         // Validate the passwords
//         if (firsttry !== secondtry) {
//             return res.status(400).json({ error: 'Passwords do not match' });
//         }

//         // Update the user's password
//         user.password = firsttry;
//         await user.save();

//         res.status(200).json({ message: 'Password reset successful' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
const vendorRequests = async(req, res) => {
  try {
    const { userID, message, timestamp} = req.body;

    if (!userID || !message){
      return res.status(400).json({error: "UserID and message are required"})
    }

  const newRequest = new VendorRequest({ userID, message, timestamp });
  await newRequest.save();
  res.status(201).json({message: "Message saved successfully!", data: newRequest});
  } catch (error) {
      console.error("Error saving request", error);
      res.status(500).json({error: "Internal Server Error"});
  }
};

const getVendorRequests = async(req, res) => {
  try {
    const requests = await VendorRequest.find().populate("userID", "username email role");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests", error);
    res.status(500).json("Internal Server Error")
  }
};

const updateVendorRequest = async (req, res) => {
  const { requestId, action } = req.body;

  try {
    if (action === "approve") {
      // Find the request and update the user's role to "Vendor"
      const request = await VendorRequest.findById(requestId);
      if (!request) return res.status(404).json({ message: "Request not found" });

      await User.findByIdAndUpdate(request.userID, { role: "Vendor" });
      await VendorRequest.findByIdAndDelete(requestId); // Remove the request after approval

      return res.status(200).json({ message: "User role updated to Vendor and request removed" });

    } else if (action === "reject") {
      // Just remove the request from the database
      await VendorRequest.findByIdAndDelete(requestId);
      return res.status(200).json({ message: "Request removed" });

    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  signup,
  login,
  adminLogin,
  getUsers,
  // resetPassword,
  vendorRequests,
  getVendorRequests,
  updateVendorRequest,
};