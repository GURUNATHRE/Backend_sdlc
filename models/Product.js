const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  productPrice: {
    type: Number,
    required: [true, 'Product price is required']
  },
  category: {
    type: String,
    enum: {
      values: ['veg', 'non-veg'],
      message: '{VALUE} is not a valid category'
    },
    required: [true, 'Category is required']
  },
  image: {
    type: String,
    default: null
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: [true, 'Firm reference is required']
  }
});

// Prevent OverwriteModelError
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
