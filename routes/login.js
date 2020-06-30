const express = require("express");
const router = express.Router();
const loginController = require('../controllers/loginController');

router.route('/')
	.post(loginController.login)

// retornando router
module.exports = router;