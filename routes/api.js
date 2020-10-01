const express = require("express");
const router = express.Router();
const token = require("../controllers/jwtController");

const movRetaguarda = require('../controllers/ultMovRetaguardaController');
const clientes = require('../controllers/clientesController');
const consultaEstoques = require('../controllers/consultaEstoqueController');
const departamentos = require('../controllers/departamentosController');
const itemVendas = require('../controllers/itemVendasController');
const itemPromocoes = require('../controllers/itemPromocoesController');
const marcas = require('../controllers/marcasController');
const municipios = require('../controllers/municipiosController');
const paises = require('../controllers/paisesController');
const filiais = require('../controllers/filiaisController');
const estoqueFiliais = require('../controllers/estoqueFiliaisController');
const produtos = require('../controllers/produtosController');
const promocoes = require('../controllers/promocoesController');
const recebers = require('../controllers/recebersController');
const restricoes = require('../controllers/restricoesController');
const regioes = require('../controllers/regioesController');
const tipoDoctos = require('../controllers/tipoDoctosController');
const tipoPagtos = require('../controllers/tipoPagtosController');
const tiposPagtosClientes = require('../controllers/tiposPagtosClientesController');
const vendas = require('../controllers/vendasController');
const vendedores = require('../controllers/vendedoresController');
const sincronizar = require('../controllers/sincronizarController');
const configuracoes = require('../controllers/configuracoesController');
const empresas = require('../controllers/empresaController');
const especialidades = require('../controllers/especialidadesController');
const email = require('../email/enviarEmail');

/******EMAIL******/
//enviar email de teste: verificar configuração do cadastro de empresa.
router.route('/email/:email')
		.post(token.validarTokenRetaguarda, email.enviarTeste);

/******SINCRONIZAÇÃO******/

//App sincronizar dados atualizados após a data de ultima atualização
router.route('/sync/:ultimasincronizacao')
		.get(token.validarTokenApp, function(req, res){			
				sincronizar.sincronizandoApp(req, res, false)
			}
		);

//App sincronizar todos dados
router.route('/syncfull')
		.get(token.validarTokenApp, function(req, res){			
				sincronizar.sincronizandoApp(req, res, true)
			}
		);

//sincronizar dados para retaguarda
router.route('/syncretaguarda')
		.get(token.validarTokenRetaguarda, sincronizar.sincronizandoRetaguarda);

router.route('/ultdatahorasync')
		.put(token.validarTokenRetaguarda, movRetaguarda.alterarDatahora)

//Atualiza ultimo sincronismo da retaguarda
router.route('/ultmovretaguarda')
		.post(token.validarTokenRetaguarda, movRetaguarda.inserir)
		.get(token.validarTokenRetaguarda, movRetaguarda.pesquisar)		
		.put(token.validarTokenRetaguarda, movRetaguarda.alterar)

/******Clientes******/
//Acesso ao dados de clientes com dados reduzidos.
router.route('/clientes/app')
		.post(token.validarTokenApp, clientes.inserirApp)
		.get(token.validarTokenApp, clientes.pesquisarTodosApp)
		.put(token.validarTokenApp, clientes.alterarApp);

//Desenvolver rota para acesso total da tabela clientes.
router.route('/clientes')
		.post(token.validarTokenRetaguarda, clientes.inserirCompleto)
		.get(token.validarTokenRetaguarda, clientes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, clientes.alterarCompleto)
		.delete(token.validarTokenRetaguarda, clientes.delete)

// //Pesquisar Clientes com parâmetro
router.route('/clientes/:pesquisa')
		.get(token.validarTokenRetaguarda, clientes.pesquisarTodos);

//Fim Clientes

//Consultar Estoques Produtos com Filiais
router.route('/consultaEstoques/')
		.get(token.validarTokenRetaguarda, consultaEstoques.pesquisar);

router.route('/consultaEstoques/:pesquisa')
		.get(token.validarTokenRetaguarda, consultaEstoques.pesquisar);

//Fim Consultar Estoques Produtos com Filiais

/******Departamentos******/
router.route('/departamentos/')
		.post(token.validarTokenRetaguarda, departamentos.inserir)
		.get(token.validarTokenRetaguarda, departamentos.pesquisarTodos)
		.put(token.validarTokenRetaguarda, departamentos.alterar)
		.delete(token.validarTokenRetaguarda, departamentos.deletar)

