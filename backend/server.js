const express = require('express')

// Sessions, morgan for HTTP requests, mongooes for MongoDB
// const session = require('express-session');
// const morgan = require('morgan');
// const mongoose = require('mongoose');

// express app
const app = express();

//routes
app.get('/', (req, res) => {
    res.json({mssg: "Welcome!"});
})

// listen for requests
app.listen(4000, () => {
    console.log("Listening in PORT:4000");
})

// mongoose.connect(dbURI)
//   .then((result)=>{
//     app.listen(3000, ()=>{
//         console.log("Server is running on port 3000");
//     });
//   })
//   .catch((err)=>{
//     console.log(err);
//   });


// STATIC FILES FOR IMAGE UPLOADS
// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended:true }));
// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));

// app.use(express.json());

// app.use(session({
//   secret: 'boring  company',
//   resave: false,
//   saveUninitialized: true
// }));

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