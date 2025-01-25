require('dotenv').config();

const express = require('express')
// Sessions, morgan for HTTP requests, mongoose for MongoDB
const mongoose = require('mongoose');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');

const routes = require('./routes/routes');
const { User } = require('./models/schemas');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
})
);

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:4000/auth/google/callback"
//     }, (accessToken, refreshToken, profile, done) => {
//         return done(null, profile);
//     }
// ));
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

passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async(id, done) => done(null, user));
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/'); // Redirect to frontend's home page
    }
  );
  
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next(); 
});

//routes
app.use('/', routes);

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Catch-all route for React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// connect to mongodb & listen for requests
mongoose.connect(process.env.MONGO_URI)
  .then((result)=>{
    app.listen(process.env.PORT, () => {
        console.log(`Connected to DB and Listening on PORT:${process.env.PORT}`);
    })
  })
  .catch((err)=>{
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