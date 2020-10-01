const Configuracao = require('../config/database');
const format = require('pg-format');

const SqlConfiguracao = 
    ` select
    	    par_id, par_exp_rec_pda, par_palm_bloq_restritos, par_diasdecarencia,
    	    par_palm_bloq_sem_estoque, par_palm_fabricante, par_palm_campos_obrig,
    	    par_palm_multiplo, par_palm_controle_saldo_cli, par_palm_bloq_cli_pf,
            par_palm_bloq_pedido_pf, par_integracao_pda, par_orc_outras, par_orc_dias_maximo_dt_entrega,
            par_venda_inicio, par_palm_preco, par_altera_vlr_unit_app, par_vinculo_clientes_vendedor,
            par_dt_ultima_atualizacao
       from
    	    params `;

const insertConfiguracoes = 
    ` insert into params 
        (par_id, par_exp_rec_pda, par_palm_bloq_restritos, par_diasdecarencia,
        par_palm_bloq_sem_estoque, par_palm_fabricante, par_palm_campos_obrig,
        par_palm_multiplo, par_palm_controle_saldo_cli, par_palm_bloq_cli_pf,
        par_palm_bloq_pedido_pf, par_integracao_pda, par_orc_outras, par_orc_dias_maximo_dt_entrega,
        par_venda_inicio, par_palm_preco, par_altera_vlr_unit_app, par_vinculo_clientes_vendedor)
    values
        %L `;

const updateConfiguracoes = 
    `   update params set par_exp_rec_pda = $2, par_palm_bloq_restritos = $3, 
            par_diasdecarencia = $4, par_palm_bloq_sem_estoque = $5, par_palm_fabricante = $6, 
            par_palm_campos_obrig = $7, par_palm_multiplo = $8, par_palm_controle_saldo_cli = $9, 
            par_palm_bloq_cli_pf = $10, par_palm_bloq_pedido_pf = $11, par_integracao_pda = $12, 
            par_orc_outras = $13, par_orc_dias_maximo_dt_entrega = $14, par_venda_inicio = $15,
            par_palm_preco = $16, par_altera_vlr_unit_app = $17, par_vinculo_clientes_vendedor = $18,
            par_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            par_id = $1 `;

exports.retornarConfiguracoesApp = function retornarConfiguracoesApp(package){

    //Utilizar para chamada de sync e syncFull.

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
 
        console.log('Consultando configurações...');
        ConexaoBanco.query(SqlConfiguracao, (error, resultsConfiguracao) => {
           
            if (error){
                return reject('Erro ao consultar configurações no banco de dados.');
            }else{              
                const configuracao = resultsConfiguracao.rows[0];
                return resolve(configuracao);
            }
        });
    });
};

exports.getConfiguracoesFull = function getConfiguracoesFull(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(SqlConfiguracao, (error, resultsConfiguracao) => {
        
            if (error){
                return reject(error);
            }else{              
                const configuracoes = resultsConfiguracao.rows;
                return resolve(configuracoes);
            }
        });
    });
};

exports.insert = function insert(ObjConfiguracoes){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsConfiguracao     = [];

        ObjConfiguracoes.forEach(configuracoes => {
            
            paramsConfiguracao.push([                
                configuracoes.par_id, configuracoes.par_exp_rec_pda, configuracoes.par_palm_bloq_restritos, 
                configuracoes.par_diasdecarencia, configuracoes.par_palm_bloq_sem_estoque, 
                configuracoes.par_palm_fabricante, configuracoes.par_palm_campos_obrig,
                configuracoes.par_palm_multiplo, configuracoes.par_palm_controle_saldo_cli, 
                configuracoes.par_palm_bloq_cli_pf, configuracoes.par_palm_bloq_pedido_pf,
                configuracoes.par_integracao_pda, configuracoes.par_orc_outras, configuracoes.par_orc_dias_maximo_dt_entrega,
                configuracoes.par_venda_inicio, configuracoes.par_palm_preco, configuracoes.par_altera_vlr_unit_app,
                configuracoes.par_vinculo_clientes_vendedor
            ]);
        });       

        var sql = format(insertConfiguracoes, paramsConfiguracao);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir configurações. '+ error);
                return reject(error);
            }
            else{
                console.log('Configurações inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });    
};

exports.update = function update(ObjConfiguracoes){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjConfiguracoes.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateConfiguracoes, [
                    element.par_id, element.par_exp_rec_pda, element.par_palm_bloq_restritos,
                    element.par_diasdecarencia, element.par_palm_bloq_sem_estoque, element.par_palm_fabricante,
                    element.par_palm_campos_obrig, element.par_palm_multiplo, element.par_palm_controle_saldo_cli,
                    element.par_palm_bloq_cli_pf, element.par_palm_bloq_pedido_pf, element.par_integracao_pda,
                    element.par_orc_outras, element.par_orc_dias_maximo_dt_entrega, element.par_venda_inicio,
                    element.par_palm_preco, element.par_altera_vlr_unit_app, element.par_vinculo_clientes_vendedor
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Configurações atualizado com sucesso!',
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