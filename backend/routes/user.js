"use strict";
const express = require('express');
const router = express.Router();
const userControler = require('../controllers/user');
const password = require('../middleware/password');

router.post('/signup',password, userControler.signup);
router.post('/login', userControler.login);






module.exports = router;