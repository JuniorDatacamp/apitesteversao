require('../utils/funcUtils');
const Configuracao = require('../config/database');
const regioes = require('../models/regioes');
const format = require('pg-format');

const SqlProdutoApp =
    `   select    
       p.pro_id, pro_referencia,        
       case 
   	        when dep_acesso_api = 'N' 
	        then 'I'
	    else
	 	    pro_ativo
        end as pro_ativo,       
       pro_ean1, p.dep_id, dep_descricao, p.mrc_id, mrc_descricao,   
       pro_descricao, pro_observacoes, pro_unidade, pro_embunidade, pro_estoque, pro_quant_unid, pro_fracionado,  
       case    
           when pro_preco_fixo = 'S' then pro_vlrprazo    
           else pro_vlrprazo + round(pro_vlrprazo * {0} / 100, 3)    
       end as pro_vlrprazo,   
       case    
           when pro_preco_fixo = 'S' then pro_vlratacado    
           else pro_vlratacado + round(pro_vlratacado * {0} / 100, 3)    
       end as pro_vlratacado,   
       case    
           when pro_preco_fixo = 'S' then pro_vlrvenda    
           else pro_vlrvenda + round(pro_vlrvenda * {0} / 100, 3)    
       end as pro_vlrvenda,   
       case   
           when pro_preco_fixo = 'S' then pro_vlrminimo   
           else pro_vlrminimo + round(pro_vlrminimo * {0} / 100, 3)   
       end as pro_vlrminimo,  
       case   
           when pro_preco_fixo = 'S' then pro_vlrmaximo   
           else pro_vlrmaximo + round(pro_vlrmaximo * {0} / 100, 3)   
       end as pro_vlrmaximo,  
       case when (cast(now() as date)) between prm_dt_inicial and prm_dt_final then   
           case   
               when pro_preco_fixo = 'S' then cast(coalesce(ipr_vlr_promocao, 0) as numeric(15,3))   
               else cast(coalesce(ipr_vlr_promocao, 0) as numeric(15,3)) + round(cast(coalesce(ipr_vlr_promocao, 0) as numeric(15,3)) * {0} / 100, 3)  
           end  
       end as vlr_promocao, 
           pro_dtaltpreco, pro_descmax, pro_imp_catalogo, pro_troca,  
       case  
           when (cast(now() as date) - cast(pro_datacadastro as date) <= 7) then '#006EAD'  
           when (cast(now() as date)) between prm_dt_inicial and prm_dt_final then '#0F8318'  
           when pro_estoque <= 0 then '#D00303'  
           when pro_estoque > 0 then '#000000'  
       else  
           '#000000'  
       end as corlegenda,  
       pro_datacadastro, 
       case when (cast(now() as date)) between prm_dt_inicial and prm_dt_final then prm_dt_inicial end as prm_dt_inicial,  
       case when (cast(now() as date)) between prm_dt_inicial and prm_dt_final then prm_dt_final end as prm_dt_final 
       %s  
       from  
           produto p  
       inner join  
           departamento d on p.dep_id = d.dep_id  
       left join  
           marca m on p.mrc_id = m.mrc_id  
       left join  
           item_promocao i on p.pro_id = i.pro_id  
       left join  
           promocao c on i.prm_id = c.prm_id `;

const sqlOrderby =
    ' order by pro_descricao ';    

const sqlProdutosCompleto = 
    ' select * from produto ';

