const express = require("express");
const router = express.Router();
const token = require("../controllers/jwtController");
const usuarios = require("../controllers/painel/usuariosLoginController");

router.route('/usuarios/enviocodigoemail/:email')
	.post(usuarios.enviarCodigoEmail);

router.route('/usuarios/confirmacaoemail/:codigoconfirmacao')
	.post(token.validarTokenPainel, usuarios.verificarCodigoAutorizacao);
	// .post(token.validarToken, usuarios.verificarCodigoAutorizacao);

// retornando router
module.exports = router;