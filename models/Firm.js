const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    unique: true
  },
  area: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      enum: ['veg', 'non-veg'] // match Product model
    }
  ],
  region: [
    {
      type: String,
      enum: ['south-india','north-india','chinese','Bakery']
    }
  ],
  offer: {
    type: String
  },
  image: {
    type: String
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
});

const Firm = mongoose.model('Firm', firmSchema);
module.exports = Firm;
