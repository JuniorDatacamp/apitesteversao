const express = require("express");
const router = express.Router();

const usuarios = require('../controllers/painel/usuariosLoginController');
const token = require("../controllers/jwtController");

//Pesquisar usuários para efetuar logout
router.route('')
	.post(token.validarTokenApp, usuarios.efetuarlogout);

router.route('/retaguarda')
	.post(token.validarTokenRetaguarda, usuarios.efetuarlogout);

// retornando router
module.exports = router;