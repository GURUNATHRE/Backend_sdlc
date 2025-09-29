// index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const vendorRoutes = require("./routes/VendorRoutes");
const firmRoutes = require("./routes/FirmRoutes");
// const productRoutes = require('./routes/ProductRoutes'); // add if needed

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin);
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
    return res.sendStatus(200);
  }
  next();
});

// Body parser
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
// app.use("/product", productRoutes); // enable if you have products

// Home route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Suby Backend</h1>");
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
