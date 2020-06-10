const Configuracao = require('../config/database');
const format = require('pg-format');

/*
    "recebimento" é confirmação da retaguarda quando o pedido foi importado com sucesso.    
    
    coluna "enviado" vai ficar sempre 'S' no select, pois se existe o registro no banco de dados é sinal que ele já foi enviado.
    coluna "recebimento" por ser 'S' quando ven_id = null ou ven_situacao = 'P'
*/

const itemVendaApp =
    "   select "+
    "	    itv_id, itv_uuid, ven_id, ven_uuid, pro_id, "+
    "	    itv_refer, itv_descricao, itv_qtde, itv_un, itv_desconto, "+
    "	    itv_precovenda, itv_valortotal, itv_data_inclusao, "+
    "	    ven_data, itv_promocao "+
    "   from "+
    "	    item_venda ";

const insertItemVendaApp =
    `   insert into item_venda
           (ven_uuid, pro_id, itv_refer, itv_descricao, itv_qtde, itv_un,
           itv_desconto, itv_precovenda, itv_valortotal, itv_data_inclusao,
           ven_data, itv_promocao)
       values
           %L `;

const sqlItemVenda =
     `  select 
            itv_uuid, itv_id, ven_uuid, ven_data, pro_id, itv_refer, itv_qtde, itv_desconto,
            itv_precovenda, itv_valortotal, itv_data, itv_situacao, itv_comissao,
            pro_custoreal, pro_custo, itv_num_item, itv_un, itv_tipo, itv_observacao,
            itv_descricao, itv_vlrmedio, itv_trocado, itd_id, itv_vlr_rateio_desc,
            mrc_id, itv_num_pneu, tir_id, itv_promocao, pro_composicao_if, 
            pro_composicao_st, pro_composicao_ipi, pro_composicao_frete, pro_composicao_lucro,
            pro_composicao_perc, pro_composicao_venda, pro_composicao_despfixas, 
            pro_composicao_com_vend, pro_composicao_com_entrega, pro_composicao_custo,
            itv_vlrfrete, itv_data_inclusao, itv_vlr_descarga, vdd_id
        from
            item_venda  `;

const insertItemVenda =
    `   insert into item_venda
            (itv_id, ven_uuid, ven_data, pro_id, itv_refer, itv_qtde, itv_desconto,
            itv_precovenda, itv_valortotal, itv_data, itv_situacao, itv_comissao,
            pro_custoreal, pro_custo, itv_num_item, itv_un, itv_tipo, itv_observacao,
            itv_descricao, itv_vlrmedio, itv_trocado, itd_id, itv_vlr_rateio_desc,
            mrc_id, itv_num_pneu, tir_id, itv_promocao, pro_composicao_if, 
            pro_composicao_st, pro_composicao_ipi, pro_composicao_frete, pro_composicao_lucro,
            pro_composicao_perc, pro_composicao_venda, pro_composicao_despfixas, 
            pro_composicao_com_vend, pro_composicao_com_entrega, pro_composicao_custo,
            itv_vlrfrete, itv_data_inclusao, itv_vlr_descarga, vdd_id)
        values
            %L  RETURNING itv_id, itv_uuid `;

const updateItemVenda =
    `   update item_venda set
            itv_id = $2, ven_uuid = $3, ven_data = $4, pro_id = $5, itv_refer = $6, itv_qtde = $7, itv_desconto = $8,
            itv_precovenda = $9, itv_valortotal = $10, itv_data = $11, itv_situacao = $12, itv_comissao = $13,
            pro_custoreal = $14, pro_custo = $15, itv_num_item = $16, itv_un = $17, itv_tipo = $18, itv_observacao = $19,
            itv_descricao = $20, itv_vlrmedio = $21, itv_trocado = $22, itd_id = $23, itv_vlr_rateio_desc = $24,
            mrc_id = $25, itv_num_pneu = $26, tir_id = $27, itv_promocao = $28, pro_composicao_if = $29, 
            pro_composicao_st = $30, pro_composicao_ipi = $31, pro_composicao_frete = $32, pro_composicao_lucro = $33,
            pro_composicao_perc = $34, pro_composicao_venda = $35, pro_composicao_despfixas = $36, 
            pro_composicao_com_vend = $37, pro_composicao_com_entrega = $38, pro_composicao_custo = $39,
            itv_vlrfrete = $40, itv_data_inclusao = $41, itv_vlr_descarga = $42, vdd_id = $43, itv_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            itv_uuid = $1 `;            

const deleteItemVenda =
    ` delete from item_venda where itv_uuid in (%s) `;

