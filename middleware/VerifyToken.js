const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
const Vendor = require('../models/Vendor');

dotEnv.config();
const secretkey = process.env.whatis; // must exist in .env

// middleware (req,res,next) 3 parameters
const verifyToken = async (req, res, next) => {
  // get token from headers
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    // verify token
    const decodedCode = jwt.verify(token, secretkey);

    // find vendor
    const vendor = await Vendor.findById(decodedCode.vendorId);

    if (!vendor) {
      return res.status(401).json({ error: 'Vendor not found or token invalid' });
    }

    // attach vendorId to request
    req.vendorId = vendor._id;

    // go to next middleware/route
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
