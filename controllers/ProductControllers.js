const path = require('path');
const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add Product
const addProduct = async (req, res) => {
  try {
    const { productName, productPrice, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ error: "No firm found" });

    const product = new Product({
      productName,
      productPrice,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    // Push only the ID to firm's product array
    firm.product.push(savedProduct._id);
    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Products by Firm
const getproductbyFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    // Populate the products array in the firm
    const firm = await Firm.findById(firmId).populate('product');
    if (!firm) return res.status(404).json({ error: "Firm id not found..." });

    return res.status(200).json({
      message: "Firm id found successfully",
      Restaurant: firm.firmName,
      products: firm.product 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deletProductBYId = async(req,res)=>{
  try{
    const productId = req.params.productId;

    const DeleteProduct = await Product.findByIdAndDelete(productId);

    if(!DeleteProduct){
      return res.status(404).json({error:'no product found'})
    }
    res.status(200).json({message:"product deleted succesfully"})
  }
  catch(error){
    console.log(error);
    res.status(500).json({error:"internal server eroor"});
  }
}
module.exports = { addProducts: [upload.single('image'), addProduct], getproductbyFirm ,deletProductBYId};
