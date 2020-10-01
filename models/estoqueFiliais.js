const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlEstoqueFiliais =
    ` select estfil_id, fil_id, pro_referencia, estfil_estoque from estoque_filiais `;

const insertEstoqueFiliais =
    ` insert into estoque_filiais
        (fil_id, pro_referencia, estfil_estoque)
    values
        %L `;

const deleteEstoqueFiliais =
    ` delete from estoque_filiais where fil_id = $1 and pro_referencia in (%s) `; 

const updateEstoqueFiliais = 
    `   update estoque_filiais set estfil_estoque = $3, estfil_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' where fil_id = $1 and pro_referencia = $2 `;

exports.getEstoqueFiliais = function getEstoqueFiliais(){    
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;
        ConexaoBanco.query(sqlEstoqueFiliais, (error, results) => {

            if (error){
                return reject(error);
            }else{
                const estoqueFiliais = results.rows;
                return resolve(estoqueFiliais);
            }                
        });
    }); 
};

exports.insert = function insert(ObjEstoqueFiliais){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;

        var paramsEstoqueFiliais      = [];

        ObjEstoqueFiliais.forEach(EstoqueFiliais => {
            
            paramsEstoqueFiliais.push([
                EstoqueFiliais.fil_id, EstoqueFiliais.pro_referencia, EstoqueFiliais.estfil_estoque
            ]);
        });       

        var sql = format(insertEstoqueFiliais, paramsEstoqueFiliais);
       
        ConexaoBanco.query(sql, (error, results) => {            
           
            if (error){
                console.log('Erro ao inserir Estoque da Filial. '+ error);
                return reject(error);
            }
            else{
                console.log('Estoque Filial inserido com sucesso! Quantidade registros:', results.rowCount);
                var EstoqueFiliais = results.rows;
                return resolve(EstoqueFiliais);
            }
        });
    });
};

exports.delete = function(filId, arrayProReferencia){

    const sqlDeleteEstoqueFiliais = format(deleteEstoqueFiliais, arrayProReferencia);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteEstoqueFiliais, [filId], function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({         
                    mensagem: 'Delete Estoque Filial efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjEstoqueFiliais){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjEstoqueFiliais.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateEstoqueFiliais, [
                    element.fil_id, element.pro_referencia, element.estfil_estoque
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Estoque Filial atualizado com sucesso!',
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