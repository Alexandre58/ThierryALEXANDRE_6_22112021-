"use strict";
const express = require('express');
const router = express.Router();
const userControle = require('../controllers/user');
const password = require('../middleware/password');

router.post('/signup',password, userControle.signup);
router.post('/login', userControle.login);






module.exports = router;