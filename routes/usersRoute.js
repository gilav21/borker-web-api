const express = require('express');
const UserController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('', checkAuth, UserController.getUsers);
router.delete('/:id', checkAuth, UserController.deleteUser);

// Login and Signup
router.post('/login', UserController.loginUser);
router.post('/signup', UserController.signup);
router.get('/checkUserName', UserController.checkUserName);
router.get('/checkEmail', UserController.checkEmail);
router.post('/renewToken', UserController.renewToken);

module.exports = router; 