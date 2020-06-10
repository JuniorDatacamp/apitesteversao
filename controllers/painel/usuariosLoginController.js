const jwt = require('../jwtController');
const usuariosLogin = require('../../models/painel/usuariosLogin');
const enviarEmail = require('../../email/enviarEmail');

exports.efetuarlogout = function(req, res){
    Promise.all([
        usuariosLogin.logout(req.headers['x-access-token'])
    ])
    .then(
        (resultados) => {

            if (resultados[0] == 0){
                res.status(422).json({mensagem: "Não foi encontrado vendedor para efetuar o logout."});
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

exports.enviarCodigoEmail = function(req, res){

    const email = req.params.email;

    console.log(email);

    Promise.all([
        usuariosLogin.atualizarCodigoAcesso(email)
    ])
    .then(
        (resultados) => {
            
            Promise.all([
                enviarEmail.enviarCodigoConfirmacaoConta(resultados[0].nomeUsuario, resultados[0].codigoConfirmacao, email)
            ])
            .then(
                (resultadosEnviarEmail) => {

                    console.log(resultadosEnviarEmail[0].mensagem);
                   
                    const tipoTokenGerar = jwt.getTipoToken();
                    const ResultToken = jwt.gerarToken(1, email, tipoTokenGerar.painel);

                    res.status(200).json({
                        mensagem: resultados[0].nomeUsuario + ", foi enviado o código de confirmação para seu email.",
                        token: ResultToken
                    });                
                },
                (erroEnviarEmail) => {
                    res.status(500).json({mensagem: `Erro no envio do código de confirmação!! [ ${erroEnviarEmail} ]`});
                }
            );
        },
        (erro) => {

            switch (erro) {
                case 401.007:
                    res.status(401).json({status: erro, mensagem: "Usuário não encontrado."});                    
                    break;
                default:
                    res.status(500).json({mensagem: `Erro ao atualizar código de confirmação!! [ ${erro} ]` });
                    break;
            }               
        }
    );
};

exports.verificarCodigoAutorizacao = function(req, res){

    const tipoToken = jwt.getTipoToken();
    const token = req.headers['x-access-token'];
    const email = jwt.getToken(res, token, tipoToken.painel).iss;
    const codigoConfirmacao = req.params.codigoconfirmacao;

    console.log('Código de confirmação: '+ codigoConfirmacao);
    console.log('Email na confirmação: '+ email);    

    Promise.all([
        usuariosLogin.verificaCodigoAcesso(codigoConfirmacao, email)
    ])
    .then(
        (resultados) => {

            console.log('Retorno da Empresa: ' + resultados[0].emp_id);
            console.log('Retorno do vendedor: ' + resultados[0].usa_codigo_vendedor);
            console.log('Retorno da url: ' + resultados[0].emp_url);
            
            res.status(200).json({
                codEmpresa: resultados[0].emp_id,
                codVendedor: resultados[0].usa_codigo_vendedor,
                url: resultados[0].emp_url,
                mensagem: "Usuário autorizado no painel de licença."                
            });
        },
        (erro) => {

            switch (erro) {
                case 401.007:
                    res.status(401).json({status: erro, mensagem: "Código de autorização inválido."});
                    break;
                default:
                    res.status(500).json({mensagem: `Erro na autorização do usuário no painel de licença! [ ${erro} ]` });
                    break;
            }
        }
    );
};