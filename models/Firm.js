const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: [true, 'Firm name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Firm name cannot exceed 100 characters']
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true
  },
  category: [
    {
      type: String,
      enum: {
        values: ['veg', 'non-veg'],
        message: '{VALUE} is not a valid category'
      }
    }
  ],
  region: [
    {
      type: String,
      enum: {
        values: ['south-india', 'north-india', 'chinese', 'Bakery'],
        message: '{VALUE} is not a valid region'
      }
    }
  ],
  offer: {
    type: String,
    trim: true,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  vendor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    }
  ],
  // relation with products
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Prevent OverwriteModelError in hot-reload environments
const Firm = mongoose.models.Firm || mongoose.model('Firm', firmSchema);

module.exports = Firm;
