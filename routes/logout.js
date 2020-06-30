const express = require("express");
const router = express.Router();
const logoutController = require('../controllers/logoutController');
// const token = require("../controllers/jwtController");

/* Exemplo de arquivos
		{
			"logout":{
				"codEmpresa": 4,
				"codVendedor": 2
			}
		}
*/

// Pesquisar usuários para efetuar logout
router.route('')
	.post(logoutController.efetuarlogout);

// router.route('/retaguarda')
// 	.post(token.validarTokenRetaguarda, usuarios.efetuarlogout);

// retornando router
module.exports = router;