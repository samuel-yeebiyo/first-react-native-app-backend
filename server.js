require('dotenv').config()
const express = require('express');
const app = express();
const mong = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit:'15MB'}))



//connect to my mongoDB database
mong.connect(process.env.connection_key, {useNewUrlParser: true, userUnifiedTopolgy: true}, () =>{
    console.log("Database connected!");
})


//route configurations
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admins')
const healthRouter = require('./routes/healthRouter')
const uploadRouter = require('./routes/uploadRouter')




//server routes
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/healthcare', healthRouter);
app.use('/upload', uploadRouter);
app.use('/image', express.static(__dirname+'/images'))

app.listen(3000, ()=>{
    console.log("Server listening on port 300...")
})