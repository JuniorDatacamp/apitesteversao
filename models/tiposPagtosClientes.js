const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTipoPagtosCliente =
    `   select tpc_id, tpg_id, cli_id, cli_uuid from tipos_pagtos_cliente `;

const sqlPagtosJoinCliente =
    `   select 
            tpc_id, t.tpg_id, tpg_descricao, tpg_preco, t.cli_id, t.cli_uuid 
        from 
            tipos_pagtos_cliente t
        inner join
			tipo_pagamento p on t.tpg_id = p.tpg_id
        inner join 
            clientes c on t.cli_uuid = c.cli_uuid
        where
            (cast(vdd_id as varchar(10)) ilike $1)  `;

const sqlOrderby =
    ' order by tpc_id ';

const insertTipoPagtosCliente =
    `   insert into tipos_pagtos_cliente 
            (tpc_id, tpg_id, cli_id, cli_uuid)
        values 
            %L `;

const deleteTipoPagtosCliente =
    `   WITH retorno AS
            (DELETE FROM tipos_pagtos_cliente WHERE tpc_id in (%s) RETURNING tpc_id, 'tipospagtoscliente', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `

const updateTipoPagtosCliente =
    `   update tipos_pagtos_cliente 
            set tpg_id = $2, cli_id = $3, cli_uuid = $4, tpc_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' 
        where
            tpc_id = $1 `;

exports.getTiposPagtosClienteApp = function(package){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
        var params;

        (package.vinculoClientesVendedor) ? params = package.codVendedor : params = '%';        

        console.log('Consultando tipos pagamentos cliente...');        
        ConexaoBanco.query(sqlPagtosJoinCliente+sqlOrderby, [params], function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const tiposPagtosCliente = results.rows;
                return resolve(tiposPagtosCliente);
            }
        });
    });
};

exports.getTiposPagtosClienteFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlTipoPagtosCliente+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const tiposPagtosCliente = results.rows;
                return resolve(tiposPagtosCliente);
            }
        });
    });    
};

exports.insert = function (objTiposPagtosCliente){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco            = Configuracao.conexao;
        var paramsTiposPagtosCliente  = [];

        objTiposPagtosCliente.forEach(tiposPagtosCliente => {
            
            paramsTiposPagtosCliente.push([
                tiposPagtosCliente.tpc_id, tiposPagtosCliente.tpg_id, tiposPagtosCliente.cli_id, 
                tiposPagtosCliente.cli_uuid
            ]);
        });       

        var sql = format(insertTipoPagtosCliente, paramsTiposPagtosCliente);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir tipos de pagamento do Cliente. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipos de pagamento do Cliente inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });     
};

exports.delete = function(idTiposPagtosCliente){

    const sqlDeleteTiposPagtosCliente = format(deleteTipoPagtosCliente, idTiposPagtosCliente);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTiposPagtosCliente, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete tipos de pagamento do Cliente efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function(objTiposPagtosCliente){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });
    
    var arrayPromise = [];

    objTiposPagtosCliente.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateTipoPagtosCliente, [
                    element.tpc_id, element.tpg_id, element.cli_id, element.cli_uuid
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Tipos de pagamento do Cliente atualizado com sucesso!',
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