const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

//CREATE -> POST
router.post('/register', authController.register);

module.exports = router;