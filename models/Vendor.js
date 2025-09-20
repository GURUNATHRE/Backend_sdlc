// Model 
// ....Vendor(signin,register)
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    username:{
        type : String,
        required:true
    },
    email :{
        type:String,
        required : true,
        unique : true,
    },
    password : {
        type:String,
        required : true
    },
    // reation define with vendor 
    firm : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Firm'
            }
        ]
});



// to save this schema in mongo we need controler...... and route........;;;;
const Vendor = mongoose.model('Vendor',vendorSchema);
module.exports = Vendor;