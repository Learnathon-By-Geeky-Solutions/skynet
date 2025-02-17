const express = require('express');
const {
    getNotifs,
    putReadNotifs,
    getUnreadNotifCount,
} = require('../controllers/userControllers');
const router = express.Router();

// Get all notifications (without authentication middleware)
router.get('/notifications', getNotifs);

// Get unread notification count (without authentication middleware)
router.get('/notifications/unread-count', getUnreadNotifCount);

// Mark notifications as read (without authentication middleware)
router.put('/notifications/mark-as-read', putReadNotifs);

module.exports = router;