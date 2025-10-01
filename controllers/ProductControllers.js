const path = require('path');
const multer = require('multer');
const Firm = require('../models/Firm');
const Product = require('../models/Product');

// ------------------------
// Multer config for image uploads
// ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ------------------------
// Add Product to a Firm
// ------------------------
const addProduct = async (req, res) => {
  try {
    const firmId = req.params.firmId; // get firmId from route
    const { productName, productPrice, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ error: 'Firm not found' });

    const product = new Product({
      productName,
      productPrice,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    // Link product to firm
    firm.product.push(savedProduct._id);
    await firm.save();

    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ------------------------
// Get all products by Firm
// ------------------------
const getProductsByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId).populate('product');
    if (!firm) return res.status(404).json({ error: 'Firm not found' });

    res.status(200).json({
      success: true,
      firmName: firm.firmName,
      products: firm.product,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ------------------------
// Get single Product by ID
// ------------------------
const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ------------------------
// Delete Product by ID
// ------------------------
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ------------------------
// Export functions
// ------------------------
module.exports = {
  addProducts: [upload.single('image'), addProduct], // POST /product/add/:firmId
  getProductsByFirm,                                 // GET /product/byfirm/:firmId
  getProductById,                                    // GET /product/productbyId/:productId
  deleteProductById,                                 // DELETE /product/delete/:productId
};
