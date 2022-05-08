const express = require('express');
const PetController = require('../controllers/pet');
const checkAuth = require('../middleware/check-auth');
const extractFiles = require('../middleware/files');
const router = express.Router();

router.get('/petsByUserId', checkAuth, PetController.getPetsByUserId);
router.post('/petImages', checkAuth, extractFiles, PetController.petImages);
router.get('/petImage/:fileName', checkAuth, PetController.petImage);
router.post('/createPet', checkAuth, PetController.createPet);

module.exports = router;