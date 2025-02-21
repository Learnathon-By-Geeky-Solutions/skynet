const { User } = require('../models/userSchemas');
const bcrypt = require("bcrypt");
const rateLimit = require('express-rate-limit');

// Signup controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
  
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ 
        username, 
        email: email.toLowerCase(), 
        password,
        lastLogin: new Date() 
      });
      
      await newUser.save();
      res.status(201).json({ message: 'Signup successful', user: newUser });
      
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Error during signup. Please try again later.' });
    }
};
  
// Add rate limiting middleware  
const loginLimiter = rateLimit({  
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 5 // limit each IP to 5 requests per windowMs  
}); 

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
    
    if (!email || !password) {  
      return res.status(400).json({ message: 'All fields required' });  
    }
  try {
    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password (with hashing)
    const isMatch = await bcrypt.compare(password, user.password);  
    if (!isMatch) {  
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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password (with hashing)
    const isMatch = await bcrypt.compare(password, user.password);  
    if (!isMatch) { 
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



module.exports = {
  signup,
  login,
  adminLogin,
  // resetPassword,
};