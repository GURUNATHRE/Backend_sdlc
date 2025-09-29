const express = require('express');
const path = require('path'); // Must import
const verifyToken = require('../middleware/VerifyToken');
const FirmController = require('../controllers/FirmControler'); // Correct spelling

const router = express.Router();

// Protected route to add a firm
router.post('/add-firm', verifyToken, FirmController.addFirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);

    res.setHeader('Content-Type', 'image/jpeg'); // Correct way
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending image:', err);
            res.status(404).json({ success: false, error: 'Image not found' });
        }
    });
});

module.exports = router;
