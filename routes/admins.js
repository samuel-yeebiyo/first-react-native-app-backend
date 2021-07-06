const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



const Admin = require('../models/admin');

router.post('/', async (req,res)=>{

    let exist = await Admin.findOne({passport: req.body.id})
    if(exist == null){
        try{
            //hash password
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            
            //create new admin user with hashed password
            let admin = new Admin({
                identity: req.body.id,
                password:hashedPass
                //think about adding pictures
            })
            console.log("Admin user created successfully!")
            console.log(admin)

            //save admin user to database
            try{
                admin = await admin.save()
                console.log("Admin user has been saved")
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

module.exports = router;