const insertProduto =
    ` insert into produto
        (   pro_id, pro_ean1, pro_ean2, pro_ean3, pro_referencia, cst_id, naf_codfiscal,
            dep_id, for_id, pro_unidade, pro_quant_unid, pro_estoque, pro_estoqmin,
            pro_vlrcusto, pro_vlrprepos, pro_vlrmedio, pro_vlrprazo, pro_ultcomp,
            pro_ultvenda, pro_qtdeultcom, pro_dtaltpreco, pro_descricao, pro_margem,
            pro_comissao, pro_vlrvenda, pro_observacoes, pro_balanca, pro_codbalanca, pro_resumido, 
            pro_ita, pro_validade, pro_estoque_dep, pro_vlrcusto_dep, pro_ativo, pro_custonota, 
            pro_vlratacado, pro_margemprazo, pro_vlrcalcsubst, pro_vlraliqsubst, pro_gaveta, 
            pro_icmscompra, pro_icmsvenda, pro_pesoliquido, pro_pesobruto, pro_codigonbm, 
            pro_vlrmedioant, pro_origem, cfs_id, pro_descmax, pro_datacadastro, lab_id, 
            pro_vlrminimo, pro_piscofins, sec_id, pro_promocao_dtini, pro_promocao_dtfim, 
            pro_promocao_vlr, pro_embunidade, pro_cfopdentro, pro_cfopfora, pro_codfab1, 
            pro_codfab2, pro_codfab3, pro_codfab4, pro_codfab5, pro_codfab6, pro_codfab7, 
            pro_codfab8, pro_codfab9, pro_codfab10, pro_registro_ms, pro_vlrcustoant, 
            pro_custonotaant, pro_estoqmax, pro_validade_balanca, pro_codigo_dcb, 
            pro_dicriminacao_dcb, pro_apres_concentracao, pro_metragem, pro_metragemfim, 
            pro_tipoviga, pro_mva, pro_mva_ajustada, pro_aliqpis, pro_aliqcofins, pro_cod_origem, 
            pro_margemminimo, pro_margematacado, pro_reducao_base_calc, pro_aliq_dest_interna, 
            pro_aliq_dest_externa, pro_vlrmaximo, pro_qtde_min_atac, tpi_codigo, pro_cod_ex, 
            pro_cod_gen, stpc_codigo, pro_pis_cofins_tipo_calculo, pro_aliq_pis_valor, 
            pro_aliq_cofins_valor, pro_nfe_tipo_item, cfo_id_cupom, pro_aliq_icms, pro_aliq_csosn, 
            pro_calc_vlr_desc_icms, pro_piscofins_sai, pro_aliqpis_sai, pro_aliqcofins_sai, 
            stpc_codigo_sai, pro_pis_cofins_tipo_calculo_sai, pro_aliq_pis_valor_sai, 
            pro_aliq_cofins_valor_sai, fix, sti_codigo, pro_ipi_tipo_calculo, pro_aliq_ipi, 
            pro_ipi_vlr_unidade, nat_codigo, nat_bc_codigo, pro_ipi_vlr_base, pro_dt_atualiza_cad, 
            mrc_id, cst_id_fora, sti_codigo_sai, pro_ipi_tipo_calculo_sai, pro_aliq_ipi_sai, 
            pro_ipi_vlr_unidade_sai, pro_sngpc_classe_terapeutica, pro_sngpc_tipounid, anp_codigo, 
            pro_tipo_medicamento, pro_tipo_ref_bc_st, pro_veic_chassi, pro_veic_renavam, pro_veic_marca, 
            pro_veic_cor, pro_veic_ano_fabric, pro_veic_ano_modelo, pro_medicamento, pro_ultcomp_ant, 
            pro_qtdeultcom_ant, pro_veic_combustivel, pro_origem_ncm, pro_aliquota_ncm, pro_fracionado, 
            pro_codigo_ima, cod_id, pro_tipo_prod_ima, pro_un_balanca, pro_ppb, pro_ppb_descricao, 
            pro_valor_pmc, cco_id_pis, cco_id_cofins, pro_imp_catalogo, pro_preco_fixo, pro_especial_pda, 
            pro_composicao_if, pro_composicao_st, pro_composicao_ipi, pro_composicao_frete, pro_composicao_lucro, 
            pro_composicao_perc, pro_composicao_venda, pro_troca, pro_usa_aliq_nat_fisc, pro_composicao_despfixas, 
            pro_composicao_com_vend, pro_composicao_com_entrega, pro_aliquota_ncm_est, pro_ncm_fonte, pro_ncm_chave, 
            pro_composicao_custo, pro_laje, pro_ceramica, un_cod_alter, ces_codigo, eqi_codigo, pro_ncm_versao, 
            pro_item_inf_add, pro_vlrprazo_ant, pro_vlratacado_ant, pro_vlrvenda_ant, pro_ncm_vigencia, sub_id, 
            pro_dtaltprecoant, pro_cnpj_fabricante, pro_codigo_beneficiario, pro_producao, pro_ean_trib, 
            pro_unidade_trib, pro_quant_trib, pro_tipo_estoque, cli_id, pro_perc_fcp, pro_perc_fcp_st, 
            pro_perc_fcp_st_ant, pro_icms_substituto, pro_mt_isencao_anvisa, pro_fpopular_valor, 
            pro_fpopular_qtde_embalagem, pro_aliq_icms_desonerado, mdi_codigo
        )
    values
        %L `;  
        
