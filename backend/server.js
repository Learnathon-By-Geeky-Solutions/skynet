require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const routes = require('./routes/routes');
const { User } = require('./models/schemas');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
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

// JWT Token generation
function createJWT(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = createJWT(req.user); // Generate JWT token
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' }); // Send token as a cookie

  res.redirect(`http://localhost:5173?token=${token}`); // Redirect to frontend homepage
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Catch-all route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// API routes
app.use('/', routes);

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