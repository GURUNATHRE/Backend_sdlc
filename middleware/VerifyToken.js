const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Vendor = require('../models/Vendor');

dotenv.config();
const secretKey = process.env.whatis;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token is required' });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) return res.status(401).json({ error: 'Vendor not found or token invalid' });

    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);

    if (error.name === "TokenExpiredError")
      return res.status(403).json({ error: "Token has expired" });

    if (error.name === "JsonWebTokenError")
      return res.status(403).json({ error: "Invalid token" });

    res.status(403).json({ error: 'Authentication failed' });
  }
};

module.exports = verifyToken;
