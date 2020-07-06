const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlPaises =
    ` select pai_cod, pai_nome from paises `;

const insertPaises =
    ` insert into paises
        (pai_cod, pai_nome)
    values
        %L `;

const deletePaises =
    ` delete from paises where pai_cod in (%s) `; 

const updatePaises = 
    `   update paises set pai_nome = $2 where pai_cod = $1 `;

exports.getPaises = function getPaises(){    
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;
        ConexaoBanco.query(sqlPaises, (error, results) => {

            if (error){
                return reject(error);
            }else{
                const pais = results.rows;
                return resolve(pais);
            }                
        });
    }); 
};

exports.insert = function insert(ObjPaises){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;

        var paramsPais      = [];

        ObjPaises.forEach(pais => {
            
            paramsPais.push([
                pais.pai_cod, pais.pai_nome
            ]);
        });       

        var sql = format(insertPaises, paramsPais);
       
        ConexaoBanco.query(sql, (error, results) => {            
           
            if (error){
                console.log('Erro ao inserir países. '+ error);
                return reject(error);
            }
            else{
                console.log('Países inserido com sucesso! Quantidade registros:', results.rowCount);
                var pais = results.rows;
                return resolve(pais);
            }
        });
    });
};

exports.delete = function(idPaises){

    const sqlDeletePaises = format(deletePaises, idPaises);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeletePaises, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete países efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjPaises){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjPaises.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updatePaises, [
                    element.pai_cod, element.pai_nome
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Países atualizado com sucesso!',
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