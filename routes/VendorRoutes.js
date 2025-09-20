const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/VendorControler'); // note consistent spelling

// Endpoints using router
router.post('/register', VendorController.VendorRegister);
router.post('/login', VendorController.vendorLogin);
router.get('/allvendors',VendorController.getvendorsAll);
router.get('/oneVendor/:id',VendorController.getoneVendor);
// Export router at the end
module.exports = router;
