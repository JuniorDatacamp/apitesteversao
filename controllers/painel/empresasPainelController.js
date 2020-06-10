const usuariosLogin = require('../../models/painel/empresasPainel');

exports.efetuarloginEmpresa = function(req, res){
    Promise.all([
        usuariosLogin.loginEmpresa(req.headers['x-access-token'])
    ])
    // na função THEN recuperamos o resultado de cada uma em um array. 
    // os valores sao retornados na ordem em que foram chamados
    .then(
        (resultados) => {

            if (resultados[0] == 0){
                res.status(422).json({mensagem: "Não foi encontrado empresa para efetuar o login."});
            }
            else{
                res.status(200).json({mensagem: "Logout efetuado com sucesso!."});
            }
        },
        (erro) => {
                res.status(500).json({mensagem: `Erro no logout!! [ ${erro} ]`});
        }
    );
};