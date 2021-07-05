const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



const User = require('../models/user');

router.post('/', async (req,res)=>{

    let exist = await User.findOne({passport: req.body.passnumber})
    if(exist == null){
        try{
            //hash password
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            
            //create new user with hashed password
            let user = new User({
                username: req.body.username,
                passport: req.body.passnumber,
                password:hashedPass
                //think about adding pictures
            })
            console.log("User created successfully!")

            //save user to database
            try{
                user = await user.save()
                console.log("User has been saved")
                //control session or in this case, send response and allow access.
            }catch(e){
                console.log("Problem encountered")
            }
        }catch(e){
            console.log("Registration Failed")
            res.status(500).send("Failed")
        }
    }

})