const updateProdutos =
    `   update produto set pro_ean1 = $2, pro_ean2 = $3, pro_ean3 = $4, pro_referencia = $5, cst_id = $6, naf_codfiscal = $7,
            dep_id = $8, for_id = $9, pro_unidade = $10, pro_quant_unid = $11, pro_estoque = $12, pro_estoqmin = $13,
            pro_vlrcusto = $14, pro_vlrprepos = $15, pro_vlrmedio = $16, pro_vlrprazo = $17, pro_ultcomp = $18,
            pro_ultvenda = $19, pro_qtdeultcom = $20, pro_dtaltpreco = $21, pro_descricao = $22, pro_margem = $23,
            pro_comissao = $24, pro_vlrvenda = $25, pro_observacoes = $26, pro_balanca = $27, pro_codbalanca = $28, pro_resumido = $29, 
            pro_ita = $30, pro_validade = $31, pro_estoque_dep = $32, pro_vlrcusto_dep = $33, pro_ativo = $34, pro_custonota = $35, 
            pro_vlratacado = $36, pro_margemprazo = $37, pro_vlrcalcsubst = $38, pro_vlraliqsubst = $39, pro_gaveta = $40, 
            pro_icmscompra = $41, pro_icmsvenda = $42, pro_pesoliquido = $43, pro_pesobruto = $44, pro_codigonbm = $45, 
            pro_vlrmedioant = $46, pro_origem = $47, cfs_id = $48, pro_descmax = $49, pro_datacadastro = $50, lab_id = $51, 
            pro_vlrminimo = $52, pro_piscofins = $53, sec_id = $54, pro_promocao_dtini = $55, pro_promocao_dtfim = $56, 
            pro_promocao_vlr = $57, pro_embunidade = $58, pro_cfopdentro = $59, pro_cfopfora = $60, pro_codfab1 = $61, 
            pro_codfab2 = $62, pro_codfab3 = $63, pro_codfab4 = $64, pro_codfab5 = $65, pro_codfab6 = $66, pro_codfab7 = $67, 
            pro_codfab8 = $68, pro_codfab9 = $69, pro_codfab10 = $70, pro_registro_ms = $71, pro_vlrcustoant = $72, 
            pro_custonotaant = $73, pro_estoqmax = $74, pro_validade_balanca = $75, pro_codigo_dcb = $76, 
            pro_dicriminacao_dcb = $77, pro_apres_concentracao = $78, pro_metragem = $79, pro_metragemfim = $80, 
            pro_tipoviga = $81, pro_mva = $82, pro_mva_ajustada = $83, pro_aliqpis = $84, pro_aliqcofins = $85, pro_cod_origem = $86, 
            pro_margemminimo = $87, pro_margematacado = $88, pro_reducao_base_calc = $89, pro_aliq_dest_interna = $90, 
            pro_aliq_dest_externa = $91, pro_vlrmaximo = $92, pro_qtde_min_atac = $93, tpi_codigo = $94, pro_cod_ex = $95, 
            pro_cod_gen = $96, stpc_codigo = $97, pro_pis_cofins_tipo_calculo = $98, pro_aliq_pis_valor = $99, 
            pro_aliq_cofins_valor = $100, pro_nfe_tipo_item = $101, cfo_id_cupom = $102, pro_aliq_icms = $103, pro_aliq_csosn = $104, 
            pro_calc_vlr_desc_icms = $105, pro_piscofins_sai = $106, pro_aliqpis_sai = $107, pro_aliqcofins_sai = $108, 
            stpc_codigo_sai = $109, pro_pis_cofins_tipo_calculo_sai = $110, pro_aliq_pis_valor_sai = $111, 
            pro_aliq_cofins_valor_sai = $112, fix = $113, sti_codigo = $114, pro_ipi_tipo_calculo = $115, pro_aliq_ipi = $116, 
            pro_ipi_vlr_unidade = $117, nat_codigo = $118, nat_bc_codigo = $119, pro_ipi_vlr_base = $120, pro_dt_atualiza_cad = $121, 
            mrc_id = $122, cst_id_fora = $123, sti_codigo_sai = $124, pro_ipi_tipo_calculo_sai = $125, pro_aliq_ipi_sai = $126, 
            pro_ipi_vlr_unidade_sai = $127, pro_sngpc_classe_terapeutica = $128, pro_sngpc_tipounid = $129, anp_codigo = $130, 
            pro_tipo_medicamento = $131, pro_tipo_ref_bc_st = $132, pro_veic_chassi = $133, pro_veic_renavam = $134, 
            pro_veic_marca = $135, pro_veic_cor = $136, pro_veic_ano_fabric = $137, pro_veic_ano_modelo = $138, 
            pro_medicamento = $139,	pro_ultcomp_ant = $140, pro_qtdeultcom_ant = $141, pro_veic_combustivel = $142, 
            pro_origem_ncm = $143, pro_aliquota_ncm = $144, pro_fracionado = $145, pro_codigo_ima = $146, cod_id = $147, 
            pro_tipo_prod_ima = $148, pro_un_balanca = $149, pro_ppb = $150, pro_ppb_descricao = $151, pro_valor_pmc = $152, 
            cco_id_pis = $153, cco_id_cofins = $154, pro_imp_catalogo = $155, pro_preco_fixo = $156, pro_especial_pda = $157, 
            pro_composicao_if = $158, pro_composicao_st = $159, pro_composicao_ipi = $160, pro_composicao_frete = $161, 
            pro_composicao_lucro = $162, pro_composicao_perc = $163, pro_composicao_venda = $164, pro_troca = $165, 
            pro_usa_aliq_nat_fisc = $166, pro_composicao_despfixas = $167, pro_composicao_com_vend = $168, 
            pro_composicao_com_entrega = $169, pro_aliquota_ncm_est = $170, pro_ncm_fonte = $171, pro_ncm_chave = $172, 
            pro_composicao_custo = $173, pro_laje = $174, pro_ceramica = $175, un_cod_alter = $176, ces_codigo = $177, 
            eqi_codigo = $178, pro_ncm_versao = $179, pro_item_inf_add = $180, pro_vlrprazo_ant = $181, pro_vlratacado_ant = $182, 
            pro_vlrvenda_ant = $183, pro_ncm_vigencia = $184, sub_id = $185, pro_dtaltprecoant = $186, pro_cnpj_fabricante = $187, 
            pro_codigo_beneficiario = $188, pro_producao = $189, pro_ean_trib = $190, pro_unidade_trib = $191, pro_quant_trib = $192, 
            pro_tipo_estoque = $193, cli_id = $194, pro_perc_fcp = $195, pro_perc_fcp_st = $196, pro_perc_fcp_st_ant = $197, 
            pro_icms_substituto = $198, pro_mt_isencao_anvisa = $199, pro_fpopular_valor = $200, pro_fpopular_qtde_embalagem = $201, 
            pro_aliq_icms_desonerado = $202, mdi_codigo = $203, pro_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            pro_id = $1 `;

