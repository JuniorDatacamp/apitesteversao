const jwt = require('jwt-simple');
const moment = require('moment');
const globalConfig = require("../config/global");
const nonceKeySalt = globalConfig.nonceKeySalt.value;

function usuarioToken(oToken){
    const token  = oToken;
    const decoded = jwt.decode(token, nonceKeySalt);
    const codigoVendedor = decoded.iss;
    
    return codigoVendedor;
}

module.exports = {

    gerarToken(usuario){
   
        // Moment pra dizer quantidade de dias que o token ira expirar
        var expires = moment().add(10, 'minute').valueOf();
        var ResultToken = jwt.encode({
            iss: {codigo: usuario.codigo, documento: usuario.documento, nivel: usuario.nivel},
            exp: expires
        }, nonceKeySalt);
    
        return ResultToken;
    },

    getUsuarioToken(oToken){
        return usuarioToken(oToken)
    },

    validarAdmin(req, res, next){
              
        const token = req.headers['authorization'];
        const usuario = usuarioToken(token);

        if (usuario.nivel !== 0){
            return res.status(401).json({codigo: 401, mensagem: 'Usuário não permitido para essa ação!'}); 
        }

        return next();
    },

    validarToken (req, res, next) {
   
        const token = req.headers['authorization'] || req.headers['x-access-token'];
    
        // - Se existir um token, rodamos a função jwt.decode().
        if (token) {
            try {
    
                const decoded = jwt.decode(token, nonceKeySalt);
                const codigoUsuario = decoded.iss.codigo;
                const documento = decoded.iss.documento;
                const nivelUsuario = decoded.iss.nivel;
    
                // - usamos o resultado do jwt.decode() para verificar se o token expirou.
                if (decoded.exp <= Date.now()) {                    
                    res.status(401).json({codigo: 401.001, mensagem: 'Acesso Expirado, faça login novamente'});
                }else{
                    return next();
                }                
    
            // - Caso aconteça algum erro
            } catch (err) {
                return res.status(401).json({codigo: 401.003, mensagem: 'Erro: Seu token é inválido!'});
            }
        } else {
            res.status(401).json({codigo: 401.004, mensagem: 'Token não encontrado ou não informado!'});
        }
    }
}