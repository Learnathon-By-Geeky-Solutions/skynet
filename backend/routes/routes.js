const express = require('express');
const {
    getUsers,
    login,
    signup,
    adminLogin,
    // resetPassword,
    vendorRequests,
    getVendorRequests,
    updateVendorRequest,
} = require('../controllers/controllers');

const router = express.Router();


router.get('/api/users', getUsers);

router.post('/api/auth/login', login);
router.post('/api/auth/signup', signup);

router.post('/api/auth/admin/login', adminLogin);
// router.post('/resetPassword', resetPassword);
router.post("/api/auth/admin/requests", vendorRequests);
router.get("/api/vendorRequests", getVendorRequests);
router.put("/api/vendorRequest/update", updateVendorRequest);

module.exports = router;