const deleteProdutos =
    `   WITH retorno AS
            (DELETE FROM produto WHERE pro_id in (%s) RETURNING pro_id, 'produtos', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `    

/* Retorna o produto como Promise. Utilizar este método se deseja receber o retorno da consulta. */
exports.retornarProdutosApp = function retornarProdutosApp(package){ 
    
    const codVendedor = package.codVendedor;

    return new Promise((resolve, reject) => {
    
        Promise.all([
            regioes.getPercentual(codVendedor)
        ])
        .then(
            (resultados) => {
                //valor do percentual da região retornado pela promise.
                const percentualRegiao = resultados[0];
                //substituindo na string o valor para ser calculado o valor do produto de acordo com a região do vendedor.
                var sqlProduto = SqlProdutoApp.replaceAll('{0}', percentualRegiao);

                const colunaProdutoNovo =
                    `   ,case
                            when (%L <= pro_dt_inclusao) then true
                            else false
                        end as pro_novo `;
                var addWhere = '';
                var params = [];

                if (package.pacotefull){
                    sqlProduto = format(sqlProduto, '');
                    addWhere = " where pro_ativo = 'A' and dep_acesso_api = 'S' ";
                }else{
                    addWhere = " where prm_dt_ultima_atualizacao > $1 or ipr_dt_ultima_atualizacao > $1 or pro_dt_ultima_atualizacao > $1 or dep_dt_ultima_atualizacao > $1 and pro_ativo <> 'B' ";
                    params.push(package.data);
                    var addColunaProduto  = format(colunaProdutoNovo, package.data, package.data);
                    sqlProduto            = format(sqlProduto, addColunaProduto);
                };

                //acessando o banco de dados e pesquisar pelo produto.
                const ConexaoBanco = Configuracao.conexao;

                console.log('Consultando produtos...');
                ConexaoBanco.query(sqlProduto+addWhere+sqlOrderby, params, (error, resultsProduto) => {
                
                    if (error){
                        return reject('Erro ao consultar produto no banco de dados.');
                    }else{                      
                        const produto = resultsProduto.rows;    
                        return resolve(produto);
                    }
                });
            },
            (rejeitado) => {
                return resolve(rejeitado);
            },
            (erro) => {
                res.status(500).json({mensagem: `Erro ao consultar valor percentual da região!! [ ${erro} ]`});
            }
        );
    });
};

