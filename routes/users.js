const express = require('express');
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
// const extractFile = require('../middleware/file');
const router = express.Router();

router.get('', checkAuth, UserController.getUsers);
router.delete('/:id', checkAuth, UserController.deleteUser);

// Login and Signup
router.post('/login', UserController.loginUser);
router.post('/signup', UserController.signup);

module.exports = router; 