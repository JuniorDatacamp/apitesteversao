const jwt = require('jwt-simple');
const moment = require('moment');
const globalConfig = require("../config/global");
const nonceKeySalt = globalConfig.nonceKeySalt;
const usuarioLogin = require("../models/painel/usuariosLogin");

function getTipoToken(){
    
    //modelo de token disponível
    const modeloToken = {app: nonceKeySalt.app, retaguarda: nonceKeySalt.retaguarda, painel: nonceKeySalt.painel};

    return modeloToken;
};

exports.getTipoToken = getTipoToken;

exports.gerarToken = function (diasVencimento, iss, modeloToken){

    //utilizar a função getTipoToken e depois passar o tipo do token no parametro para gerar.
    //iss = código para localização de usuarios/vendedores/email e etc.

    var criptToken = modeloToken;
    var issToken = iss;

    var expires = moment().add(diasVencimento, 'days').valueOf();
    var ResultToken = jwt.encode({
        iss: issToken,
        exp: expires
    }, criptToken);

    return ResultToken;
};

exports.getToken = function (res, oToken, modeloToken){

    try {
        var chaveToken = modeloToken;
        const varToken  = oToken;

        const decoded = jwt.decode(varToken, chaveToken);
        const codigoIss = decoded.iss;

        const objToken = {
            token: varToken,
            criptToken: chaveToken,
            iss: codigoIss
        };        
    
        return objToken;

    } catch (err) {
        return res.status(401).json({codigo: 401.003, mensagem: 'Erro: Seu token é inválido!'});
    }
};

exports.validarTokenApp = function(req, res, next){
    
    const criptToken = getTipoToken();
    const objToken = {token: req.headers['x-access-token'], chaveCript: criptToken.app};

    validarUsuario(objToken, res, next);
};

exports.validarTokenRetaguarda = function(req, res, next){
    
    const criptToken = getTipoToken();
    const objToken = {token: req.headers['x-access-token'], chaveCript: criptToken.retaguarda};

    validarUsuario(objToken, res, next);
};

exports.validarTokenPainel = function(req, res, next){
    
    const criptToken = getTipoToken();
    const token = req.headers['x-access-token'];

    // - Se existir um token, rodamos a função jwt.decode().
    if (token) {
        try {

            const decoded = jwt.decode(token, criptToken.painel);

            // - usamos o resultado do jwt.decode() para verificar se o token expirou.
            if (decoded.exp <= Date.now()) {
                res.status(401).json({codigo: 401.001, mensagem: 'Acesso Expirado, faça login novamente'});
            }

            return next();

        // - Caso aconteça algum erro
        } catch (err) {
            return res.status(401).json({codigo: 401.003, mensagem: 'Erro: Seu token é inválido!'});
        }
    } else {
        res.status(401).json({codigo: 401.004, mensagem: 'Token não encontrado ou não informado!'});
    }    
};

function validarUsuario(oToken, res, next) {

    const token = oToken.token;
    const chaveCript = oToken.chaveCript;

    // - Se existir um token, rodamos a função jwt.decode().
    if (token) {
        try {

            const decoded = jwt.decode(token, chaveCript);

            // - usamos o resultado do jwt.decode() para verificar se o token expirou.
            if (decoded.exp <= Date.now()) {
                res.status(401).json({codigo: 401.001, mensagem: 'Acesso Expirado, faça login novamente'});
            }

            //Recuperando se existe usuário com login na base de dados do painel de gerenciamento de licença.
            Promise.all([      
                usuarioLogin.retornarLogin(token)
            ])
            .then(
                (resultados) => {

                    if (resultados[0].length == 0){
                        res.status(401).json({codigo: 401.002, mensagem: "Usuário do token não encontrado. Verifique a permissão do painel de licença."});
                    }else{
                        return next();
                    }
                },
                (erro) => {
                    res.status(500).json({codigo: `Erro ao procurar usuario do token.!! [ ${erro} ]`});
                }
            );
        // - Caso aconteça algum erro
        } catch (err) {
            return res.status(401).json({codigo: 401.003, mensagem: 'Erro: Seu token é inválido!'});
        }
    } else {
        res.status(401).json({codigo: 401.004, mensagem: 'Token não encontrado ou não informado!'});
    }
};