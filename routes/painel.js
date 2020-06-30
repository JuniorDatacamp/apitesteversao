const express = require("express");
const router = express.Router();
const token = require("../services/jwtController");
const usuarios = require("../controllers/usuariosController");

router.route('/usuarios/enviocodigoemail/:email')
	.post(usuarios.enviarCodigoEmail);

router.route('/usuarios/confirmacaoemail/:codigoconfirmacao')
    .post(token.validarToken, usuarios.verificarCodigoAutorizacao);
    
router.route('/verificausuario/:token')
	.post(usuarios.validarUsuario);

router.route('/atualizartoken/')
	.post(usuarios.atualizartoken);	


// retornando router
module.exports = router;