const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTipoPagtosApp = 
    '   select '+
    '	    tpg_id, tpg_descricao, tpg_desconto, tpg_liberado_cli_novo, '+
    '	    tpg_catalogo, tpg_pagamento, tpg_preco '+
    '   from  '+
    '	    tipo_pagamento ';

const sqlOrderby =
    ' order by tpg_id';
    
const sqlTipoPagtos =
    `   select 
            tpg_id, tpg_descricao, tpg_pagamento, tpg_preco, tpg_desconto, 
            tpg_tipo, tpg_tipo_frete, tpg_liberado_cli_novo, tpg_custo_bancario, 
            tpg_parc1, tpg_parc2, tpg_parc3, tpg_parc4, tpg_parc5, tpg_parc6, 
            tpg_parc7, tpg_parc8, tpg_parc9, tpg_parc10, tpg_parc11, tpg_parc12, 
            tpg_clp, tpg_ctrl_pagto_cheque, tpe_id, tpe_ind_pag, tpe_pagamento, 
            clf_id, tip_id, tpg_tipo_nfe, tpg_catalogo, tpg_tef, tpg_integrador_farmacia
        from 
            tipo_pagamento `;

const insertTipoPagtos =
    ` insert into tipo_pagamento
        (tpg_id, tpg_descricao, tpg_pagamento, tpg_preco, tpg_desconto, 
        tpg_tipo, tpg_tipo_frete, tpg_liberado_cli_novo, tpg_custo_bancario, 
        tpg_parc1, tpg_parc2, tpg_parc3, tpg_parc4, tpg_parc5, tpg_parc6, 
        tpg_parc7, tpg_parc8, tpg_parc9, tpg_parc10, tpg_parc11, tpg_parc12, 
        tpg_clp, tpg_ctrl_pagto_cheque, tpe_id, tpe_ind_pag, tpe_pagamento, 
        clf_id, tip_id, tpg_tipo_nfe, tpg_catalogo, tpg_tef, tpg_integrador_farmacia)
    values
        %L `;

const deleteTipoPagtos =
    `   WITH retorno AS 
            (DELETE FROM tipo_pagamento WHERE tpg_id in (%s) RETURNING tpg_id, 'tiposPagtos', now())
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `    

const updateTipoPagtos = 
    `   update tipo_pagamento set
            tpg_descricao = $2, tpg_pagamento = $3, tpg_preco = $4, tpg_desconto = $5,
            tpg_tipo = $6, tpg_tipo_frete = $7, tpg_liberado_cli_novo = $8, tpg_custo_bancario = $9,
            tpg_parc1 = $10, tpg_parc2 = $11, tpg_parc3 = $12, tpg_parc4 = $13, tpg_parc5 = $14, tpg_parc6 = $15,
            tpg_parc7 = $16, tpg_parc8 = $17, tpg_parc9 = $18, tpg_parc10 = $19, tpg_parc11 = $20, tpg_parc12 = $21,
            tpg_clp = $22, tpg_ctrl_pagto_cheque = $23, tpe_id = $24, tpe_ind_pag = $25, tpe_pagamento = $26,
            clf_id = $27, tip_id = $28, tpg_tipo_nfe = $29, tpg_catalogo = $30, tpg_tef = $31, tpg_integrador_farmacia = $32,
            tpg_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where 
            tpg_id = $1 `;    

exports.retornarTipoPagtos = function retornarTipoPagtos(package){

    return new Promise((resolve, reject) => {   

        const ConexaoBanco = Configuracao.conexao;        
        var params = [];

        if (package.pacotefull){
            var addWhere = ' ';
        }else{
            var addWhere = ' where tpg_dt_ultima_atualizacao > $1 ';
            params.push(package.data);            
        }        
    
        console.log('Consultando tipos de pagamentos...');        
        ConexaoBanco.query(sqlTipoPagtosApp +addWhere +sqlOrderby, params, (error, results) => {

            if (error){
                return reject('Erro ao consultar tipo pagamento no banco de dados.');
            }else{
                const tipoPagtos = results.rows;    
                return resolve(tipoPagtos);
            }
        });
    });
};

exports.getTipoPagtos = function getTipoPagtos(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlTipoPagtos, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tipoPagto = results.rows;
                return resolve(tipoPagto);
            }
        });
    });
};

exports.insert = function insert(ObjTipoPagto){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsTipoPagto     = [];

        ObjTipoPagto.forEach(tipoPagto => {
            
            paramsTipoPagto.push([               
                tipoPagto.tpg_id, tipoPagto.tpg_descricao, tipoPagto.tpg_pagamento, tipoPagto.tpg_preco, 
                tipoPagto.tpg_desconto, tipoPagto.tpg_tipo, tipoPagto.tpg_tipo_frete, tipoPagto.tpg_liberado_cli_novo, 
                tipoPagto.tpg_custo_bancario, tipoPagto.tpg_parc1, tipoPagto.tpg_parc2, tipoPagto.tpg_parc3, 
                tipoPagto.tpg_parc4, tipoPagto.tpg_parc5, tipoPagto.tpg_parc6, tipoPagto.tpg_parc7, tipoPagto.tpg_parc8, 
                tipoPagto.tpg_parc9, tipoPagto.tpg_parc10, tipoPagto.tpg_parc11, tipoPagto.tpg_parc12, 
                tipoPagto.tpg_clp, tipoPagto.tpg_ctrl_pagto_cheque, tipoPagto.tpe_id, tipoPagto.tpe_ind_pag, 
                tipoPagto.tpe_pagamento, tipoPagto.clf_id, tipoPagto.tip_id, tipoPagto.tpg_tipo_nfe, tipoPagto.tpg_catalogo, 
                tipoPagto.tpg_tef, tipoPagto.tpg_integrador_farmacia
            ]);
        });       

        var sql = format(insertTipoPagtos, paramsTipoPagto);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir Tipo de Pagamento. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipo de Pagamento inserido com sucesso! Quantidade registros:', results.rowCount);
                var tipoPagto = results.rows;
                return resolve(tipoPagto);
            }
        });
    });     
};

exports.delete = function(idTipoPagto){

    const sqlDeleteTipoPagto = format(deleteTipoPagtos, idTipoPagto);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTipoPagto, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete Tipo de Pagamento efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function update(ObjTipoPagto){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjTipoPagto.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateTipoPagtos, [                    
                    element.tpg_id, element.tpg_descricao, element.tpg_pagamento, element.tpg_preco, element.tpg_desconto,
                    element.tpg_tipo, element.tpg_tipo_frete, element.tpg_liberado_cli_novo, element.tpg_custo_bancario,
                    element.tpg_parc1, element.tpg_parc2, element.tpg_parc3, element.tpg_parc4, element.tpg_parc5, 
                    element.tpg_parc6, element.tpg_parc7, element.tpg_parc8, element.tpg_parc9, element.tpg_parc10, 
                    element.tpg_parc11, element.tpg_parc12, element.tpg_clp, element.tpg_ctrl_pagto_cheque, 
                    element.tpe_id, element.tpe_ind_pag, element.tpe_pagamento, element.clf_id, element.tip_id, 
                    element.tpg_tipo_nfe, element.tpg_catalogo, element.tpg_tef, element.tpg_integrador_farmacia
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Tipo de Pagamento atualizado com sucesso!',
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