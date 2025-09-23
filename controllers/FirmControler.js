const multer = require('multer');
const path = require('path'); // ✅ forgot to import Path
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

// 1️⃣ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 2️⃣ Create upload middleware
const upload = multer({ storage: storage });

// 3️⃣ Controller to add firm
const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    // file uploaded name
    const image = req.file ? req.file.filename : undefined;

    // verify vendor exists (assume req.vendorId is set from auth middleware)
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // create firm document
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

    // add firm reference to vendor
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(201).json({ message: 'Firm added successfully', firm: savedFirm });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// 4️⃣ Controller to delete firm
const deleteFirmById = async (req, res) => {
  try {
    const { firmId } = req.params;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    // remove reference from vendor
    await Vendor.updateMany(
      { firm: firmId },
      { $pull: { firm: firmId } }
    );

    res.status(200).json({ message: 'Firm deleted successfully', firm: deletedFirm });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 5️⃣ Export
module.exports = {
  addFirm: [upload.single('image'), addFirm],
  deleteFirmById,
};
