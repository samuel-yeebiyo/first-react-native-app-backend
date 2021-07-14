const express = require('express');
const router = express.Router();
const {Hospital, Dates, Status, Vaccine, Book, Doctor, Avail, Range} = require('../models/status')

//add hospital
router.post('/hospital/add', async (req,res)=>{
    console.log("Called post to add hospital")

    let exist = await Hospital.findOne({name: req.body.name})
    if(exist == null){
        try{
            
            //create new hospital with hashed password
            let hospital = new Hospital({
                name: req.body.name,
                location: req.body.location
            })
            console.log("hospital created successfully!")
            console.log(hospital)

            //save user to database
            try{
                console.log("Trying to save..")
                await hospital.save()
                console.log("hospital has been saved")
                
                //control session or in this case, send response and allow access.
                res.status(200).send({})
            }catch(e){
                console.log("Problem encountered")
            }
        }catch(e){
            console.log("Registration Failed")
            res.status(500).send("Failed")
        }
    }

})

//get all hospitals
router.get('/hospitals', async (req,res, next)=>{
   console.log("Called")
    let hospitals = await Hospital.find()
    console.log("fetched all hospitals")
    console.log("type: ", typeof(hospitals))
    try{
        res.status(200).send({hospitals})
    }catch(e){
        res.status(500).send();
    }
})

//get status of current user
router.post('/user/status', async(req,res,next)=>{
    console.log("Getting user status")
    let status = await Status.findOne({passport:req.body.passport})

    if(status != null){
        res.status(200).send({
            vaccinated:status.vaccinated,
            booking_information:status.booking_information
        })
    }

})

//get all status
router.get('/user/status/all', async(req,res,next)=>{
    console.log("Getting user status")
    let status = await Status.find()

    if(status != null){
        res.status(200).send({status})
    }
})


//get all vaccines
router.get('/vaccines', async (req,res, next)=>{
    console.log("Called")
    let vaccines = await Vaccine.find()
    console.log("fetched all vaccines")
    console.log(vaccines)
    console.log("type: ", typeof(vaccines))
    try{
        res.status(200).send({vaccines})
    }catch(e){
        res.status(500).send();
    }
     
})

//find the available doctor based on booking information (hospital and date)
router.post('/profess', async(req,res,next)=>{
    console.log("Finding available doctors")

    console.log("Request made", req.body)

    const doctors = await Doctor.find()
    console.log("Hospital: ",doctors[0].availability)

    if(doctors != null){
        let doctor =[]
        doctors.map((doc)=>{
            console.log("doc: ", doc)
            doc.availability.map((item)=>{
                console.log("item: ", item.hospital.name , "   request:",req.body.hospital)
                if(item.hospital.name == req.body.hospital){
                    item.time.map((tim)=>{
                        console.log("time: ", tim)
                        if(tim.day == req.body.date){
                            doctor = [...doctor, doc]
                        }
                    })
                }
                
            })

            
        })
        
        console.log(doctor)
        res.status(200).send({
            docs:doctor
        })
    }
})

