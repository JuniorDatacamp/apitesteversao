const usuariosModel = require('../models/usuariosModel');
const jwtController = require('../services/jwtController');
const enviarEmail = require('../services/enviarEmail');

module.exports = {    

    get (request, response){

        const { authorization } = request.headers;
        const { params } = request.params;

        const codEmpresa = jwtController.getUsuarioToken(authorization).codigo;

        usuariosModel.get(codEmpresa, params)
        .then(
            (resultados) => {
     
                response.status(200).json(
                    resultados
                );
            },
            (erro) => {
                response.status(500).json({error: `Erro ao pesquisar todas usuários!! [ ${erro} ]`});
            }
        );
    },

    insert (request, response){

        const usuario = { email, telefone, nome, codempresa, codvendedor, token, ativo } = request.body;

        const usuarioToken = jwtController.getUsuarioToken(request.headers['authorization']);

        if (usuarioToken.codigo != codempresa){
            response.status(400).json({
                error: "Usuário não pode ser incluido. Empresa informada não pertence ao login."
            });
        }else{

            usuariosModel.autorizadoInclusao(usuarioToken.documento)
            .then(
                (resultados) => {
        
                    usuariosModel.insert(usuario)
                    .then(
                        (resultados) => {
                
                            response.status(200).json(
                                resultados
                            );
                        },
                        (erro) => {
                            console.log(erro);
                            response.status(500).json({error: `Erro ao cadastrar usuário!! [ ${erro} ]`});
                        }
                    );
                },
                (erro) => {
                    response.status(401).json({error: `Não é permitido inserir mais usuários, verifiquei a quantidade de licença disponível! [ ${erro} ]`, code: erro});
                }
            )
        }
    },
    
    edit (request, response){

        const usuario = { id, email, telefone, nome, codempresa, codvendedor, token, ativo } = request.body;
        
        const usuarioToken = jwtController.getUsuarioToken(request.headers['authorization']);

        if (! id){
            response.status(400).json({
                error: "Não foi possível encontrar 'ID' do usuário."
            });
        }

        if (usuarioToken.codigo != codempresa){
            response.status(400).json({
                error: "Usuário não pode ser alterado. Empresa informada não pertence ao login."
            });            
        }

        usuariosModel.edit(usuario)
        .then(
            (resultados) => {
     
                response.status(200).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao editar usuário!! [ ${erro} ]`});
            }
        );
    },
    
    delete (request, response){

        const { params } = request.params;

        usuariosModel.delete(params)
        .then(
            (resultados) => {
     
                response.status(204).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao remover usuário!! [ ${erro} ]`});
            }
        );
    },

    atualizartoken (request, response){

        const dadosUsuario = { email, token } = request.body;

        usuariosModel.atualizarToken(dadosUsuario)
        .then(
            (resultados) => {
     
                response.status(200).json(resultados);
            },
            (erro) => {
                response.status(401).json({error: `Token do Usuário não foi atualizado! [ ${erro} ]`});
            }
        );
    },

    validarUsuario (request, response){

        const { token } = request.params;

        usuariosModel.validarUsuario(token)
        .then(
            (resultados) => {
     
                response.status(200).json(resultados);
            },
            (erro) => {
                response.status(401).json({error: `Usuário não está ativo ou não foi encontrado na base de dados!! [ ${erro} ]`, code: erro});
            }
        );
    },    

    enviarCodigoEmail (request, response){
        
        const email = request.params.email;
   
        Promise.all([
            usuariosModel.atualizarCodigoAcesso(email)
        ])
        .then(
            (resultados) => {

                Promise.all([
                    enviarEmail.enviarCodigoConfirmacaoConta(resultados[0].nomeUsuario, resultados[0].codigoConfirmacao, email)
                ])
                .then(
                    (resultadosEnviarEmail) => {
    
                        console.log(resultadosEnviarEmail[0].mensagem);
                       
                        const ResultToken = jwtController.gerarToken({codigo: email, documento: null, nivel: null});
    
                        response.status(200).json({
                            mensagem: resultados[0].nomeUsuario + ", foi enviado o código de confirmação para seu email.",
                            token: ResultToken
                        });                
                    },
                    (erroEnviarEmail) => {
                        response.status(500).json({mensagem: `Erro no envio do código de confirmação!! [ ${erroEnviarEmail} ]`});
                    }
                );
            },
            (erro) => {
    
                switch (erro) {
                    case 401.007:
                        response.status(401).json({status: erro, mensagem: "Usuário não encontrado."});                    
                        break;
                    default:
                        response.status(500).json({mensagem: `Erro ao atualizar código de confirmação!! [ ${erro} ]` });
                        break;
                }               
            }
        );
    },

    verificarCodigoAutorizacao (request, response){

        const usuarioToken = jwtController.getUsuarioToken(request.headers['authorization']);
        const email = usuarioToken.codigo;
        const codigoConfirmacao = request.params.codigoconfirmacao;

        Promise.all([
            usuariosModel.verificaCodigoAcesso(codigoConfirmacao, email)
        ])
        .then(
            (resultados) => {

                console.log('Retorno da Empresa: ' + resultados[0].emp_id);
                console.log('Retorno do vendedor: ' + resultados[0].usa_codigo_vendedor);
                console.log('Retorno da url: ' + resultados[0].emp_url);
                
                response.status(200).json({
                    codEmpresa: resultados[0].emp_id,
                    codVendedor: resultados[0].usa_codigo_vendedor,
                    url: resultados[0].emp_url,
                    mensagem: "Usuário autorizado no painel de licença."
                });
            },
            (erro) => {

                switch (erro) {
                    case 401.007:
                        response.status(401).json({status: erro, mensagem: "Código de autorização inválido."});
                        break;
                    default:
                        response.status(500).json({mensagem: `Erro na autorização do usuário no painel de licença! [ ${erro} ]` });
                        break;
                }
            }
        );        
    }
}