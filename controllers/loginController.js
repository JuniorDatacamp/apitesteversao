const requestServer = require('request');

const jwt = require('../controllers/jwtController');
const vendedores = require('../models/vendedores');
const departamentos = require('../models/departamentos');
const clientes = require('../models/clientes');
const municipios = require('../models/municipios');
const tiposPagtos = require('../models/tipoPagtos');
const tiposPedido = require('../models/tiposPedido');
const produtos = require('../models/produtos');
const configuracoes = require('../models/configuracoes');
const empresas = require('../models/empresa');

/*
  1 - Primeiro vai verificar a quantidade de licença disponivel no painel da empresa.
  2 - Depois vai ser feito uma consulta no banco de dados do cliente. Se exitir o vendedor com usuário e senha 
  passado no body.
 
  Dentro do model "sincronizar" existe a chamada do método vendedores.retornarVendedor() que irá fazer a consulta do vendedor.
  Caso não retorne vendedor vai ser exibida mensagem de vendedor não encontrado.

  Formato do arquivo JSON aceito passado pelo "body" e método "POST".

  {"login":{
		"codEmpresa": 4,
		"codVendedor": 1,
		"senhaVendedor":"2018"
	  }
  }
*/

exports.login = function (req, res) {

    const codVendedor = req.body.login.codVendedor;
    const codEmpresa = req.body.login.codEmpresa;
    const dadosLogin = req.body.login;

    var objFullPackage = {
        codVendedor : codVendedor,
        pacotefull: true,
        data: req.params.ultimasincronizacao,
        vinculoClientesVendedor: 'S'
    };

    vendedores.loginVendedor(dadosLogin)
    .then(
        (login) => {

            configuracoes.retornarConfiguracoesApp(objFullPackage)
            .then(
                config => {

                    objFullPackage.vinculoClientesVendedor = (config.par_vinculo_clientes_vendedor === 'S') ? true : false;

                    Promise.all([
                        departamentos.retornarDepartamentos(objFullPackage),
                        clientes.retornarClientesApp(objFullPackage),
                        tiposPagtos.retornarTipoPagtos(objFullPackage),
                        municipios.retornarMunicipiosApp(objFullPackage),
                        produtos.retornarProdutosApp(objFullPackage),
                        empresas.retornarEmpresaApp(objFullPackage),
                        tiposPedido.retonarTiposPedidoApp(objFullPackage),
                        clientes.documentosExistentes(objFullPackage)                        
                    ])
                    .then(
                        (resultados) => {

                            const tipoTokenGerar = jwt.getTipoToken();
                            const ResultToken = jwt.gerarToken(365, login.vdd_id, tipoTokenGerar.app);

                            const hostname = process.env.HOST_PAINEL;
                            const path = '/painel/atualizartoken/';

                            requestServer.post(`${hostname}${path}`, {
                                json: {
                                    "email": login.vdd_email,
                                    "token": ResultToken
                                }
                            },
                                (err, respServer, body) => {                

                                if (err){
                                    res.status(500).json({ mensagem: `Erro ao atualizar token do usuário! [ ${err} ]` });
                                }

                                if (respServer.statusCode === 200){
                                    
                                    console.log('Token atualizado com sucesso! Tudo pronto para o login ... ');

                                    res.status(200).json({
                                        vendedor: login,
                                        departamentos: resultados[0],
                                        clientes: resultados[1],
                                        tiposPagtos: resultados[2],
                                        municipios: resultados[3],
                                        produtos: resultados[4],
                                        configuracao: config,
                                        empresa: resultados[5],
                                        tiposPedido: resultados[6],
                                        doctosClientes: resultados[7],
                        
                                        token: ResultToken
                                    });

                                }else{  
                                    console.log(body);                  
                                    res.status(401).json(body);
                                }
                            }); 
                        },
                        (erro) => {
                            res.status(500).json({mensagem: `Erro ao efetuar login! [ ${erro} ]` });
                        }
                    );
                },
                errorConfig => {
                    res.status(500).json({mensagem: `Erro ao efetuar login! [ ${errorConfig} ]` });
                }
            );
        },
        (erro) => {

            switch (erro) {
                case 401.007:
                    res.status(401).json({status: erro, mensagem: "Vendedor não encontrado."});
                    break;
                default:
                    res.status(500).json({mensagem: `Erro ao efetuar login! [ ${erro} ]` });
                    break;
            }

        }
    )
};

exports.loginRetaguarda = function (request, response) {

    const codEmpresa = request.body.login.codEmpresa;
    const cnpjEmpresa = request.body.login.cnpjEmpresa;
    const senhaEmpresa = request.body.login.senhaEmpresa;

    const tipoTokenGerar = jwt.getTipoToken();
    const ResultToken = jwt.gerarToken(365, cnpjEmpresa, tipoTokenGerar.retaguarda);

    /* Faz acesso na api do painel para verificar o login */
    
    const hostname = process.env.HOST_PAINEL;
    const path = '/login';

    requestServer.post(`${hostname}${path}`, {
        json: {
            "codigo": codEmpresa,
            "login": cnpjEmpresa,
            "senha": senhaEmpresa
        }
    },
        (err, respServer, body) => {

        if (err){
            response.status(500).json({ mensagem: `Erro no login da Retaguarda!! [ ${err} ]` });
        }

        if (respServer.statusCode === 200){
            
            console.log('Login retaguarda efetuado sucesso!');

            response.status(200).json({
                url: body.url,
                token: ResultToken
            });

        }else{                    
            response.status(401).json(body);
        }
    });
};