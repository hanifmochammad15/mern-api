const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

// router.use('/products',(req, res, next) => {
//     // console.log('request :', req.originalUrl);
//     // console.log('request :', req.method);
//     res.json({name : 'Mochammad hanif', email : 'hanif.mochammad@gmail.com'});
//     next();//digunakan bila memiliki method selanjutnya tidak berhenti disini

// });

//routes
const productRoutes = require('./src/routes/products');
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');


const fileStorage = multer.diskStorage({
   
    destination : (req, file, cb) => {
        cb(null,'images');//nama path atau folder
        //cb(null, path.join(__dirname, "/images"));
    },
    filename : (req, file, cb) => {
        cb(null,new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //console.log(file);
    if( 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' 
        ){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

//middleware
//app.use(bodyParser.json());
app.use(express.json());
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single('image')); 
app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//menginzinkan semua browser dr url lain untuk mengakses url kita
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');//menginzinkan semua browser dr url lain untuk menggunakan method di list
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');//menginzinkan header dr url lain untuk menggunakan header di list
    next();
})

app.get('/',(req, res, next) => {
    res.json({message :"welcome to MERN Rest API"});
    next();//digunakan bila memiliki method selanjutnya tidak berhenti disini
});//hanya bisa method GET

app.use('/v1/customer',productRoutes);//use bisa menerima semua method GET,POST,DELETE,PUT
app.use('/v1/auth',authRoutes);
app.use('/v1/blog',blogRoutes);

app.use((error,req, res, next) => {
    const status = error.errorStatus || 500;//memeberikan status default 500
    const message = error.message;
    const data = error.data;

    res.status(400).json({message : message, data : data});
});//handle error dr throw error di controller


//mongoose.connect('mongodb+srv://hanif:0Ysxs1WVanJkuoYK@cluster0.xoo0o.mongodb.net/blog?retryWrites=true&w=majority')
mongoose.connect('mongodb://localhost:27017/blog?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false')
.then(()=>{
    app.listen(4080, ()=> console.log('Connection Success'));
}).catch(err => console.log(err));
//app.listen(4080);