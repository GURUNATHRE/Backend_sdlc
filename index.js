// index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const vendorRoutes = require("./routes/VendorRoutes");
const firmRoutes = require("./routes/FirmRoutes");
const productRoutes = require('./routes/Productroutes');

// const productRoutes = require('./routes/ProductRoutes'); // add if needed

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Allow both dev + production origins
const allowedOrigins = [
  "http://localhost:5173",        // local dev
  "https://sdlc-e0s2.onrender.com/"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
};

// ✅ Use cors middleware
app.use(cors(corsOptions));

// ✅ Log request origins for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl} | Origin: ${req.headers.origin || "no-origin"}`);
  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes); // enable if you have products

// ✅ Home route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Suby Backend</h1>");
});

// ✅ MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
