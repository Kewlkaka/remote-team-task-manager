const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router();
//reyans
const path = require('path');

//signup process:
router.post('/create-account/signup/orgAccount', userController.signup);

//login process;
router.post('/sign-in/login', userController.login);
//reyans
module.exports = router;