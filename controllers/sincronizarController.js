const format = require('pg-format');
const moment = require('moment');
const sincronizar = require('../models/sincronizar');
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
const vendas = require('../models/vendas');
const ocorrencias = require('../models/ocorrencias');
const ultMovRetaguarda = require('../models/ultMovRetaguarda');
const { string } = require('pg-format');

exports.sincronizandoApp = function(req, res, isFull){

    const tipoToken = jwt.getTipoToken();
    const token = req.headers['x-access-token'];
    
    const packageSync = {
        codVendedor : (jwt.getToken(res, token, tipoToken.app).iss),
        pacotefull : isFull,
        data : req.params.ultimasincronizacao,
        vinculoClientesVendedor: 'S'
    };

    console.log('Sincronizando Aplicativo: Full: ' + packageSync.pacotefull);

    configuracoes.retornarConfiguracoesApp(packageSync)
    .then(
        config => {

            var jsonConfiguracao;

            //Verificando se data de atualização é maior, é necessário ficar aqui a validação pois
            //pelo sql sempre iria trazer alterações de configurações na sync.
            const dtAtualizacaoApp = moment(packageSync.data, "YYYY-MM-DD[T]HH:mm:ss").utc(true).toDate();            

            if (moment(string(config.par_dt_ultima_atualizacao)).isAfter(dtAtualizacaoApp) || (packageSync.pacotefull)) {
                jsonConfiguracao = config
            };

            packageSync.vinculoClientesVendedor = (config.par_vinculo_clientes_vendedor === 'S') ? true : false;

            Promise.all([
                vendedores.retornarVendedorApp(packageSync),
                departamentos.retornarDepartamentos(packageSync),
                clientes.retornarClientesApp(packageSync),
                tiposPagtos.retornarTipoPagtos(packageSync),
                municipios.retornarMunicipiosApp(packageSync),
                produtos.retornarProdutosApp(packageSync),
                empresas.retornarEmpresaApp(packageSync),
                ocorrencias.retornarOcorrencias(packageSync),
                tiposPedido.retonarTiposPedidoApp(packageSync),
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
                        configuracao:  jsonConfiguracao,
                        empresa:  resultados[6],
                        ocorrencias: resultados[7].ocorrencias,
                        tiposPedido: resultados[8],
                        doctosClientes: resultados[9]                        
                    });
                },
                (erro) => {
                    res.status(500).json({mensagem: `Erro no sincronizar!! [ ${erro} ]`});
                }
            );        
        },
        errorConfig => {
            res.status(500).json({mensagem: `Erro no sincronizar!! [ ${errorConfig} ]` });
        }
    ) 
};

exports.sincronizandoRetaguarda = function(req, res){

    ultMovRetaguarda.getUltMovRetaguarda().then(
        (resultados) => {

            const whereClientes = format(' where cli_id is null or cli_dt_ultima_atualizacao > %L ', resultados.sco_dt_ultima_atualizacao);
            const whereVendas = ' where ven_id is null group by v.ven_uuid ';

            Promise.all([
                clientes.getClientesFormat(whereClientes),
                vendas.getVendas(whereVendas)
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