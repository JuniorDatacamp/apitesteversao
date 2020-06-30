const format = require('pg-format');
const sincronizar = require('../models/sincronizar');
const jwt = require('../controllers/jwtController');
const vendedores = require('../models/vendedores');
const departamentos = require('../models/departamentos');
const clientes = require('../models/clientes');
const municipios = require('../models/municipios');
const tiposPagtos = require('../models/tipoPagtos');
const produtos = require('../models/produtos');
const configuracoes = require('../models/configuracoes');
const empresas = require('../models/empresa');
const vendas = require('../models/vendas');
const ocorrencias = require('../models/ocorrencias');
const ultMovRetaguarda = require('../models/ultMovRetaguarda');

exports.sincronizandoApp = function(req, res, isFull){

    const tipoToken = jwt.getTipoToken();
    const token = req.headers['x-access-token'];
    
    const packageSync = {
        codVendedor : (jwt.getToken(res, token, tipoToken.app).iss),
        pacotefull : isFull,
        data : req.params.ultimasincronizacao
    };

    console.log('Sincronizando Aplicativo: Full: ' + packageSync.pacotefull);

    Promise.all([
        vendedores.retornarVendedorApp(packageSync),
        departamentos.retornarDepartamentos(packageSync),
        clientes.retornarClientesApp(packageSync),
        tiposPagtos.retornarTipoPagtos(packageSync),
        municipios.retornarMunicipiosApp(packageSync),
        produtos.retornarProdutosApp(packageSync),
        configuracoes.retornarConfiguracoesApp(packageSync),
        empresas.retornarEmpresaApp(packageSync),
        ocorrencias.retornarOcorrencias(packageSync),
        clientes.documentosExistentes(packageSync)
    ])
    .then(
        (resultados) => {

            res.status(200).json({
                vendedor: resultados[0],
                departamentos: resultados[1],
                clientes: resultados[2],
                tiposPagtos: resultados[3],
                municipios:  resultados[4],
                produtos:  resultados[5],
                configuracao:  resultados[6],
                empresa:  resultados[7],
                ocorrencias: resultados[8].ocorrencias,
                doctosClientes: resultados[9]
            });
        },
        (erro) => {
            res.status(500).json({mensagem: `Erro no sincronizar!! [ ${erro} ]`});
        }
    );    
};

exports.sincronizandoRetaguarda = function(req, res){

    ultMovRetaguarda.getUltMovRetaguarda().then(
        (resultados) => {

            const whereClientes = format(' where cli_id is null or cli_dt_ultima_atualizacao > %L ', resultados.sco_dt_ultima_atualizacao);

            Promise.all([
                clientes.getClientesFormat(whereClientes),
                vendas.getVendas(' where ven_id is null ')
            ])
            .then(
                (resultados) => {
        
                    res.status(200).json({
                        clientes: resultados[0],
                        vendas: resultados[1]
                    });
                },
                (erro) => {
                    res.status(500).json({mensagem: `Erro no sincronizar retaguarda!! [ ${erro} ]`});
                }
            );
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
}