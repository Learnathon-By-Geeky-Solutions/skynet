const express = require('express');
const {
    getUsers,
    login,
    signup,
    adminLogin
    // resetPassword
} = require('../controllers/controllers');

const router = express.Router();


router.get('/api/users', getUsers);

router.post('/api/auth/login', login);
router.post('/api/auth/signup', signup);

router.post('/api/auth/admin/login', adminLogin);
// router.post('/resetPassword', resetPassword);

module.exports = router;