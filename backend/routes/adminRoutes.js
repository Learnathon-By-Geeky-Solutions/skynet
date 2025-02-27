const express = require('express');
const {
    getUsers,
    postVendorRequests,
    getVendorRequests,
    updateVendorRequests,
} = require('../controllers/adminControllers');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Define rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });


router.get('/getUsers', limiter, getUsers);
router.get("/getVendorRequests", limiter, getVendorRequests);

router.post("/postVendorRequests", limiter, postVendorRequests);

router.put("/updateVendorRequests", limiter, updateVendorRequests);

module.exports = router;