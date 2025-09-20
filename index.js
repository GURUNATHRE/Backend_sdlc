// Import express
const express = require("express");
// Import dotenv
const dotenv = require('dotenv');
// Import routes
const cors = require("cors");
const vendorRoutes = require('./routes/VendorRoutes');
const firmRoutes = require('./routes/FirmRoutes');
const productRoutes = require('./routes/Productroutes'); // ✅ fixed capitalization
const path = require('path');
// MongoDB
const mongoose = require('mongoose');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB is connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true
}));

app.use(express.json()); // ✅ bodyParser.json() not needed
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/vendor', vendorRoutes);
app.use('/product', productRoutes);
app.use('/firm', firmRoutes);

// Homepage route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Suby</h1>");
});

// Start server
app.listen(port, () => {
    console.log(`Server started and running at port ${port}`);
});
