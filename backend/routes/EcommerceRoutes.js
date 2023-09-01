const express = require('express');
const router = express.Router();

//Import controller
const EcommerceController = require('../controllers/EcommerceController');

//Middlewares
const {imageUpload} = require('../helpers/image-upload');

//Routes
router.post('/create', imageUpload.array('imagesProduct'),EcommerceController.createProduct);
router.delete('/remove/:id', EcommerceController.deleteProduct)
router.patch('/update/:id', imageUpload.array('imagesProduct'), EcommerceController.updateProduct);
router.get('/list', EcommerceController.listProducts);


module.exports = router;