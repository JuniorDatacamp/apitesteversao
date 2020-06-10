const express = require("express");
const router = express.Router();
const usuariologin = require('../controllers/loginController');
// const loginVendedor = require('../controllers/loginVendedorController');
// const loginValidation = require("../controllers/loginController") ;

/**
 * Função para validação do token recebido e dizer qual banco deverá ser acessado
 * 
 * @param codEmp
 * @param codVend
 * @param senha
 *
**/

router.route('')
		.post(usuariologin.login);

router.route('/retaguarda')
		.post(usuariologin.loginRetaguarda);

// retornando router
module.exports = router;