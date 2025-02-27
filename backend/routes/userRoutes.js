const express = require('express');
const {
    getNotifs,
    putReadNotifs,
    getUnreadNotifCount,
} = require('../controllers/userControllers');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Define rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });

// Get all notifications (without authentication middleware)
router.get('/notifications', limiter, getNotifs);

// Get unread notification count (without authentication middleware)
router.get('/notifications/unread-count', limiter, getUnreadNotifCount);

// Mark notifications as read (without authentication middleware)
router.put('/notifications/mark-as-read', limiter, putReadNotifs);

module.exports = router;