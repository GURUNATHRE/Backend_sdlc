const express = require('express');
const firmController = require('../controllers/FirmControler')
const verifyToken = require('../middleware/VerifyToken');
const FirmControler = require('../controllers/FirmControler');
// define router need to assign expressinside router
const router = express.Router()
// 
router.post('/add-firm',verifyToken,FirmControler.addFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;

    res.headersSent('Content-Type','image.jpeg');
    res.sendFile(Path.join(__dirname,'..','uploads',imageName));

});
module.exports = router;