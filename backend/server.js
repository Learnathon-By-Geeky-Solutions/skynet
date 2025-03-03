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
// const lusca = require("lusca");

const Tokens = require("csrf");
const tokens = new Tokens();

const rateLimit = require("express-rate-limit");

const unlogRoutes = require('./routes/unlogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const { User } = require('./models/userSchemas');

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev'));

// CORS Middleware (Allow frontend at port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow cookies & authentication
}));


app.use((req, res, next) => {
  if (req.method === "GET") return next(); // Allow GET requests
  const token = tokens.create(process.env.CSRF_SECRET || "default_secret");
  res.cookie("XSRF-TOKEN", token, { httpOnly: false, sameSite: "Strict" });
  req.csrfToken = token;
  next();
});

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken });
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
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
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
          role: 'User',
          notifications: [],
          approvedVendors: [],
        });
      }
      return done(null, user);
    } catch (err) {
      console.error('Error during Google OAuth:', err);
      return done(err, null);
    }
  }
));

// Serialize and deserialize the user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
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
      return res.redirect("http://localhost:5173/login?error=GoogleAuthFailed");
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
        sameSite: "Lax",
        maxAge: 3600000, // 1 hour
      });

      // Redirect to frontend
      res.redirect("http://localhost:5173/auth-success");
    } catch (error) {
      console.error("Error updating lastLogin:", error);
      res.redirect("http://localhost:5173/login?error=ServerError");
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
    // console.log("✅ User from Token:", user); // Debugging
    req.user = user;
    next();
  });
}

// Define rate limiting globally
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
    headers: true,
});

// Apply global rate limiter before all routes
app.use(globalLimiter);

// API routes (protected routes example)
app.use('/api/auth', unlogRoutes);
app.use('/api/admin', authenticateJWT, adminRoutes); // Protected
app.use('/api/user', authenticateJWT, userRoutes);  // Protected

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Catch-all route for React
app.get('*', limiter, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file!");
  process.exit(1); // Exit with failure
}

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB and Listening on PORT:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// STATIC FILES FOR IMAGE UPLOADS
// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended:true }));
// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));


// // Define error handling middleware
// function sessionLogout(err, req, res, next) {
//   if (err.message && err.message.includes("Cannot read properties of undefined (reading 'username')")) {
//       // Redirect to the login page
//       return res.redirect('/login');
//   }

//   // For other errors, proceed to the next middleware
//   next(err);
// }

// app.use(sessionLogout);

// app.use((req, res)=>{
//     res.status(404).render('404', { title:"404" });
// });