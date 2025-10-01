const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/VendorControler'); // Corrected spelling

router.post('/register', VendorController.VendorRegister);

// 🔑 Login Vendor
router.post('/login', VendorController.vendorLogin);

// 📋 Get all vendors
router.get('/allvendors', VendorController.getvendorsAll);
// https://sdlc-btlh.onrender.com

// 🔍 Get single vendor by ID
router.get('/oneVendor/:id', VendorController.getoneVendor);

module.exports = router;
