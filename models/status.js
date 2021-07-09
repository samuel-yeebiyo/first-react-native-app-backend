const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    name:{
        type:String
    },
    location:{
        type:String
    }
})
const hospital = mongoose.model("hospital", hospitalSchema);

const vaccineSchema = mongoose.Schema({
    name:{
        type:String
    },
    nDose:{
        type:Number
    },
    gap_days:{
        type:Number
    },
    information:{
        type:String
    }
})

const vaccine = mongoose.model("vaccine", vaccineSchema);


const rangeSchema = mongoose.Schema({
    day:{
        type:String
    },
    from:{
        type:String
    },
    to:{
        type:String
    }
})

const range = mongoose.model("range", rangeSchema)

const availabilitySchema = mongoose.Schema({
    time:{
        type:[rangeSchema]
    },
    hospital:{
        type:hospitalSchema
    }
})

const availability = mongoose.model("availability", availabilitySchema);

const doctorSchema = mongoose.Schema({
    name:{
        type:String
    },
    availability:{
        type:[availabilitySchema]
    }
})

const doctor = mongoose.model("doctor", doctorSchema);


const vaccinationSchema = mongoose.Schema({
    doctor:{
        type:doctorSchema
    },
    date:{
        type:Date
    },
    vaccine:{
        type:vaccineSchema
    }
})

const vaccination = mongoose.model("vaccination", vaccinationSchema);

const dateSchema = mongoose.Schema({
    day:{
        type:String
    },
    formal:{
        type:String
    }

})

const date = mongoose.model('date', dateSchema)


const bookingSchema = mongoose.Schema({
    passport:{
        type:String
    },
    date:{
        type:dateSchema
    },
    hospital:{
        type:hospitalSchema
    },
    doctor:{
        type:doctorSchema
    },
    vaccine:{
        type:vaccineSchema
    },
    doseNumber:{
        type:Number
    },
    done:{
        type:Boolean,
        default:false
    }
})

const booking = mongoose.model("booking", bookingSchema);



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
    booking_information:{
        type:[bookingSchema]
    }
})

const status = mongoose.model("status", statusSchema);

module.exports = {
    'Status': status,
    'Hospital':hospital,
    'Vaccine':vaccine,
    'Doctor':doctor,
    'Avail':availability,
    'Range': range,
    'Book':booking,
    'Dates':date
}