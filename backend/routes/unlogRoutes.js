const express = require('express');
const {
    login,
    signup,
    adminLogin,
    // resetPassword,
} = require('../controllers/unlogControllers');
const router = express.Router();


router.post('/login', login);
router.post('/signup', signup);
router.post('/admin/login', adminLogin);
// router.post('/resetPassword', resetPassword);


module.exports = router;