const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper function to safely parse arrays
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field; // already an array
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed; // JSON array
    } catch {
      // fallback: comma-separated string
      return field.split(',').map(item => item.trim());
    }
  }
  return [];
};

// ADD FIRM
const addFirm = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    if (!vendorId) {
      return res.status(401).json({ error: 'Unauthorized: Vendor ID missing' });
    }

    // Extract fields
    let { firmName, area, category, region, offer } = req.body;

    // Ensure category & region are arrays
    category = parseArrayField(category);
    region = parseArrayField(region);

    const image = req.file ? req.file.filename : undefined;

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    // Create firm
    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

    // Add firm reference to vendor
    vendor.firm = vendor.firm || [];
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    res.status(201).json({ success: true, message: 'Firm added successfully', firm: savedFirm });
  } catch (error) {
    console.error('Error in addFirm:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// DELETE FIRM
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) return res.status(404).json({ error: 'Firm not found' });

    // Remove firm reference from all vendors
    await Vendor.updateMany(
      { firm: firmId },
      { $pull: { firm: firmId } }
    );

    res.status(200).json({ success: true, message: 'Firm deleted successfully', firm: deletedFirm });
  } catch (error) {
    console.error('Error deleting firm:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  addFirm: [upload.single('image'), addFirm],
  deleteFirmById,
};
