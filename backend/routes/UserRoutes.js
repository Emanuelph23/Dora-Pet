const express = require('express');
const router = express.Router();

//Import controller
const UserController = require('../controllers/UserController');

//Import middleware
const checkToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

//Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.patch('/shopping/:id', checkToken ,UserController.shoppingUser);
router.get('/checkuser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/edit/:id', checkToken, imageUpload.single("avatar"),UserController.editUser);

module.exports = router;
