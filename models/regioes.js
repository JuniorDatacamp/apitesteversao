const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlPercRegioes =
    `   select
    	    reg_percentual
       from
    	    regioes r
       inner join
    	    vendedor v on r.reg_id = v.reg_id
       where
            vdd_id = $1 `;

const sqlRegioes =
    ` select reg_id, reg_nome, reg_percentual from regioes `;

const insertRegioes =
    ` insert into regioes
        (reg_id, reg_nome, reg_percentual)
    values
        %L `;

const deleteRegioes =
    ` delete from regioes where reg_id in (%s) `;

const updateRegioes =
    `   update regioes set reg_nome = $2, reg_percentual = $3, reg_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' where reg_id = $1 `;

exports.getPercentual = function getPercentual(codigoVendedor){

    /*Retorna o percentual da região para calculo do preço dos produtos.*/
    
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
  
        console.log('Consultando regiões...');
        ConexaoBanco.query(sqlPercRegioes, [codigoVendedor], (error, resultsRegiao) => {
            
            if(error) 
                return reject(error);
            else{
                if (resultsRegiao.rowCount >0 ){
                    const regiao = resultsRegiao.rows[0].reg_percentual;
                    return resolve(regiao);
                }else{
                    return resolve(0);
                }                
            };
        });
    });
};

exports.getRegioes = function getRegioes(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlRegioes, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const regiao = results.rows;
                return resolve(regiao);
            }
        });
    });
};

exports.insert = function insert(ObjRegioes){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsRegioes   = [];

        ObjRegioes.forEach(regiao => {
            
            paramsRegioes.push([
                regiao.reg_id, regiao.reg_nome, regiao.reg_percentual
            ]);
        });       

        var sql = format(insertRegioes, paramsRegioes);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir regiões. '+ error);
                return reject(error);
            }
            else{
                console.log('Regiões inserido com sucesso! Quantidade registros:', results.rowCount);
                var regioes = results.rows;
                return resolve(regioes);
            }
        });
    });    
};

exports.delete = function(idRegioes){

    const sqlDeleteRegioes = format(deleteRegioes, idRegioes);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteRegioes, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete regiões efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function update(ObjRegioes){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjRegioes.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateRegioes, [                    
                    element.reg_id, element.reg_nome, element.reg_percentual
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Regiões atualizado com sucesso!',
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