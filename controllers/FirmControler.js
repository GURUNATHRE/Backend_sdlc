const multer = require('multer');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');

// 1️⃣ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + Path.extname(file.originalname));
  },
});

// 2️⃣ Create upload middleware
const upload = multer({ storage: storage });

// 3️⃣ Controller to add firm
const addFirm = async (req, res) => {
  try {
    // take fields from body
    const { firmName, area, category, region, offer } = req.body;

    // file uploaded name
    const image = req.file ? req.file.filename : undefined;

    // verify vendor exists
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

    // save
    const savefirm = await firm.save();
    vendor.firm.push(savefirm);
    await vendor.save();
    return res.status(201).json({ message: 'Firm added successfully', firm });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const deletFirmBYid = async(req,res)=>{
  try{
    const firmId = req.params.firmId;

    const Deletefirm = await Firm.findByIdAndDelete(productId);

    if(!Deletefirm){
      return res.status(404).json({error:'no product found'})
    }
    res.status(200).json({message:"product deleted succesfully"})
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"internal server eroor"});
  }
}
// 4️⃣ Export: first multer middleware then addFirm controller


module.exports = {addFirm: [upload.single('image'), addFirm],deletFirmBYid};
