const jwt = require('../services/jwtController');
const usuariosModel = require('../models/usuariosModel');
const empresasModel = require('../models/empresasModel');

/*
  1 - Primeiro vai verificar a quantidade de licença disponivel no painel da empresa.
  2 - Depois vai ser feito uma consulta no banco de dados se existe o usuario para login.

*/

module.exports = {       

    //Função validação de numero de usuarios ativos
    quantidadeNumRegistro (request, response){

        const { login, senha } = request.body;

        usuariosModel.autorizadoInclusao(login)
        .then(
            (resultados) => {
    
                response.status(204).json(resultados);
            },
            (erro) => {
                response.status(401).json({error: `Não é permitido inserir mais usuários, verifiquei a quantidade de licença disponível! [ ${erro} ]`, code: erro});
            }
        )
    },

    login (request, response){
        
        const dadosLogin = { login, senha } = request.body;

        empresasModel.login(dadosLogin)
        .then(
            (resultados) => {

                const usuarioToken = { codigo: resultados.id, documento: login, nivel: resultados.nivel};
               
                const oToken = jwt.gerarToken(usuarioToken);

                const autenticacao = {
                    codigo: resultados.id,
                    documento: login,
                    nome: resultados.nome,
                    nivel: resultados.nivel,
                    url: resultados.url,
                    token: oToken
                };
   
                response.status(200).json(autenticacao);
            },
            (erro) => {
                switch (erro) {
                    case 401.005:
                        response.status(401).json({code: 401.005, mensagem: "Empresa não encontrada no painel de licença."});
                        break;
                    default:
                        response.status(500).json({mensagem: `Erro ao efetuar login! [ ${erro} ]` });
                        break;
                } 
            }
        )
    }
}