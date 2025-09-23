const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
const Vendor = require('../models/Vendor');

dotEnv.config();
const secretkey = process.env.whatis;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ read Bearer token
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    const decoded = jwt.verify(token, secretkey);
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(401).json({ error: 'Vendor not found or token invalid' });
    }

    req.vendorId = vendor._id; // attach vendorId to request
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
