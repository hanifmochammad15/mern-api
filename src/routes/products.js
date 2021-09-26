const express = require('express');
const router = express.Router();


const productsController = require('../controllers/products');
//CREATE -> POST
router.post('/product', productsController.createProduct);

//READ -> GET
router.get('/products',productsController.getAllProducts);


// router.put('/product',(req, res, next) => {
//     res.json({name : 'Mochammad hanif', email : 'hanif.mochammad@gmail.com'});

// });

// router.delete('/product',(req, res, next) => {
//     res.json({name : 'Mochammad hanif', email : 'hanif.mochammad@gmail.com'});

// });



module.exports = router;