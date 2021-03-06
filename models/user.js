const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    identity:{
        type:String,
        required:true,
        unique:true
    },
    passport:{
        type:String,
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
        default:'BASIC'
    },
    //Think about adding picture identification
})

module.exports = mongoose.model('User', userSchema);