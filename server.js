const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));


//connect to my mongoDB database
mong.connect(process.env.connection_key, {useNewUrlParser: true, userUnifiedTopolgy: true}, () =>{
    console.log("Database connected!")
})



//route configurations
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admins')

//server routes
app.use('/users', userRouter);
app.use('/admins', adminRouter);