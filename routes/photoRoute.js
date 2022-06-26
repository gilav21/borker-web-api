const express = require('express');
const PhotoController = require('../controllers/photoController');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/:photoId', checkAuth, PhotoController.getPhoto);
router.get('/reactions/:photoId', checkAuth, PhotoController.getReactions);
router.post('/addComment', checkAuth, PhotoController.addComment);
router.post('/addReaction', checkAuth, PhotoController.addReaction);

module.exports = router;