const produtosModel = require('../models/produtos');
const funcUtils = require('../utils/funcUtils');
const jwt = require('../controllers/jwtController');

class produto {
        
    constructor(body) {

        this.pro_id              = body.pro_id,
        this.pro_ean1            = body.pro_ean1,
        this.pro_ean2            = body.pro_ean2,
        this.pro_ean3            = body.pro_ean3,
        this.pro_referencia      = body.pro_referencia,
        this.cst_id              = body.cst_id,
        this.naf_codfiscal       = body.naf_codfiscal,
        this.dep_id              = body.dep_id,
        this.for_id              = body.for_id,
        this.pro_unidade         = body.pro_unidade,
        this.pro_quant_unid      = body.pro_quant_unid,
        this.pro_estoque         = body.pro_estoque,
        this.pro_estoqmin        = body.pro_estoqmin,
        this.pro_vlrcusto        = body.pro_vlrcusto,
        this.pro_vlrprepos       = body.pro_vlrprepos,
        this.pro_vlrmedio        = body.pro_vlrmedio,
        this.pro_vlrprazo        = body.pro_vlrprazo,
        this.pro_ultcomp         = body.pro_ultcomp,
        this.pro_ultvenda        = body.pro_ultvenda,
        this.pro_qtdeultcom      = body.pro_qtdeultcom,
        this.pro_dtaltpreco      = body.pro_dtaltpreco,
        this.pro_descricao       = body.pro_descricao,
        this.pro_margem          = body.pro_margem,
        this.pro_comissao        = body.pro_comissao,
        this.pro_vlrvenda        = body.pro_vlrvenda,
        this.pro_observacoes     = body.pro_observacoes,
        this.pro_balanca         = body.pro_balanca,
        this.pro_codbalanca      = body.pro_codbalanca,
        this.pro_resumido        = body.pro_resumido,
        this.pro_ita             = body.pro_ita,
        this.pro_validade        = body.pro_validade,
        this.pro_estoque_dep     = body.pro_estoque_dep,
        this.pro_vlrcusto_dep    = body.pro_vlrcusto_dep,
        this.pro_ativo           = body.pro_ativo,
        this.pro_custonota       = body.pro_custonota,
        this.pro_vlratacado      = body.pro_vlratacado,
        this.pro_margemprazo     = body.pro_margemprazo,
        this.pro_vlrcalcsubst    = body.pro_vlrcalcsubst,
        this.pro_vlraliqsubst    = body.pro_vlraliqsubst,
        this.pro_gaveta          = body.pro_gaveta,
        this.pro_icmscompra      = body.pro_icmscompra,
        this.pro_icmsvenda       = body.pro_icmsvenda,
        this.pro_pesoliquido     = body.pro_pesoliquido,
        this.pro_pesobruto       = body.pro_pesobruto,
        this.pro_codigonbm       = body.pro_codigonbm,
        this.pro_vlrmedioant     = body.pro_vlrmedioant,
        this.pro_origem          = body.pro_origem,
        this.cfs_id              = body.cfs_id,
        this.pro_descmax         = body.pro_descmax,
        this.pro_datacadastro    = body.pro_datacadastro,
        this.lab_id              = body.lab_id,
        this.pro_vlrminimo       = body.pro_vlrminimo,
        this.pro_piscofins       = body.pro_piscofins,
        this.sec_id              = body.sec_id,
        this.pro_promocao_dtini  = body.pro_promocao_dtini,
        this.pro_promocao_dtfim  = body.pro_promocao_dtfim,
        this.pro_promocao_vlr    = body.pro_promocao_vlr,
        this.pro_embunidade      = body.pro_embunidade,
        this.pro_cfopdentro      = body.pro_cfopdentro,
        this.pro_cfopfora        = body.pro_cfopfora,
        this.pro_codfab1         = body.pro_codfab1,
        this.pro_codfab2         = body.pro_codfab2,
        this.pro_codfab3         = body.pro_codfab3,
        this.pro_codfab4         = body.pro_codfab4,
        this.pro_codfab5         = body.pro_codfab5,
        this.pro_codfab6         = body.pro_codfab6,
        this.pro_codfab7         = body.pro_codfab7,
        this.pro_codfab8         = body.pro_codfab8,
        this.pro_codfab9         = body.pro_codfab9,
        this.pro_codfab10        = body.pro_codfab10,
        this.pro_registro_ms     = body.pro_registro_ms,
        this.pro_vlrcustoant     = body.pro_vlrcustoant,
        this.pro_custonotaant    = body.pro_custonotaant,
        this.pro_estoqmax        = body.pro_estoqmax,
        this.pro_validade_balanca    = body.pro_validade_balanca,
        this.pro_codigo_dcb          = body.pro_codigo_dcb,
        this.pro_dicriminacao_dcb    = body.pro_dicriminacao_dcb,
        this.pro_apres_concentracao  = body.pro_apres_concentracao,
        this.pro_metragem            = body.pro_metragem,
        this.pro_metragemfim         = body.pro_metragemfim,
        this.pro_tipoviga            = body.pro_tipoviga,
        this.pro_mva                 = body.pro_mva,
        this.pro_mva_ajustada        = body.pro_mva_ajustada,
        this.pro_aliqpis             = body.pro_aliqpis,
        this.pro_aliqcofins          = body.pro_aliqcofins,
        this.pro_cod_origem          = body.pro_cod_origem,
        this.pro_margemminimo        = body.pro_margemminimo,
        this.pro_margematacado       = body.pro_margematacado,
        this.pro_reducao_base_calc   = body.pro_reducao_base_calc,
        this.pro_aliq_dest_interna   = body.pro_aliq_dest_interna,
        this.pro_aliq_dest_externa   = body.pro_aliq_dest_externa,
        this.pro_vlrmaximo           = body.pro_vlrmaximo,
        this.pro_qtde_min_atac       = body.pro_qtde_min_atac,
        this.tpi_codigo              = body.tpi_codigo,
        this.pro_cod_ex              = body.pro_cod_ex,
        this.pro_cod_gen             = body.pro_cod_gen,
        this.stpc_codigo             = body.stpc_codigo,
        this.pro_pis_cofins_tipo_calculo     = body.pro_pis_cofins_tipo_calculo,
        this.pro_aliq_pis_valor              = body.pro_aliq_pis_valor,
        this.pro_aliq_cofins_valor   = body.pro_aliq_cofins_valor,
        this.pro_nfe_tipo_item       = body.pro_nfe_tipo_item,
        this.cfo_id_cupom            = body.cfo_id_cupom,
        this.pro_aliq_icms           = body.pro_aliq_icms,
        this.pro_aliq_csosn          = body.pro_aliq_csosn,
        this.pro_calc_vlr_desc_icms  = body.pro_calc_vlr_desc_icms,
        this.pro_piscofins_sai       = body.pro_piscofins_sai,
        this.pro_aliqpis_sai         = body.pro_aliqpis_sai,
        this.pro_aliqcofins_sai      = body.pro_aliqcofins_sai,
        this.stpc_codigo_sai         = body.stpc_codigo_sai,
        this.pro_pis_cofins_tipo_calculo_sai     = body.pro_pis_cofins_tipo_calculo_sai,
        this.pro_aliq_pis_valor_sai              = body.pro_aliq_pis_valor_sai,
        this.pro_aliq_cofins_valor_sai           = body.pro_aliq_cofins_valor_sai,
        this.fix                     = body.fix,
        this.sti_codigo              = body.sti_codigo,
        this.pro_ipi_tipo_calculo    = body.pro_ipi_tipo_calculo,
        this.pro_aliq_ipi            = body.pro_aliq_ipi,
        this.pro_ipi_vlr_unidade     = body.pro_ipi_vlr_unidade,
        this.nat_codigo              = body.nat_codigo,
        this.nat_bc_codigo           = body.nat_bc_codigo,
        this.pro_ipi_vlr_base        = body.pro_ipi_vlr_base,
        this.pro_dt_atualiza_cad     = body.pro_dt_atualiza_cad,
        this.mrc_id                  = body.mrc_id,
        this.cst_id_fora             = body.cst_id_fora,
        this.sti_codigo_sai          = body.sti_codigo_sai,
        this.pro_ipi_tipo_calculo_sai        = body.pro_ipi_tipo_calculo_sai,
        this.pro_aliq_ipi_sai                = body.pro_aliq_ipi_sai,
        this.pro_ipi_vlr_unidade_sai         = body.pro_ipi_vlr_unidade_sai,
        this.pro_sngpc_classe_terapeutica    = body.pro_sngpc_classe_terapeutica,
        this.pro_sngpc_tipounid              = body.pro_sngpc_tipounid,
        this.anp_codigo                      = body.anp_codigo,
        this.pro_tipo_medicamento    = body.pro_tipo_medicamento,
        this.pro_tipo_ref_bc_st      = body.pro_tipo_ref_bc_st,
        this.pro_veic_chassi         = body.pro_veic_chassi,
        this.pro_veic_renavam        = body.pro_veic_renavam,
        this.pro_veic_marca          = body.pro_veic_marca,
        this.pro_veic_cor            = body.pro_veic_cor,
        this.pro_veic_ano_fabric     = body.pro_veic_ano_fabric,
        this.pro_veic_ano_modelo     = body.pro_veic_ano_modelo,
        this.pro_medicamento         = body.pro_medicamento,
        this.pro_ultcomp_ant         = body.pro_ultcomp_ant,
        this.pro_qtdeultcom_ant      = body.pro_qtdeultcom_ant,
        this.pro_veic_combustivel    = body.pro_veic_combustivel,
        this.pro_origem_ncm          = body.pro_origem_ncm,
        this.pro_aliquota_ncm        = body.pro_aliquota_ncm,
        this.pro_fracionado          = body.pro_fracionado,
        this.pro_codigo_ima          = body.pro_codigo_ima,
        this.cod_id              = body.cod_id,
        this.pro_tipo_prod_ima   = body.pro_tipo_prod_ima,
        this.pro_un_balanca      = body.pro_un_balanca,
        this.pro_ppb             = body.pro_ppb,
        this.pro_ppb_descricao   = body.pro_ppb_descricao,
        this.pro_valor_pmc       = body.pro_valor_pmc,
        this.cco_id_pis          = body.cco_id_pis,
        this.cco_id_cofins       = body.cco_id_cofins,
        this.pro_imp_catalogo    = body.pro_imp_catalogo,
        this.pro_preco_fixo      = body.pro_preco_fixo,
        this.pro_especial_pda    = body.pro_especial_pda,
        this.pro_composicao_if   = body.pro_composicao_if,
        this.pro_composicao_st   = body.pro_composicao_st,
        this.pro_composicao_ipi      = body.pro_composicao_ipi, 
        this.pro_composicao_frete    = body.pro_composicao_frete,
        this.pro_composicao_lucro    = body.pro_composicao_lucro,
        this.pro_composicao_perc     = body.pro_composicao_perc,
        this.pro_composicao_venda    = body.pro_composicao_venda,
        this.pro_troca               = body.pro_troca,
        this.pro_usa_aliq_nat_fisc   = body.pro_usa_aliq_nat_fisc,
        this.pro_composicao_despfixas    = body.pro_composicao_despfixas,
        this.pro_composicao_com_vend     = body.pro_composicao_com_vend,
        this.pro_composicao_com_entrega  = body.pro_composicao_com_entrega,
        this.pro_aliquota_ncm_est        = body.pro_aliquota_ncm_est,
        this.pro_ncm_fonte               = body.pro_ncm_fonte, 
        this.pro_ncm_chave               = body.pro_ncm_chave, 
        this.pro_composicao_custo        = body.pro_composicao_custo,
        this.pro_laje                    = body.pro_laje, 
        this.pro_ceramica                = body.pro_ceramica, 
        this.un_cod_alter                = body.un_cod_alter, 
        this.ces_codigo                  = body.ces_codigo, 
        this.eqi_codigo                  = body.eqi_codigo, 
        this.pro_ncm_versao              = body.pro_ncm_versao, 
        this.pro_item_inf_add            = body.pro_item_inf_add, 
        this.pro_vlrprazo_ant            = body.pro_vlrprazo_ant, 
        this.pro_vlratacado_ant          = body.pro_vlratacado_ant, 
        this.pro_vlrvenda_ant            = body.pro_vlrvenda_ant, 
        this.pro_ncm_vigencia            = body.pro_ncm_vigencia, 
        this.sub_id                      = body.sub_id, 
        this.pro_dtaltprecoant           = body.pro_dtaltprecoant, 
        this.pro_cnpj_fabricante         = body.pro_cnpj_fabricante, 
        this.pro_codigo_beneficiario     = body.pro_codigo_beneficiario, 
        this.pro_producao                = body.pro_producao, 
        this.pro_ean_trib                = body.pro_ean_trib, 
        this.pro_unidade_trib            = body.pro_unidade_trib, 
        this.pro_quant_trib              = body.pro_quant_trib, 
        this.pro_tipo_estoque            = body.pro_tipo_estoque, 
        this.cli_id                      = body.cli_id, 
        this.pro_perc_fcp                = body.pro_perc_fcp, 
        this.pro_perc_fcp_st             = body.pro_perc_fcp_st, 
        this.pro_perc_fcp_st_ant         = body.pro_perc_fcp_st_ant, 
        this.pro_icms_substituto         = body.pro_icms_substituto, 
        this.pro_mt_isencao_anvisa       = body.pro_mt_isencao_anvisa, 
        this.pro_fpopular_valor          = body.pro_fpopular_valor, 
        this.pro_fpopular_qtde_embalagem = body.pro_fpopular_qtde_embalagem, 
        this.pro_aliq_icms_desonerado    = body.pro_aliq_icms_desonerado, 
        this.mdi_codigo                  = body.mdi_codigo        
    }
}

