const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



const User = require('../models/user');



router.post('/', async (req,res)=>{
    console.log("Called post to users")

    let exist = await User.findOne({passport: req.body.passport})
    if(exist == null){
        try{
            //hash password
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            
            //create new user with hashed password
            let user = new User({
                identity: req.body.name,
                passport: req.body.passport,
                password:hashedPass
                //think about adding pictures
            })
            console.log("User created successfully!")
            console.log(user)

            //save user to database
            try{
                console.log("Trying to save..")
                user = await user.save()
                console.log("User has been saved")
                
                //control session or in this case, send response and allow access.
                res.status(200).send({
                    payload:{
                        identity:user.identity,
                        passport:user.passport,
                        auth:user.auth
                    },
                    allow: true
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

router.post('/login', async (req,res, next)=>{
    let user = await User.findOne({passport: req.body.id})
    if(user == null){
        user = await User.findOne({identity: req.body.id})
    }
   
    if(user==null){
        console.log("User not found");
        res.status(400).send({allow: false});
    }
    try{
        if( await bcrypt.compare(req.body.password, user.password)){
            console.log("found user")
            res.status(200).send({
                payload:{
                    identity:user.identity,
                    passport:user.passport,
                    auth:user.auth
                }, 
                allow: true
            })
        }else{
            res.send("Wrong password")
        }
    }catch(e){
        res.status(500).send();
    }
})

module.exports = router;
