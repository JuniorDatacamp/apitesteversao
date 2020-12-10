const objItemVenda = require('../controllers/itemVendasController').itemVenda;
const itemVendaModel = require('../models/itemVendas');
const format = require('pg-format');
/*
    "recebimento" é confirmação da retaguarda quando o pedido foi importado com sucesso.    
    
    coluna "enviado" vai ficar sempre 'S' no select, pois se existe o registro no banco de dados é sinal que ele já foi enviado.
    coluna "recebimento" por ser 'S' quando ven_id = null ou ven_situacao = 'P'
*/

const Configuracao = require('../config/database');
const sqlVendasApp = 
    `   select
            ven_uuid, ped_id, vdd_id, tpg_id, ven_data,
            ven_total, ven_tipo, ven_situacao, ven_observacao, 
            ven_tipo_venda, ven_urgente, ven_dt_entrega,
            x.tpp_id, tpp_nome,
            case
                when ven_id isnull then 'N'
            else 'S'
            end as recebimento,
            'S' as enviado,
            (select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = x.ven_uuid group by ven_uuid) as itemvendas,
            cli_uuid, cli_id
        from 
            (select
                row_number() over (partition by cli_uuid order by ped_id desc) as r,
                v.*
                from
            venda v) x
        left join
            tipos_pedido t on x.tpp_id = t.tpp_id
        where
            x.r <= 3 and (cast(vdd_id as varchar(10)) ilike $1)  `;

const sqlVendaDuplicada =
    `   select
            ven_uuid, cli_id, cli_uuid, ped_id, vdd_id, tpg_id, ven_data,
            ven_total, ven_tipo, ven_situacao, ven_observacao, 
            ven_tipo_venda, ven_urgente, ven_dt_entrega,
            v.tpp_id, tpp_nome,
            case
                when ven_id isnull then 'N'
            else 'S'
            end as recebimento,
            'S' as enviado,
            ven_cod_verificador,
            (select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = v.ven_uuid group by ven_uuid) as itemvendas           
        from 
            venda v
        left join
            tipos_pedido t on v.tpp_id = t.tpp_id    
        where
            ven_cod_verificador = $1 `;

const textQueryInsertApp =
    "   INSERT INTO venda(  "+
    "       cli_uuid, cli_id, vdd_id, tpg_id, ven_data,   "+
    "       ven_total, ven_observacao, ven_tipo, ven_tipo_venda, ven_urgente,  "+
    "       ven_dt_entrega, ven_desconto, ven_situacao, ven_cod_verificador, tpp_id "+
    "   )       "+
    "   VALUES      "+
    "   (       "+ 
    "       $1, $2, $3, $4, $5, "+
    "       $6, $7, $8, $9, $10, "+
    "       $11, $12, $13, $14, $15  "+
    "   ) RETURNING ven_uuid, ped_id; "

const sqlVendas =
    `   select
            v.*,
            (select json_agg(ValorJson) from vw_agruparitemvendaJSON where ven_uuid = v.ven_uuid group by ven_uuid) as itemvendas
        from
            venda v 
        inner join
            item_venda i on v.ven_uuid = i.ven_uuid `;

const insertVenda =
    `   insert into venda
        (
            ven_id, ven_data, cli_id, cli_uuid, vdd_id, ven_tipo, ven_vecto1, ven_vecto2, ven_vecto3,
            ven_vecto4, ven_vecto5, ven_vecto6, ven_vecto7, ven_vecto8, ven_vecto9, ven_total, ven_desconto,
            ven_situacao, ven_entrada, trp_id, ven_observacao, mes_coo, mes_data, pdv_id, baixado, sai_numnota,
            ven_outras, tpg_id, ven_pedido, ven_vecto10, ven_vecto11, ven_vecto12, ven_quantparcelas,
            ven_diaparcelas, pre_id, ven_credito, sai_id, cag_id, ped_hora, ven_dt_entrega, ven_urgente,
            etg_id, ven_dt_inclusao, ven_tipo_venda, ven_dt_finalizacao, tpp_id, ven_ender_entrega, ven_num_bloco,
            ven_motorista, ven_contato, ven_prazo_entrega, ven_custo_bancario, reg_id, ven_cf_acertado
        )   
        values
            %L RETURNING ven_id, ven_uuid
    `;
