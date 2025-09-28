const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads/' exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add Firm controller
const addFirm = async (req, res) => {
  try {
    console.log("Vendor ID:", req.vendorId); // Debug

    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

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

    // Add firm reference to vendor
    if (!vendor.firm) vendor.firm = [];
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    res.status(201).json({ message: 'Firm added successfully', firm: savedFirm });
  } catch (error) {
    console.error("Error in addFirm:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Firm controller
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) return res.status(404).json({ error: 'Firm not found' });

    // Remove firm reference from vendors
    await Vendor.updateMany(
      { firm: firmId },
      { $pull: { firm: firmId } }
    );

    res.status(200).json({ message: 'Firm deleted successfully', firm: deletedFirm });
  } catch (error) {
    console.error("Error deleting firm:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addFirm: [upload.single('image'), addFirm], // multer middleware first
  deleteFirmById,
};