exports.getProdutos = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlProdutosCompleto+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{                
                const produto = results.rows;
                return resolve(produto);
            }
        });
    });    
};

exports.getProdutosFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlProdutosCompleto+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const produto = results.rows;
                return resolve(produto);
            }
        });
    });    
};

exports.insert = function (objProduto){
    
    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsProduto   = [];

        objProduto.forEach(produto => {
            
            paramsProduto.push([
                produto.pro_id, produto.pro_ean1, produto.pro_ean2, produto.pro_ean3, produto.pro_referencia, produto.cst_id, 
                produto.naf_codfiscal, produto.dep_id, produto.for_id, produto.pro_unidade, produto.pro_quant_unid, 
                produto.pro_estoque, produto.pro_estoqmin, produto.pro_vlrcusto, produto.pro_vlrprepos, produto.pro_vlrmedio, 
                produto.pro_vlrprazo, produto.pro_ultcomp, produto.pro_ultvenda, produto.pro_qtdeultcom, produto.pro_dtaltpreco, 
                produto.pro_descricao, produto.pro_margem, produto.pro_comissao, produto.pro_vlrvenda, produto.pro_observacoes, 
                produto.pro_balanca, produto.pro_codbalanca, produto.pro_resumido, produto.pro_ita, produto.pro_validade, 
                produto.pro_estoque_dep, produto.pro_vlrcusto_dep, produto.pro_ativo, produto.pro_custonota, produto.pro_vlratacado, 
                produto.pro_margemprazo, produto.pro_vlrcalcsubst, produto.pro_vlraliqsubst, produto.pro_gaveta, produto.pro_icmscompra, 
                produto.pro_icmsvenda, produto.pro_pesoliquido, produto.pro_pesobruto, produto.pro_codigonbm, produto.pro_vlrmedioant, 
                produto.pro_origem, produto.cfs_id, produto.pro_descmax, produto.pro_datacadastro, produto.lab_id, produto.pro_vlrminimo, 
                produto.pro_piscofins, produto.sec_id, produto.pro_promocao_dtini, produto.pro_promocao_dtfim, produto.pro_promocao_vlr, 
                produto.pro_embunidade, produto.pro_cfopdentro, produto.pro_cfopfora, produto.pro_codfab1, produto.pro_codfab2, 
                produto.pro_codfab3, produto.pro_codfab4, produto.pro_codfab5, produto.pro_codfab6, produto.pro_codfab7, 
                produto.pro_codfab8, produto.pro_codfab9, produto.pro_codfab10, produto.pro_registro_ms, produto.pro_vlrcustoant, 
                produto.pro_custonotaant, produto.pro_estoqmax, produto.pro_validade_balanca, produto.pro_codigo_dcb, 
                produto.pro_dicriminacao_dcb, produto.pro_apres_concentracao, produto.pro_metragem, produto.pro_metragemfim, 
                produto.pro_tipoviga, produto.pro_mva, produto.pro_mva_ajustada, produto.pro_aliqpis, produto.pro_aliqcofins, 
                produto.pro_cod_origem, produto.pro_margemminimo, produto.pro_margematacado, produto.pro_reducao_base_calc, 
                produto.pro_aliq_dest_interna, produto.pro_aliq_dest_externa, produto.pro_vlrmaximo, produto.pro_qtde_min_atac, 
                produto.tpi_codigo, produto.pro_cod_ex, produto.pro_cod_gen, produto.stpc_codigo, produto.pro_pis_cofins_tipo_calculo, 
                produto.pro_aliq_pis_valor, produto.pro_aliq_cofins_valor, produto.pro_nfe_tipo_item, produto.cfo_id_cupom, 
                produto.pro_aliq_icms, produto.pro_aliq_csosn, produto.pro_calc_vlr_desc_icms, produto.pro_piscofins_sai, 
                produto.pro_aliqpis_sai, produto.pro_aliqcofins_sai, produto.stpc_codigo_sai, produto.pro_pis_cofins_tipo_calculo_sai, 
                produto.pro_aliq_pis_valor_sai, produto.pro_aliq_cofins_valor_sai, produto.fix, produto.sti_codigo, 
                produto.pro_ipi_tipo_calculo, produto.pro_aliq_ipi, produto.pro_ipi_vlr_unidade, produto.nat_codigo, produto.nat_bc_codigo, 
                produto.pro_ipi_vlr_base, produto.pro_dt_atualiza_cad, produto.mrc_id, produto.cst_id_fora, produto.sti_codigo_sai, 
                produto.pro_ipi_tipo_calculo_sai, produto.pro_aliq_ipi_sai, produto.pro_ipi_vlr_unidade_sai, 
                produto.pro_sngpc_classe_terapeutica, produto.pro_sngpc_tipounid, produto.anp_codigo, produto.pro_tipo_medicamento, 
                produto.pro_tipo_ref_bc_st, produto.pro_veic_chassi, produto.pro_veic_renavam, produto.pro_veic_marca, 
                produto.pro_veic_cor, produto.pro_veic_ano_fabric, produto.pro_veic_ano_modelo, produto.pro_medicamento, 
                produto.pro_ultcomp_ant, produto.pro_qtdeultcom_ant, produto.pro_veic_combustivel, produto.pro_origem_ncm, 
                produto.pro_aliquota_ncm, produto.pro_fracionado, produto.pro_codigo_ima, produto.cod_id, produto.pro_tipo_prod_ima, 
                produto.pro_un_balanca, produto.pro_ppb, produto.pro_ppb_descricao, produto.pro_valor_pmc, produto.cco_id_pis, 
                produto.cco_id_cofins, produto.pro_imp_catalogo, produto.pro_preco_fixo, produto.pro_especial_pda, produto.pro_composicao_if, 
                produto.pro_composicao_st, produto.pro_composicao_ipi, produto.pro_composicao_frete, produto.pro_composicao_lucro, 
                produto.pro_composicao_perc, produto.pro_composicao_venda, produto.pro_troca, produto.pro_usa_aliq_nat_fisc, 
                produto.pro_composicao_despfixas, produto.pro_composicao_com_vend, produto.pro_composicao_com_entrega, 
                produto.pro_aliquota_ncm_est, produto.pro_ncm_fonte, produto.pro_ncm_chave, produto.pro_composicao_custo, 
                produto.pro_laje, produto.pro_ceramica, produto.un_cod_alter, produto.ces_codigo, produto.eqi_codigo, 
                produto.pro_ncm_versao, produto.pro_item_inf_add, produto.pro_vlrprazo_ant, produto.pro_vlratacado_ant, 
                produto.pro_vlrvenda_ant, produto.pro_ncm_vigencia, produto.sub_id, produto.pro_dtaltprecoant, 
                produto.pro_cnpj_fabricante, produto.pro_codigo_beneficiario, produto.pro_producao, produto.pro_ean_trib, 
                produto.pro_unidade_trib, produto.pro_quant_trib, produto.pro_tipo_estoque, produto.cli_id, produto.pro_perc_fcp, 
                produto.pro_perc_fcp_st, produto.pro_perc_fcp_st_ant, produto.pro_icms_substituto, produto.pro_mt_isencao_anvisa, 
                produto.pro_fpopular_valor, produto.pro_fpopular_qtde_embalagem, produto.pro_aliq_icms_desonerado, produto.mdi_codigo
            ]);        
        });       

        var sql = format(insertProduto, paramsProduto);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir produto(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Produto(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var produto = results.rows;
                return resolve(produto);
            }
        });
    });    
};

