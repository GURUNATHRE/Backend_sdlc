
// to import express
const express = require("express");
// to import  info of .env
const dotenv = require('dotenv');
// we can access info env




const vendorRoutes = require('./routes/VendorRoutes');
// http request
const firmRoutes = require('./routes/FirmRoutes');

const productRoutes = require('./routes/Productroutes');
const bodyParser = require('body-parser')
const Path = require('path');


dotenv.config();
// to connect with database we use mangoose
const mongoose = require('mongoose');
// mongo mang0-rui in env to connect with the data base  
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongo ddb is connected '))
    .catch((error) => console.log(error))


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/product',productRoutes);
app.use('/firm',firmRoutes);
app.use('/uploads',express.static('uploads'));
app.listen(port, () => {
    console.log(`server started and running at port ${port}`)
})
app.use('/home', (req, res) => {
    res.send("<h1>welcome</h1>")
})