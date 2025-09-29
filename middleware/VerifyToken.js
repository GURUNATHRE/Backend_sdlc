// middleware/VerifyToken.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Vendor = require('../models/Vendor');

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables!");
}

const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // 2️⃣ Fallback: 'token' header
    else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, secretKey);

    // 4️⃣ Optional: ensure vendor exists
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      return res.status(401).json({ error: 'Vendor not found or token invalid' });
    }

    // 5️⃣ Attach vendorId to request
    req.vendorId = vendor._id;

    next(); // proceed
  } catch (error) {
    console.error("JWT error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }

    res.status(403).json({ error: 'Authentication failed' });
  }
};

module.exports = verifyToken;
