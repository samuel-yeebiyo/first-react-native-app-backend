const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    name:{
        type:String
    },
    location:{
        type:String
    }
})

const bookingSchema = mongoose.Schema({
    date:{
        type:Date
    },
    hospital:{
        type:hospitalSchema
    }
})

const availabilitySchema = mongoose.Schema({
    date:{
        type:Date
    },
    hospital:{
        type:hospitalSchema
    }
})

const doctorSchema = mongoose.Schema({
    name:{
        type:String
    },
    hospital:{
        type:[hospitalSchema]
    },
    availability:{
        type:availabilitySchema
    }
})

const vaccinationSchema = mongoose.Schema({
    doctor:{
        type:doctorSchema
    },
    date:{
        type:Date
    }
})

const statusSchema = mongoose.Schema({
    passport:{
        type:String,
        required:true,
        unique:true
    },
    vaccinated:{
        type:String,
        default:'No'
    },
    vaccine:{
        type:String,
    },
    booking_information:{
        type:bookingSchema
    },
    vaccination_record:{
        type:
    }
    //Think about adding picture identification
})

module.exports = mongoose.model('Status', statusSchema);