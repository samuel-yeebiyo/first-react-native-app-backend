const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require('fs')

const Storage = multer.diskStorage({
    destination(req,file,callback){
        callback(null, '../images');
    },
    filename(req,file,callback){
        callback(null,`${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
}) 

const upload = multer({storage: Storage})



router.post('/', async (req,res)=>{
    console.log("Called")
    fs.writeFile('./images/'+req.body.id+'.png', req.body.imgsource, 'base64', (err)=>{
        if(err) throw err
    })
    console.log('body', req.body);
    res.status(200).json({
        message:'success'
    })
})

router.get('/image', express.static(__dirname+'./images'));

module.exports = router;