exports.insertApp = function insertApp(ObjItemVenda, venUUID){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco   = Configuracao.conexao;
        var paramsItemVenda  = [];

        ObjItemVenda.forEach(itemVenda => {
            
            paramsItemVenda.push([
                venUUID, itemVenda.pro_id, itemVenda.itv_refer, 
                itemVenda.itv_descricao, itemVenda.itv_qtde, itemVenda.itv_un, itemVenda.itv_desconto,
                itemVenda.itv_precovenda, itemVenda.itv_valortotal, itemVenda.itv_data_inclusao, 
                itemVenda.ven_data, itemVenda.itv_promocao
            ]);
        });

        var sql = format(insertItemVendaApp, paramsItemVenda);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir item venda. '+ error);
                
                ConexaoBanco.query('delete from venda where ven_uuid = $1', [venUUID], (error, results) => {

                });

                return reject(error);
            }
            else{
                console.log(`Item venda inserido com sucesso! ven_uuid: ${paramsItemVenda[0]} Quantidade registros:`, results.rowCount);
                var itemVenda = results.rows;
                return resolve(itemVenda);
            }
        });
    });
};

exports.getItemVenda = function getItemVenda(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlItemVenda, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const itemVenda = results.rows;
                return resolve(itemVenda);
            }
        });
    });
};

exports.insert = function insert(ObjItemVenda){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsItemVenda = [];

        ObjItemVenda.forEach(itemVenda => {
            
            paramsItemVenda.push([
                itemVenda.itv_id, itemVenda.ven_uuid, itemVenda.ven_data, itemVenda.pro_id, itemVenda.itv_refer, 
                itemVenda.itv_qtde, itemVenda.itv_desconto, itemVenda.itv_precovenda, itemVenda.itv_valortotal, 
                itemVenda.itv_data, itemVenda.itv_situacao, itemVenda.itv_comissao, itemVenda.pro_custoreal, 
                itemVenda.pro_custo, itemVenda.itv_num_item, itemVenda.itv_un, itemVenda.itv_tipo, itemVenda.itv_observacao,
                itemVenda.itv_descricao, itemVenda.itv_vlrmedio, itemVenda.itv_trocado, itemVenda.itd_id, 
                itemVenda.itv_vlr_rateio_desc, itemVenda.mrc_id, itemVenda.itv_num_pneu, itemVenda.tir_id, 
                itemVenda.itv_promocao, itemVenda.pro_composicao_if, itemVenda.pro_composicao_st, 
                itemVenda.pro_composicao_ipi, itemVenda.pro_composicao_frete, itemVenda.pro_composicao_lucro,
                itemVenda.pro_composicao_perc, itemVenda.pro_composicao_venda, itemVenda.pro_composicao_despfixas, 
                itemVenda.pro_composicao_com_vend, itemVenda.pro_composicao_com_entrega, itemVenda.pro_composicao_custo,
                itemVenda.itv_vlrfrete, itemVenda.itv_data_inclusao, itemVenda.itv_vlr_descarga, itemVenda.vdd_id
            ]);
        });

        var sql = format(insertItemVenda, paramsItemVenda);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir item venda. '+ error);
                return reject(error);
            }
            else{
                console.log('Item venda inserido com sucesso! Quantidade registros:', results.rowCount);
                var itemVenda = results.rows;
                return resolve(itemVenda);
            }
        });
    });
};

exports.delete = function(idItemVenda){

    const sqlDeleteItemVenda = format(deleteItemVenda, idItemVenda);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteItemVenda, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete item venda efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjItemVenda){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjItemVenda.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateItemVenda, [
                    element.itv_uuid, element.itv_id, element.ven_uuid, element.ven_data, element.pro_id, element.itv_refer, 
                    element.itv_qtde, element.itv_desconto, element.itv_precovenda, element.itv_valortotal, element.itv_data, 
                    element.itv_situacao, element.itv_comissao, element.pro_custoreal, element.pro_custo, element.itv_num_item, 
                    element.itv_un, element.itv_tipo, element.itv_observacao, element.itv_descricao, element.itv_vlrmedio, 
                    element.itv_trocado, element.itd_id, element.itv_vlr_rateio_desc, element.mrc_id, element.itv_num_pneu, 
                    element.tir_id, element.itv_promocao, element.pro_composicao_if, element.pro_composicao_st, 
                    element.pro_composicao_ipi, element.pro_composicao_frete, element.pro_composicao_lucro,
                    element.pro_composicao_perc, element.pro_composicao_venda, element.pro_composicao_despfixas, 
                    element.pro_composicao_com_vend, element.pro_composicao_com_entrega, element.pro_composicao_custo,
                    element.itv_vlrfrete, element.itv_data_inclusao, element.itv_vlr_descarga, element.vdd_id
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Item venda atualizado com sucesso!',
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