const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in your environment variables!");
}

// REGISTER
const VendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username exists
        const vendorName = await Vendor.findOne({ username });
        if (vendorName) return res.status(400).json({ message: 'Username already taken' });

        // Check if email exists
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) return res.status(400).json({ message: 'Email already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();

        res.status(201).json({ success: true, message: 'Vendor registered successfully', vendor: newVendor });
        console.log('Vendor registered:', email);
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// LOGIN
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            vendor
        });

        console.log('Vendor logged in:', email);
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET ALL VENDORS
const getvendorsAll = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.status(200).json({ success: true, vendors });
    } catch (error) {
        console.error('Get all vendors error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET SINGLE VENDOR
const getoneVendor = async (req, res) => {
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

        res.status(200).json({ success: true, vendor });
    } catch (error) {
        console.error('Get vendor error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { VendorRegister, vendorLogin, getvendorsAll, getoneVendor };
