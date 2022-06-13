const express = require('express');
const PetController = require('../controllers/petController');
const checkAuth = require('../middleware/check-auth');
const extractFiles = require('../middleware/files');
const router = express.Router();

// Basics
router.get('/pet/:petId', checkAuth, PetController.getPetById);
router.get('/petsByUserId', checkAuth, PetController.getPetsByUserId);
router.post('/createPet', checkAuth, PetController.createPet);

// Images
router.post('/petImages', checkAuth, extractFiles, PetController.petImages);
router.get('/petImages/:petId', checkAuth, PetController.getPetImages);
router.post('/changeProfileImage', checkAuth, PetController.changeProfileImage);
router.get('/petImage/:photoId', checkAuth, PetController.petImage);

// 

module.exports = router;