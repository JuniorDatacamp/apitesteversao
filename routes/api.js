const express = require("express");
const router = express.Router();
const jwtController = require('../services/jwtController');

const configuracoesController = require('../controllers/configuracoesController');
const empresasController = require('../controllers/empresasController');
const usuariosController = require('../controllers/usuariosController');

router.route('/configuracoes')
	.get(jwtController.validarToken, jwtController.validarAdmin, configuracoesController.get)
	.post(jwtController.validarToken, jwtController.validarAdmin, configuracoesController.insert)
	.put(jwtController.validarToken, jwtController.validarAdmin, configuracoesController.edit)

router.route('/configuracoes/:id')
	.delete(jwtController.validarToken, jwtController.validarAdmin, configuracoesController.delete)

router.route('/empresas')
	.get(jwtController.validarToken, jwtController.validarAdmin, empresasController.get)	
	.post(jwtController.validarToken, jwtController.validarAdmin, empresasController.insert)
	.put(jwtController.validarToken, jwtController.validarAdmin, empresasController.edit)

router.route('/empresas/:params')
	.get(jwtController.validarToken, jwtController.validarAdmin, empresasController.get)
	.delete(jwtController.validarToken, jwtController.validarAdmin,empresasController.delete)

router.route('/usuarios')
	.get(jwtController.validarToken, usuariosController.get)
	.post(jwtController.validarToken, usuariosController.insert)
	.put(jwtController.validarToken, usuariosController.edit)

router.route('/usuarios/:params')
	.get(jwtController.validarToken, usuariosController.get)
	.delete(jwtController.validarToken, usuariosController.delete)

// retornando router
module.exports = router;