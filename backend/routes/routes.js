const express = require('express');
const {
    login,
    signup,
    // resetPassword
} = require('../controllers/controllers');

const router = express.Router();

router.post('/api/auth/login', login);
router.post('/api/auth/signup', signup);
// router.post('/resetPassword', resetPassword);

module.exports = router;