const updateVenda =
    `   update venda set
            ven_data = $2, cli_id = $3, cli_uuid = $4, vdd_id = $5, ven_tipo = $6, ven_vecto1 = $7, ven_vecto2 = $8, 
            ven_vecto3 = $9, ven_vecto4 = $10, ven_vecto5 = $11, ven_vecto6 = $12, ven_vecto7 = $13, ven_vecto8 = $14, 
            ven_vecto9 = $15, ven_total = $16, ven_desconto = $17, ven_situacao = $18, ven_entrada = $19, trp_id = $20, 
            ven_observacao = $21, mes_coo = $22, mes_data = $23, pdv_id = $24, baixado = $25, sai_numnota = $26,
            ven_outras = $27, tpg_id = $28, ven_pedido = $29, ven_vecto10 = $30, ven_vecto11 = $31, ven_vecto12 = $32, 
            ven_quantparcelas = $33, ven_diaparcelas = $34, pre_id = $35, ven_credito = $36, sai_id = $37, cag_id = $38, 
            ped_hora = $39, ven_dt_entrega = $40, ven_urgente = $41, etg_id = $42, ven_dt_inclusao = $43, ven_tipo_venda = $44, 
            ven_dt_finalizacao = $45, tpp_id = $46, ven_ender_entrega = $47, ven_num_bloco = $48, ven_motorista = $49, 
            ven_contato = $50, ven_prazo_entrega = $51, ven_custo_bancario = $52, reg_id = $53, ven_cf_acertado = $54,
            ven_id = $55, ven_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            ven_uuid = $1
    `;

const SqlDeleteVenda = 
    " delete from venda where ven_uuid in (%s) ";

const sqlOrderby =
    ' order by ped_id ';    

//utilizar para app
exports.getVendasApp = function(package){
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;
        var params;

        (package.vinculoClientesVendedor) ? params = package.codVendedor : params = '%';

        console.log('Consultando vendas...');
        ConexaoBanco.query(sqlVendasApp+sqlOrderby, [params], (error, results) => {
        
            if (error){
                console.log('Erro ao consultar vendas app...');
                return reject(error);
            }else{  
                const venda = results.rows;
                return resolve(venda);
            }
        });
    });
};

exports.getVendaDuplicadasApp = function(ven_cod_verificador){
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;

        console.log('Consultando venda duplicada...');
        ConexaoBanco.query(sqlVendaDuplicada, [ven_cod_verificador], (error, results) => {
        
            if (error){
                console.log('Erro ao consultar venda duplicada...');
                return reject('Erro ao consultar venda duplicada...'+error);
            }else{ 
                console.log('Venda duplicada retornada com sucesso...'); 
                const venda = results.rows;
                return resolve(venda);
            }
        });
    });
};

exports.insertApp = function insertApp(ObjVendas){
   
    return new Promise((resolve, reject) => {

        console.log('Gravando venda do aplicativo...', 'vendedor: ', ObjVendas.vdd_id, ObjVendas);

        const aVenda       = ObjVendas;        
        const ConexaoBanco = Configuracao.conexao;
        var resultVenda;

        //Gambiarra por causa da retaguarda, trocou o campo por uma tabela.
        aVenda.ven_tipo_venda = 'P';

        ConexaoBanco.query(textQueryInsertApp, [
            aVenda.cli_uuid, aVenda.cli_id, aVenda.vdd_id, aVenda.tpg_id, 
            aVenda.ven_data, aVenda.ven_total, aVenda.ven_observacao, aVenda.ven_tipo, aVenda.ven_tipo_venda, 
            aVenda.ven_urgente, aVenda.ven_dt_entrega, aVenda.ven_desconto, 'P', aVenda.ven_cod_verificador,
            aVenda.tpp_id
        ], (error, results) => {

            if (error){
                console.log('Erro ao gravar Venda do aplicativo.', ObjVendas, error);
                const erroVenda = [error, aVenda];
                return reject(erroVenda);
            }
            else{
                console.log('Cabeçalho gravado com sucesso!', 'ven_uuid:', results.rows[0].ven_uuid, 'ped_id:', results.rows[0].ped_id, 'ven_cod_verificador:', aVenda.ven_cod_verificador);

                resultVenda         = {ven_uuid: results.rows[0].ven_uuid, ped_id: results.rows[0].ped_id};
                var arrayItemVenda  = [];

                try {

                    ObjVendas.itemvendas.forEach(valor => {
                        arrayItemVenda.push(objItemVenda(valor));
                    });

                } catch (error) {
                    return reject('A requisição não está de acordo com o formato esperado. Verifique o JSON "itemvendas" no body que está sendo enviado.')
                }

                itemVendaModel.insertApp(arrayItemVenda, resultVenda.ven_uuid)
                .then(
                    (resultados) => {                        
                        return resolve(resultVenda);                        
                    },
                    (rejeitado) => {                        
                        resultVenda.mensagem = rejeitado;                        
                        return reject(resultVenda.mensagem);
                    }
                )
            }//else
        });//venda
    });//promise
};

