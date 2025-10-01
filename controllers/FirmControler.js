const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Helper to parse array fields
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return field.split(',').map((item) => item.trim());
    }
  }
  return [];
};

// ✅ Add a new firm
const addFirm = async (req, res) => {
  try {
    const vendorId = req.params.Id; // comes from verifyToken middleware
    if (!vendorId) {
      return res.status(401).json({ error: 'Unauthorized: Vendor ID missing' });
    }

    let { firmName, area, category, region, offer } = req.body;

    category = parseArrayField(category);
    region = parseArrayField(region);
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    // Add reference to vendor
    vendor.firm = vendor.firm || [];
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Firm added successfully',
      firm: savedFirm,
    });
  } catch (error) {
    console.error('Error in addFirm:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// ✅ Delete a firm by ID (only removes from vendor who owns it)
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;
    const vendorId = req.vendorId;

    if (!vendorId) return res.status(401).json({ error: 'Unauthorized' });

    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ error: 'Firm not found' });

    if (firm.vendor.toString() !== vendorId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete this firm' });
    }

    await Firm.findByIdAndDelete(firmId);
    await Vendor.findByIdAndUpdate(vendorId, { $pull: { firm: firmId } });

    res.status(200).json({ success: true, message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Error deleting firm:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  addFirm: [upload.single('image'), addFirm], // multer middleware included
  deleteFirmById,
};
