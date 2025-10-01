const express = require('express');
const path = require('path');
const ProductController = require('../controllers/ProductControllers'); // match exact file name

const router = express.Router();

// Add Product (with multer middleware)
router.post('/add/:firmId', ProductController.addProducts); // Express supports array of middleware

// Get all products by firm
router.get('/byfirm/:firmId', ProductController.getProductsByFirm);

// Get single product
router.get('/productbyId/:productId', ProductController.getProductById);

// Delete product
router.delete('/delete/:productId', ProductController.deleteProductById);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '..', 'uploads', imageName);

  res.sendFile(imagePath, (err) => {
    if (err) return res.status(404).json({ error: 'Image not found' });
  });
});

module.exports = router;