exports.getVendas = function getVendas(parametro){

    const ConexaoBanco = Configuracao.conexao;
   
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlVendas+parametro, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const venda = results.rows;
                return resolve(venda);
            }
        });
    });
};

exports.insert = function insert(ObjVendas){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsVenda     = [];

        ObjVendas.forEach(venda => {
            
            paramsVenda.push([                
                venda.ven_id, venda.ven_data, venda.cli_id, venda.cli_uuid, venda.vdd_id, venda.ven_tipo, venda.ven_vecto1, 
                venda.ven_vecto2, venda.ven_vecto3, venda.ven_vecto4, venda.ven_vecto5, venda.ven_vecto6, venda.ven_vecto7, 
                venda.ven_vecto8, venda.ven_vecto9, venda.ven_total, venda.ven_desconto, venda.ven_situacao, venda.ven_entrada,
                venda.trp_id, venda.ven_observacao, venda.mes_coo, venda.mes_data, venda.pdv_id, venda.baixado, venda.sai_numnota,
                venda.ven_outras, venda.tpg_id, venda.ven_pedido, venda.ven_vecto10, venda.ven_vecto11, venda.ven_vecto12, 
                venda.ven_quantparcelas, venda.ven_diaparcelas, venda.pre_id, venda.ven_credito, venda.sai_id, venda.cag_id, 
                venda.ped_hora, venda.ven_dt_entrega, venda.ven_urgente, venda.etg_id, venda.ven_dt_inclusao, venda.ven_tipo_venda, 
                venda.ven_dt_finalizacao, venda.tpp_id, venda.ven_ender_entrega, venda.ven_num_bloco, venda.ven_motorista, 
                venda.ven_contato, venda.ven_prazo_entrega, venda.ven_custo_bancario, venda.reg_id, venda.ven_cf_acertado
            ]);
        });       

        var sql = format(insertVenda, paramsVenda);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir venda(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Venda(s) inserido com sucesso! Quantidade registros: ', results.rowCount);
                var venda = results.rows;
                return resolve(venda);
            }
        });
    });
};

exports.delete = function(idVenda){

    const sqlDeleteVenda = format(SqlDeleteVenda, idVenda);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteVenda, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete venda(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjVendas){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjVendas.forEach(venda => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateVenda, [
                    venda.ven_uuid, venda.ven_data, venda.cli_id, venda.cli_uuid, venda.vdd_id, venda.ven_tipo, 
                    venda.ven_vecto1, venda.ven_vecto2, venda.ven_vecto3, venda.ven_vecto4, venda.ven_vecto5, 
                    venda.ven_vecto6, venda.ven_vecto7, venda.ven_vecto8, venda.ven_vecto9, venda.ven_total, 
                    venda.ven_desconto, venda.ven_situacao, venda.ven_entrada, venda.trp_id, venda.ven_observacao, 
                    venda.mes_coo, venda.mes_data, venda.pdv_id, venda.baixado, venda.sai_numnota, venda.ven_outras, 
                    venda.tpg_id, venda.ven_pedido, venda.ven_vecto10, venda.ven_vecto11, venda.ven_vecto12, 
                    venda.ven_quantparcelas, venda.ven_diaparcelas, venda.pre_id, venda.ven_credito, venda.sai_id, 
                    venda.cag_id, venda.ped_hora, venda.ven_dt_entrega, venda.ven_urgente, venda.etg_id, 
                    venda.ven_dt_inclusao, venda.ven_tipo_venda, venda.ven_dt_finalizacao, venda.tpp_id, 
                    venda.ven_ender_entrega, venda.ven_num_bloco, venda.ven_motorista, venda.ven_contato, 
                    venda.ven_prazo_entrega, venda.ven_custo_bancario, venda.reg_id, venda.ven_cf_acertado, 
                    venda.ven_id
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Venda(s) atualizado com sucesso!',
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
