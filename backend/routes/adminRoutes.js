const express = require('express');

const {
    getUsers,
    postVendorRequests,
    getVendorRequests,
    updateVendorRequests,
} = require('../controllers/adminControllers');
const router = express.Router();


router.get('/getUsers', getUsers);
router.get("/getVendorRequests", getVendorRequests);

router.post("/postVendorRequests", postVendorRequests);

router.put("/updateVendorRequests", updateVendorRequests);

module.exports = router;