exports.delete = function(idProduto){

    const sqlDeleteProduto = format(deleteProdutos, idProduto);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteProduto, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete produto(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function(objProduto){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    objProduto.forEach(produto => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateProdutos, [
                    produto.pro_id, produto.pro_ean1, produto.pro_ean2, produto.pro_ean3, produto.pro_referencia, produto.cst_id, 
                    produto.naf_codfiscal, produto.dep_id, produto.for_id, produto.pro_unidade, produto.pro_quant_unid, 
                    produto.pro_estoque, produto.pro_estoqmin, produto.pro_vlrcusto, produto.pro_vlrprepos, produto.pro_vlrmedio, 
                    produto.pro_vlrprazo, produto.pro_ultcomp, produto.pro_ultvenda, produto.pro_qtdeultcom, produto.pro_dtaltpreco, 
                    produto.pro_descricao, produto.pro_margem, produto.pro_comissao, produto.pro_vlrvenda, produto.pro_observacoes, 
                    produto.pro_balanca, produto.pro_codbalanca, produto.pro_resumido, produto.pro_ita, produto.pro_validade, 
                    produto.pro_estoque_dep, produto.pro_vlrcusto_dep, produto.pro_ativo, produto.pro_custonota, produto.pro_vlratacado, 
                    produto.pro_margemprazo, produto.pro_vlrcalcsubst, produto.pro_vlraliqsubst, produto.pro_gaveta, produto.pro_icmscompra, 
                    produto.pro_icmsvenda, produto.pro_pesoliquido, produto.pro_pesobruto, produto.pro_codigonbm, produto.pro_vlrmedioant, 
                    produto.pro_origem, produto.cfs_id, produto.pro_descmax, produto.pro_datacadastro, produto.lab_id, produto.pro_vlrminimo, 
                    produto.pro_piscofins, produto.sec_id, produto.pro_promocao_dtini, produto.pro_promocao_dtfim, produto.pro_promocao_vlr, 
                    produto.pro_embunidade, produto.pro_cfopdentro, produto.pro_cfopfora, produto.pro_codfab1, produto.pro_codfab2, 
                    produto.pro_codfab3, produto.pro_codfab4, produto.pro_codfab5, produto.pro_codfab6, produto.pro_codfab7, 
                    produto.pro_codfab8, produto.pro_codfab9, produto.pro_codfab10, produto.pro_registro_ms, produto.pro_vlrcustoant, 
                    produto.pro_custonotaant, produto.pro_estoqmax, produto.pro_validade_balanca, produto.pro_codigo_dcb, 
                    produto.pro_dicriminacao_dcb, produto.pro_apres_concentracao, produto.pro_metragem, produto.pro_metragemfim, 
                    produto.pro_tipoviga, produto.pro_mva, produto.pro_mva_ajustada, produto.pro_aliqpis, produto.pro_aliqcofins, 
                    produto.pro_cod_origem, produto.pro_margemminimo, produto.pro_margematacado, produto.pro_reducao_base_calc, 
                    produto.pro_aliq_dest_interna, produto.pro_aliq_dest_externa, produto.pro_vlrmaximo, produto.pro_qtde_min_atac, 
                    produto.tpi_codigo, produto.pro_cod_ex, produto.pro_cod_gen, produto.stpc_codigo, produto.pro_pis_cofins_tipo_calculo, 
                    produto.pro_aliq_pis_valor, produto.pro_aliq_cofins_valor, produto.pro_nfe_tipo_item, produto.cfo_id_cupom, 
                    produto.pro_aliq_icms, produto.pro_aliq_csosn, produto.pro_calc_vlr_desc_icms, produto.pro_piscofins_sai, 
                    produto.pro_aliqpis_sai, produto.pro_aliqcofins_sai, produto.stpc_codigo_sai, produto.pro_pis_cofins_tipo_calculo_sai, 
                    produto.pro_aliq_pis_valor_sai, produto.pro_aliq_cofins_valor_sai, produto.fix, produto.sti_codigo, 
                    produto.pro_ipi_tipo_calculo, produto.pro_aliq_ipi, produto.pro_ipi_vlr_unidade, produto.nat_codigo, produto.nat_bc_codigo, 
                    produto.pro_ipi_vlr_base, produto.pro_dt_atualiza_cad, produto.mrc_id, produto.cst_id_fora, produto.sti_codigo_sai, 
                    produto.pro_ipi_tipo_calculo_sai, produto.pro_aliq_ipi_sai, produto.pro_ipi_vlr_unidade_sai, 
                    produto.pro_sngpc_classe_terapeutica, produto.pro_sngpc_tipounid, produto.anp_codigo, produto.pro_tipo_medicamento, 
                    produto.pro_tipo_ref_bc_st, produto.pro_veic_chassi, produto.pro_veic_renavam, produto.pro_veic_marca, 
                    produto.pro_veic_cor, produto.pro_veic_ano_fabric, produto.pro_veic_ano_modelo, produto.pro_medicamento, 
                    produto.pro_ultcomp_ant, produto.pro_qtdeultcom_ant, produto.pro_veic_combustivel, produto.pro_origem_ncm, 
                    produto.pro_aliquota_ncm, produto.pro_fracionado, produto.pro_codigo_ima, produto.cod_id, produto.pro_tipo_prod_ima, 
                    produto.pro_un_balanca, produto.pro_ppb, produto.pro_ppb_descricao, produto.pro_valor_pmc, produto.cco_id_pis, 
                    produto.cco_id_cofins, produto.pro_imp_catalogo, produto.pro_preco_fixo, produto.pro_especial_pda, produto.pro_composicao_if, 
                    produto.pro_composicao_st, produto.pro_composicao_ipi, produto.pro_composicao_frete, produto.pro_composicao_lucro, 
                    produto.pro_composicao_perc, produto.pro_composicao_venda, produto.pro_troca, produto.pro_usa_aliq_nat_fisc, 
                    produto.pro_composicao_despfixas, produto.pro_composicao_com_vend, produto.pro_composicao_com_entrega, 
                    produto.pro_aliquota_ncm_est, produto.pro_ncm_fonte, produto.pro_ncm_chave, produto.pro_composicao_custo, 
                    produto.pro_laje, produto.pro_ceramica, produto.un_cod_alter, produto.ces_codigo, produto.eqi_codigo, 
                    produto.pro_ncm_versao, produto.pro_item_inf_add, produto.pro_vlrprazo_ant, produto.pro_vlratacado_ant, 
                    produto.pro_vlrvenda_ant, produto.pro_ncm_vigencia, produto.sub_id, produto.pro_dtaltprecoant, 
                    produto.pro_cnpj_fabricante, produto.pro_codigo_beneficiario, produto.pro_producao, produto.pro_ean_trib, 
                    produto.pro_unidade_trib, produto.pro_quant_trib, produto.pro_tipo_estoque, produto.cli_id, produto.pro_perc_fcp, 
                    produto.pro_perc_fcp_st, produto.pro_perc_fcp_st_ant, produto.pro_icms_substituto, produto.pro_mt_isencao_anvisa, 
                    produto.pro_fpopular_valor, produto.pro_fpopular_qtde_embalagem, produto.pro_aliq_icms_desonerado, produto.mdi_codigo
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Produto(s) atualizado com sucesso!',
                            registros: results.rowCount
                        });
                    }
                });
            })
        );
    });

    Promise.all(arrayPromise).then(
        ConexaoBanco.query('commit', (error, results) => {
        })
    ).catch(
        ConexaoBanco.query('rollback', (error, results) => {
        })
    );

    return arrayPromise;
};