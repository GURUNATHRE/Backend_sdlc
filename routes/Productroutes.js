const express = require('express');
const path = require('path'); // fixed
const {
  addProducts,
  getproductbyFirm,
  deletProductBYId,
  getProductById,
} = require('../controllers/productController');

const router = express.Router();

// ➕ Add Product to Firm
router.post('/add/:firmId', addProducts);

// 📦 Get all products by Firm
router.get('/byfirm/:firmId', getproductbyFirm);

// 🔍 Get single product by ID
router.get('/productbyId/:productId', getProductById);

// 🗑 Delete Product by Id
router.delete('/delete/:productId', deletProductBYId);

// 🖼 Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.setHeader('Content-Type', 'image/jpeg'); // fixed
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

module.exports = router;
