const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/userSchemas');
const mongoose = require('mongoose');
const validator = require("validator");

function createJWT(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const user = await User.findOne({ email }).select('+password'); // Ensure password is selected

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Update lastLogin timestamp
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = createJWT(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Admin Login Controller
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Update lastLogin timestamp
    await User.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    // Generate JWT
    const token = createJWT(admin);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: 'Admin login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User Signup Controller
const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Trim inputs to remove accidental spaces
    username = username?.trim();
    email = email?.trim().toLowerCase(); // Convert email to lowercase for consistency

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Password regex: Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
      });
    }

    // Check for existing user (case-insensitive)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user WITHOUT manual hashing
    const newUser = new User({
      username,
      email,
      password, // ✅ Directly assign plain password (pre-save hook will hash it)
      role: 'user',
      lastLogin: new Date(),
    });

    await newUser.save();

    const token = createJWT(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ message: 'Signup successful, please log in' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Protected route to fetch user info
const authMe = async (req, res) => {
  try {
    // `req.user` is already set by `authenticateUser` middleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error in authMe:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Lax" });
  return res.status(200).json({ message: "Logout successful" });
};

module.exports = { login, signup, adminLogin, authMe, logout };
