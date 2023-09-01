const express = require('express');
const router = express.Router();

//Import Pets Controller
const PetsController = require('../controllers/PetsController');

//Middlewares
const verifyToken = require('../helpers/verify-token');
const {imageUpload} = require('../helpers/image-upload');

//Routes
router.post('/create', verifyToken, imageUpload.array('imagespet') ,PetsController.createPet);
router.get('/', PetsController.listPets);
router.get('/mypets', verifyToken,PetsController.getAllUserPets);
router.get('/myadoptions', verifyToken ,PetsController.getAllUserAdoptions);
router.get('/:id', PetsController.getPetById);
router.delete('/:id', verifyToken, PetsController.removePetById);
router.patch('/edit/:id', verifyToken, imageUpload.array('imagespet'), PetsController.updatePet);
router.patch('/schedule/:id', verifyToken, PetsController.scheduleAdoption);
router.patch('/conclude/:id', verifyToken, PetsController.concludeScheduleAdoption);

module.exports = router;