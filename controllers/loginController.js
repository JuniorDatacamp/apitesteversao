const jwt = require('../controllers/jwtController');
const vendedores = require('../models/vendedores');
const login = require('../models/painel/usuariosLogin');
const empresasPainel = require('../models/painel/empresasPainel');
const departamentos = require('../models/departamentos');
const clientes = require('../models/clientes');
const municipios = require('../models/municipios');
const tiposPagtos = require('../models/tipoPagtos');
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

  console.log('Vendedor: '+ codVendedor);
  console.log('Empresa: '+ codEmpresa);
  console.log('login: '+ dadosLogin.senhaVendedor);

  const objFullPackage = {
    codVendedor : codVendedor,
    pacotefull: true,
    data: req.params.ultimasincronizacao
  };

  Promise.all([
    empresasPainel.verificarQtdeAcesso(codEmpresa),
    vendedores.loginVendedor(dadosLogin),
    departamentos.retornarDepartamentos(objFullPackage),
    clientes.retornarClientesApp(objFullPackage),
    tiposPagtos.retornarTipoPagtos(objFullPackage),
    municipios.retornarMunicipiosApp(objFullPackage),
    produtos.retornarProdutosApp(objFullPackage),
    configuracoes.retornarConfiguracoesApp(objFullPackage),
    empresas.retornarEmpresaApp(objFullPackage),
    clientes.documentosExistentes()
  ])
    // na função THEN recuperamos o resultado de cada uma em um array. 
    // os valores sao retornados na ordem em que foram chamados
    .then(
        (resultados) => {
        // console.log(resultados[0]);
        // console.log(resultados[0][0].vdd_id);

            const tipoTokenGerar = jwt.getTipoToken();
            const ResultToken = jwt.gerarToken(365, resultados[1].vdd_id, tipoTokenGerar.app);

            //inserir login no banco de dados painel empresa.
            Promise.all([
                login.insertLogin(req.body.login.codEmpresa, ResultToken)
            ])
            .then(
                (resultados) => {                    
                    console.log('token inserido no painel de licença com sucesso! Empresa: '+ req.body.login.codEmpresa);
                },
                (erro) => {
                    res.status(500).json({mensagem: erro});
                }
            )

            res.status(200).json({
                vendedor: resultados[1],
                departamentos: resultados[2],
                clientes: resultados[3],
                tiposPagtos: resultados[4],
                municipios: resultados[5],
                produtos: resultados[6],
                configuracao: resultados[7],
                empresa: resultados[8],
                doctosClientes: resultados[9],

                token: ResultToken
            });
        },
        (erro) => {

            switch (erro) {
                case 401.005:
                    res.status(401).json({status: 401.005, mensagem: "Empresa não encontrada no painel de licença."});
                case 401.006:
                    res.status(401).json({status: erro, mensagem: "Verifique a quantidade de licença no painel."});
                    break;
                case 401.007:
                    res.status(401).json({status: erro, mensagem: "Vendedor não encontrado."});                    
                    break;
                default:
                    res.status(500).json({mensagem: `Erro ao efetuar login! [ ${erro} ]` });
                    break;
            }            
        }
    );
};

exports.loginRetaguarda = function (req, res) {

  const codEmpresa = req.body.login.codEmpresa;
  const cnpjEmpresa = req.body.login.cnpjEmpresa;
  const senhaEmpresa = req.body.login.senhaEmpresa;
  const dadosLogin = req.body.login;

  Promise.all([
    empresasPainel.verificarQtdeAcesso(codEmpresa),
    empresasPainel.login(dadosLogin)
  ])
    // na função THEN recuperamos o resultado de cada uma em um array. 
    // os valores sao retornados na ordem em que foram chamados
    .then(
        (resultadosLogin) => {

            const tipoTokenGerar = jwt.getTipoToken();
            const ResultToken = jwt.gerarToken(365, cnpjEmpresa, tipoTokenGerar.retaguarda);

            //inserir login no banco de dados painel empresa.
            Promise.all([
                login.insertLogin(req.body.login.codEmpresa, ResultToken)
            ])
            .then(
                (resultadosInsertLogin) => {
                    
                    console.log('token inserido no painel de licença com sucesso!');

                    res.status(200).json({
                        url: resultadosLogin[1].emp_url,
                        token: ResultToken
                    });       
                },
                (erro) => {
                    res.status(500).json({mensagem: erro});
                }
            )
        },
        (erro) => {

            switch (erro) {
                case 401.005:
                    res.status(401).json({status: erro, mensagem: "Empresa não encontrada no painel de licença."});
                    break;
                case 401.006:
                    res.status(401).json({status: erro, mensagem: "Verifique a quantidade de licença no painel."});
                    break;
                default:
                    res.status(500).json({ mensagem: `Erro no login da Retaguarda!! [ ${erro} ]` });
                    break;
            }
        }
    );
};