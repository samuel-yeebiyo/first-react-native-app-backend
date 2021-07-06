const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    identity:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date_joined:{
        type:Date,
        default:Date.now
    },
    auth:{
        type:String,
        default:'ADMIN'
    },
   //Think about adding a picture
})

module.exports = mongoose.model('Admin', adminSchema);