router.route('/departamentos/:pesquisa')
		.get(token.validarTokenRetaguarda, departamentos.pesquisarTodos)

//Fim departamentos

/******Item Vendas******/

router.route('/itemvendas')
		.post(token.validarTokenRetaguarda, itemVendas.inserir)
		.get(token.validarTokenRetaguarda, itemVendas.pesquisarTodos)
		.put(token.validarTokenRetaguarda, itemVendas.alterar)
		.delete(token.validarTokenRetaguarda, itemVendas.deletar)

//Fim Item Vendas

/******Item Promoção******/
router.route('/itempromocoes')
		.post(token.validarTokenRetaguarda, itemPromocoes.inserir)
		.get(token.validarTokenRetaguarda, itemPromocoes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, itemPromocoes.alterar)
		.delete(token.validarTokenRetaguarda, itemPromocoes.deletar)

router.route('/itempromocoes/:pesquisa')
		.get(token.validarTokenRetaguarda, itemPromocoes.pesquisarTodos)		

//Fim Item Promoção

/******Marcas******/
router.route('/marcas')
		.post(token.validarTokenRetaguarda, marcas.inserir)
		.get(token.validarTokenRetaguarda, marcas.pesquisarTodos)
		.put(token.validarTokenRetaguarda, marcas.alterar)
		.delete(token.validarTokenRetaguarda, marcas.deletar);		

//Fim Marcas

/******Municipios******/
router.route('/municipios')
		.post(token.validarTokenRetaguarda, municipios.inserir)
		.get(token.validarTokenRetaguarda, municipios.pesquisarTodos)
		.put(token.validarTokenRetaguarda, municipios.alterar)
		.delete(token.validarTokenRetaguarda, municipios.deletar);

router.route('/municipios/:pesquisa')
		.get(token.validarTokenRetaguarda, municipios.pesquisarTodos)
//Fim Municipios


/******Paises******/
router.route('/paises/')
		.post(token.validarTokenRetaguarda, paises.inserir)
		.get(token.validarTokenRetaguarda, paises.pesquisarTodos)
		.put(token.validarTokenRetaguarda, paises.alterar)
		.delete(token.validarTokenRetaguarda, paises.deletar)
//Fim Paises	


/******Filiais******/
router.route('/filiais/')
		.post(token.validarTokenRetaguarda, filiais.inserir)
		.get(token.validarTokenRetaguarda, filiais.pesquisarTodos)
		.put(token.validarTokenRetaguarda, filiais.alterar)
		.delete(token.validarTokenRetaguarda, filiais.deletar)
//Fim Filiais

/******estoqueFiliais******/
router.route('/estoqueFiliais/')
		.post(token.validarTokenRetaguarda, estoqueFiliais.inserir)
		.get(token.validarTokenRetaguarda, estoqueFiliais.pesquisarTodos)
		.put(token.validarTokenRetaguarda, estoqueFiliais.alterar)
router.route('/estoqueFiliais/:filID')		
		.delete(token.validarTokenRetaguarda, estoqueFiliais.deletar)
//Fim estoqueFiliais

/******Produtos******/
router.route('/produtos/app')
		.get(token.validarTokenApp, produtos.pesquisarTodosApp)

router.route('/produtos/')
		.post(token.validarTokenRetaguarda, produtos.inserir)
		.get(token.validarTokenRetaguarda, produtos.pesquisarTodos)
		.put(token.validarTokenRetaguarda, produtos.alterar)
		.delete(token.validarTokenRetaguarda, produtos.deletar)

router.route('/produtos/:pesquisa')
		.get(token.validarTokenRetaguarda, produtos.pesquisarTodos)

//Fim Produtos

/******Promoções******/
router.route('/promocoes')
		.post(token.validarTokenRetaguarda, promocoes.inserir)
		.get(token.validarTokenRetaguarda, promocoes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, promocoes.alterar)
		.delete(token.validarTokenRetaguarda, promocoes.deletar)		

router.route('/promocoes/:pesquisa')
		.get(token.validarTokenRetaguarda, promocoes.pesquisarTodos)

//Fim Promoções

/******Recebers******/
router.route('/recebers')
		.post(token.validarTokenRetaguarda, recebers.inserir)
		.get(token.validarTokenRetaguarda, recebers.pesquisarTodos)
		.put(token.validarTokenRetaguarda, recebers.alterar)
		.delete(token.validarTokenRetaguarda, recebers.deletar)

