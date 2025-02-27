const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const {
    login,
    signup,
    adminLogin,
    authMe,
    logout,
    // resetPassword,
} = require('../controllers/unlogControllers');
const router = express.Router();


// Rate limiter for login & admin login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    handler: (req, res) => {
        res.set('Retry-After', Math.ceil(req.rateLimit.resetTime / 1000)); // Convert ms to seconds
        res.status(429).json({ message: 'Too many login attempts. Try again later.' });
    },
    standardHeaders: true, // Sends RateLimit-* headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 signups per hour
    message: { message: 'Too many signup attempts. Try again later.' },
    headers: true,
});

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }
      req.user = decoded; // Attach user data to request
      next();
    });
  };


router.get('/me', [loginLimiter, authenticateUser], authMe);


// Logout Route (Clears JWT Cookie)
router.post('/logout', logout);
// Apply rate limit only to login routes
router.post('/login', loginLimiter, login);
router.post('/admin/login', loginLimiter, adminLogin);
router.post('/signup', signupLimiter, signup);
// router.post('/resetPassword', resetPassword);


module.exports = router;