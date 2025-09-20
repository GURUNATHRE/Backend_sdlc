const express = require('express');
const router = express.Router(); 

const ProductControler = require('../controllers/ProductControllers');

router.post('/addProduct/:firmId', ProductControler.addProducts);

router.get('/productbyId/:firmId',ProductControler.getproductbyFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;

    res.headersSent('Content-Type','image.jpeg');
    res.sendFile(Path.join(__dirname,'..','uploads',imageName));

});

router.delete('/:productId',ProductControler.deletProductBYId);

module.exports = router;