router.route('/recebers/:pesquisa')
		.get(token.validarTokenRetaguarda, recebers.pesquisarTodos)

//Fim Recebers

/******Restrições******/
router.route('/restricoes')
		.post(token.validarTokenRetaguarda, restricoes.inserir)
		.get(token.validarTokenRetaguarda, restricoes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, restricoes.alterar)		
		.delete(token.validarTokenRetaguarda, restricoes.deletar)

//Fim Restrições

/******Regiões******/
router.route('/regioes')
		.post(token.validarTokenRetaguarda, regioes.inserir)
		.get(token.validarTokenRetaguarda, regioes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, regioes.alterar)
		.delete(token.validarTokenRetaguarda, regioes.deletar)	

//Fim Regiões

/******Tipo Documentos******/
router.route('/tiposDoctos')
		.post(token.validarTokenRetaguarda, tipoDoctos.inserir)
		.get(token.validarTokenRetaguarda, tipoDoctos.pesquisarTodos)
		.put(token.validarTokenRetaguarda, tipoDoctos.alterar)
		.delete(token.validarTokenRetaguarda, tipoDoctos.deletar)

//Fim Tipo Documentos

/******Tipo pagamento******/
router.route('/tiposPagtos')
		.post(token.validarTokenRetaguarda, tipoPagtos.inserir)
		.get(token.validarTokenRetaguarda, tipoPagtos.pesquisarTodos)
		.put(token.validarTokenRetaguarda, tipoPagtos.alterar)
		.delete(token.validarTokenRetaguarda, tipoPagtos.deletar)

//Fim Tipo pagamento

/******Tipo pagamento Clientes******/
router.route('/tipospagtoscliente')
		.post(token.validarTokenRetaguarda, tiposPagtosClientes.inserir)
		.get(token.validarTokenRetaguarda, tiposPagtosClientes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, tiposPagtosClientes.alterar)
		.delete(token.validarTokenRetaguarda, tiposPagtosClientes.deletar)

router.route('/tipospagtoscliente/:pesquisa')
		.get(token.validarTokenRetaguarda, tiposPagtosClientes.pesquisarTodos)

//Fim Tipo pagamento Clientes

/******Vendas******/
router.route('/vendas/app')
		.post(token.validarTokenApp, vendas.inserirApp)
		.get(token.validarTokenApp, vendas.pesquisarbyVendedor)

router.route('/vendas')
		.post(token.validarTokenRetaguarda, vendas.inserir)
		.get(token.validarTokenRetaguarda, vendas.pesquisarTodos)
		.put(token.validarTokenRetaguarda, vendas.alterar)
		.delete(token.validarTokenRetaguarda, vendas.deletar);

router.route('/vendas/:pesquisa')
		.get(token.validarTokenRetaguarda, vendas.pesquisarTodos)		

//Fim Vendas

/******Vendedores******/
router.route('/vendedores')
		.post(token.validarTokenRetaguarda, vendedores.inserir)
		.get(token.validarTokenRetaguarda, vendedores.pesquisarTodos)
		.put(token.validarTokenRetaguarda, vendedores.alterar)
		.delete(token.validarTokenRetaguarda, vendedores.deletar);

router.route('/vendedores/:pesquisa')
		.get(token.validarTokenRetaguarda, vendedores.pesquisarTodos)

// Fim Vendedores

/******Configurações******/
router.route('/configuracoes')
		.post(token.validarTokenRetaguarda, configuracoes.inserir)
		.get(token.validarTokenRetaguarda, configuracoes.pesquisarTodos)
		.put(token.validarTokenRetaguarda, configuracoes.alterar)

// Fim Configurações

/******Empresa******/
router.route('/empresas')
		.post(token.validarTokenRetaguarda, empresas.inserir)
		.get(token.validarTokenRetaguarda, empresas.pesquisarTodos)
		.put(token.validarTokenRetaguarda, empresas.alterar)

/******Especialidades******/
router.route('/especialidades')
		.post(token.validarTokenRetaguarda, especialidades.inserir)
		.get(token.validarTokenRetaguarda, especialidades.pesquisarTodos)
		.put(token.validarTokenRetaguarda, especialidades.alterar)
		.delete(token.validarTokenRetaguarda, especialidades.deletar)

// retornando router
module.exports = router;