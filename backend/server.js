const express = require('express')

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