exports.pesquisarTodosApp = function(req, res){

    const tipoToken = jwt.getTipoToken();
    const token = req.headers['x-access-token'];
    
    const objFullPackage = {
        codVendedor : (jwt.getToken(res, token, tipoToken.app).iss),
        pacotefull : true,
        data : req.params.ultimasincronizacao
    };

    Promise.all([
        produtosModel.retornarProdutosApp(objFullPackage)
    ])
    .then(
        (resultados) => {
            res.status(200).json({produtos:  resultados[0]});
        },
        (erro) => {
            res.status(500).json({mensagem: `Erro ao consultar produtos!! [ ${erro} ]`});
        }
        );
};

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);

    Promise.all([      
        produtosModel.getProdutosFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                produtos: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserir = function(req, res){

    var arrayProduto = [];
    
    try {
        req.body.produtos.forEach(valor => {
            arrayProduto.push(new produto(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        produtosModel.insert(arrayProduto)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Produto(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.pro_id;

    Promise.all([
        produtosModel.delete(paramsId)
    ])
    .then(
        (resultados) => {
           
            console.log(resultados[0]);
            
            res.status(200).json(
                resultados[0]
            );
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.alterar = function(req, res){

    var arrayProduto = [];
    
    try {
        req.body.produtos.forEach(valor => {
            arrayProduto.push(new produto(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesProduto;
    promisesProduto = produtosModel.update(arrayProduto);

    Promise.all(  
        promisesProduto
    )
    .then(
        (resultados) => {

            console.log('Produto(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Produto(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );   
};