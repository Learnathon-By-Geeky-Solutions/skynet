const express = require('express');
const {
    login,
    signup,
    // resetPassword
} = require('../controllers/controllers');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
// router.post('/resetPassword', resetPassword);

module.exports = router;