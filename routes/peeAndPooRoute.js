const express = require('express');
const peeAndPooController = require('../controllers/peeAndPooController');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/:petId', checkAuth, peeAndPooController.getPeeAndPooByPetId);
router.post('/createPeeAndPoo', checkAuth, peeAndPooController.createPeeAndPoo);

module.exports = router;