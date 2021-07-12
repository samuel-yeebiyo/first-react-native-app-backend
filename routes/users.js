const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



const User = require('../models/user');
const {Status} = require('../models/status')



//register users
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

//login with user
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

//get all users
router.get('/all', async(req,res,next)=>{
    console.log("Getting all users")
    let users = await User.find({auth:'BASIC'})
    console.log("Fetched all users and status")
    console.log(users)

    let payload = []
    users.map(async(item)=>{
        
        let date = item.date_joined.toString()
        let user = {
            name:item.identity,
            passport:item.passport,
            date:date,
        }
        payload = [...payload, user]
    })
    
    try{
        res.status(200).send({
            users:payload
        })
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router;
