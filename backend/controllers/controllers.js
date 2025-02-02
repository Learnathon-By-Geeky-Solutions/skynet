const { User } = require('../models/schemas');


// Signup controller
const signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      const newUser = new User({ username, email, password });
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

    // Login successful, return the user data (without token)
    res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } });
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
    // resetPassword,
};