//book an appointment
router.post('/book', async(req,res,next)=>{
    console.log("Confirming booking");

    console.log("Booking info:", req.body)
    
    let exist = await Book.findOne({passport: req.body.passport})
    if(exist == null){
        try{
            let hospital = new Hospital({
                name:req.body.hospital.name,
                location:req.body.hospital.location
            })
            console.log("Created hospital");
            let range;
            req.body.doctor.availability.map((th)=>{
                console.log("       In availability")
                if(th.hospital.name == req.body.hospital.name){
                    console.log("       Found matching hospital")
                    console.log("Day: ", req.body.date.day)
                    th.time.map((item)=>{
                        console.log("Found: ", item.day)
                        if(item.day == req.body.date.day){
                            range = new Range({
                                day:req.body.date.day,
                                from:item.from,
                                to:item.to
                            })
                        }
                    })
                }
            })
            console.log("Created range");

            let avail = new Avail({
                time:[range],
                hospital:hospital
            });
            console.log("Created avail");

            let doctor = new Doctor({
                name:req.body.doctor.name,
                availability:[avail]
            })
            console.log("Created doctor");

            let vaccine = new Vaccine({
                name:req.body.vaccine.name,
                nDose:req.body.vaccine.nDose,
                gap_days:req.body.vaccine.gap_days,
                information:req.body.vaccine.information
            })
            console.log("Created vaccine");



            let dates = new Dates({
                day:req.body.date.day,
                formal:req.body.date.formal
            })
            let book1 = new Book({
                passport:req.body.passport,
                date:dates,
                hospital:hospital,
                doctor:doctor,
                vaccine:vaccine,
                doseNumber:1
            })

            console.log("First booking confirmed")
        
            const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

            let book2;
            if(vaccine.nDose == 2){
                let add = parseInt(vaccine.gap_days)

                let full = req.body.date.formal.split("/")
                let d = parseInt(full[0])
                let m = parseInt(full[1])-1
                let y = parseInt(full[2])

                let newD = new Date(y,m,d);
                newD.setDate(newD.getDate()+add)

                let nWeek = newD.getDay()
                let day= newD.getDate()
                let month= newD.getMonth()+1
                let year= newD.getFullYear()

                let dWeek = days[nWeek-1]
                console.log("DWEEK:", nWeek)
                let form = day+"/"+month+"/"+year

                let next = new Dates({
                    day:dWeek,
                    formal:form
                }) 
                

                book2 = new Book({
                    passport:req.body.passport,
                    date:next,
                    hospital:hospital,
                    doctor:doctor,
                    vaccine:vaccine,
                    doseNumber:2
                })

                console.log("Seocond Booking confirmed")
            }

            let bookings = [book1]
            if(book2){
                bookings=[...bookings, book2]
            }

            let status;

            let full = book1.date.formal.split("/")
            let d = parseInt(full[0])
            let m = parseInt(full[1])-1
            let y = parseInt(full[2])

            let newD = new Date(y,m,d);

            
            

            if(newD < Date.now() && vaccine.nDose == 2){
                status = new Status({
                    passport:req.body.passport,
                    vaccinated:"First dose administered",
                    booking_information:bookings
                })
            }else{
                status = new Status({
                    passport:req.body.passport,
                    booking_information:bookings
                })
            }

            

            //save booking to database
            try{
                console.log("Trying to save..")
                await book1.save()
                if(book2){
                    await book2.save()
                }
                console.log("Booking(s) saved")

                console.log("Saving status")
                await status.save()
                console.log("Saved status")
                
                //control session or in this case, send response and allow access.
                res.status(200).send({
                })
            }catch(e){
                console.log("Problem encountered")
            }


        }catch(e){
            console.log(e)
        }
    }


})

//add a vaccine
router.post('/vaccine/add', async(req,res,next)=>{
    console.log("Tying to add vaccine");

    let exist = await Vaccine.findOne({name: req.body.name})
    if(exist == null){
        try{
            
            //create new vaccine
            let vaccine = new Vaccine({
                name: req.body.name,
                nDose: parseInt(req.body.nDose),
                gap_days:parseInt(req.body.gap_days),
                information:req.body.information
            })
            console.log("vaccine created successfully!")
            console.log(vaccine)

            //save user to database
            try{
                console.log("Trying to save..")
                await vaccine.save()
                console.log("vaccine has been saved")
                
                //control session or in this case, send response and allow access.
                res.status(200).send({
                })
            }catch(e){
                console.log("Problem encountered")
            }
        }catch(e){
            console.log("Registration Failed")
            res.status(500).send("Failed")
        }
    }


})

//add a doctor
router.post('/doctor/add', async (req,res, next)=>{
    console.log("Trying to add doctor")

    let exist = await Doctor.findOne({name: req.body.name})
    if(exist == null){
        try{
            //Create a range
            let avails = []

            req.body.access.map((one)=>{
                console.log("creating hospital");
                let hospit = new Hospital({
                    name:one.hospital.name,
                    location:one.hospital.location
                })

                let ranges =[]
                one.time.map((two)=>{
                    console.log("creating ranges")
                    let range = new Range({
                        day:two.day,
                        from:two.from,
                        to:two.to
                    })
                    ranges = [...ranges, range]
                })

                console.log("Creating availabilities")
                let avail = new Avail({
                    hospital:hospit,
                    time:ranges
                })
                avails = [...avails, avail]
            })

            //Create doctor
            let doctor = new Doctor({
                name:req.body.name,
                availability:avails
            })


            console.log("doctor created successfully!")
            console.log(doctor)

            //save user to database
            try{
                console.log("Trying to save..")
                user = await doctor.save()
                console.log("doctor has been saved")
                //control session or in this case, send response and allow access.
                res.status(200).send({
    
                })
            }catch(e){
                console.log("Problem encountered")
            }
        }catch(e){
            console.log("Registration Failed")
            res.status(500).send("Failed")
        }
    }

})




module.exports = router;