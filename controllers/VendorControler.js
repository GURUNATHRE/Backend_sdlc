const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcr = require('bcryptjs'); // keep consistent
const dotEnv = require('dotenv');
dotEnv.config();
// process
const secretkey = process.env.whatis
// REGISTER
const VendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // check username
    const vendorName = await Vendor.findOne({ username });
    if (vendorName) {
      return res.status(400).json({ message: 'Name is already occupied' });
    }

    // check email
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // hash password bcrypt using 
    const hashedPassword = await bcr.hash(password, 10);
    // jwt token for username pasword import package

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    res.status(201).json({ message: 'Data has been saved', vendor: newVendor });
    console.log('registered....');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal error' });
  }
};

// LOGIN
const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. find vendor by email
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. compare password
    const isMatch = await bcr.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // jwt token for username pasword import package
    const token = jwt.sign({ vendorId: vendor._id }, secretkey, { expiresIn: '1h' });

    // 4. return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      Token: token,
      vendor,
    });

    console.log('Logged in:', email);
    console.log('Token :', token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getvendorsAll = async (req, res) => {
  try {
    // populate meand shoeing table in vendor
    const vendors = await Vendor.find().populate('firm');
    res.json({ vendors })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal Error..' })
  }
};

const getoneVendor = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId);
    if(!vendor){
      res.status(404).json({error:"Vendor not found"} )
    }
    res.status(200).json({vendor})
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}
module.exports = { VendorRegister, vendorLogin, getvendorsAll ,getoneVendor};
