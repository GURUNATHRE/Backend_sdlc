const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true, // removes extra whitespace
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  productPrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Product price cannot be negative']
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
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    required: [true, 'Firm reference is required']
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

// Prevent OverwriteModelError in Next.js / hot reload environments
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
