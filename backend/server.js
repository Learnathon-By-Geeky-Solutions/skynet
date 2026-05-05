require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const Tokens = require("csrf");
const tokens = new Tokens();
const crypto = require("crypto");

const rateLimit = require("express-rate-limit");

const unlogRoutes = require('./routes/unlogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const { User } = require('./models/userSchemas');

// Solve Node.js version 20 and later's issue of resolving DNS SRV records required to connect to mongodb
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forcing Google's Public DNS

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // Serve static files

// CORS Middleware (Allow frontend)
const allowedOrigins = ['http://localhost:5173', 'https://skynet1.netlify.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies & authentication
}));


app.use((req, res, next) => {
  if (req.method === "GET") return next(); // Allow GET requests

  // Generate a cryptographically secure CSRF token
  const csrfToken = crypto.randomBytes(32).toString("hex");

  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,  // Allow frontend access
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict", // Prevent CSRF attacks
  });

  req.csrfToken = csrfToken;
  next();
});

// Endpoint to fetch CSRF token
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.cookies["XSRF-TOKEN"] });
});

// Define rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// JWT Token generation
function createJWT(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Google OAuth Strategy
if (
  process.env.NODE_ENV !== 'test' || 
  (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_SERVER_HOST}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            lastLogin: new Date(),
            role: 'user',
            notifications: [],
            approvedVendors: [],
            pendingStatus: 'not_pending',
          });
        }
        return done(null, user);
      } catch (err) {
        console.error('Error during Google OAuth:', err);
        return done(err, null);
      }
    }
  ));
} else {
  console.log('Google OAuth setup skipped in test environment');
}

// Serialize and deserialize the user
passport.serializeUser((user, done) => done(null, user.googleId));  // Serialize using googleId

passport.deserializeUser(async (googleId, done) => {  // Deserialize using googleId
  try {
    const user = await User.findOne({ googleId });  // Find user by googleId
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  "/auth/google/callback", limiter,
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.GOOGLE_CLIENT_HOST}/login?error=GoogleAuthFailed`);
    }

    try {
      // ✅ Update lastLogin field
      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });

      // Generate JWT Token
      const token = createJWT(req.user);

      // Set token as HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None for Netlify/Render, Lax for local
        maxAge: 3600000, // 1 hour
      });

      // Redirect to frontend
      res.redirect(`${process.env.GOOGLE_CLIENT_HOST}/auth-success`);
    } catch (error) {
      console.error("Error updating lastLogin:", error);
      res.redirect(`${process.env.GOOGLE_CLIENT_HOST}/login?error=ServerError`);
    }
  }
);

// Middleware to protect routes
function authenticateJWT(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: err.message === 'jwt expired' ? 'Session expired, please log in again' : 'Unauthorized: Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Define rate limiting globally
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
});

// Apply global rate limiter before all routes
app.use(globalLimiter);

// API routes (protected routes example)
app.use('/api/auth', unlogRoutes);
app.use('/api/admin', authenticateJWT, adminRoutes); // Protected
app.use('/api/user', authenticateJWT, userRoutes);  // Protected
app.use('/api/vendor', authenticateJWT, vendorRoutes); // Protected

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file!");
  process.exit(1); // Exit with failure
}

// Connect to MongoDB and start server
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`Connected to DB and Listening on PORT:${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Export the app for testing purposes
module.exports = app;