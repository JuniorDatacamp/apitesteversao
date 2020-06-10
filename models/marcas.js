const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlMarcas =
    ` select mrc_id, mrc_descricao from marca `;

const insertMarcas =
    ` insert into marca
        (mrc_id, mrc_descricao)
    values
        %L `;

const deleteMarcas =
    ` delete from marca where mrc_id in (%s) `; 

const updateMarcas = 
    `   update marca set mrc_descricao = $2 where mrc_id = $1 `;

exports.getMarcas = function getMarcas(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlMarcas, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.insert = function insert(ObjMarcas){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsMarca     = [];

        ObjMarcas.forEach(marca => {
            
            paramsMarca.push([
                marca.mrc_id, marca.mrc_descricao
            ]);
        });       

        var sql = format(insertMarcas, paramsMarca);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir marca(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Marca(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idMarcas){

    const sqlDeleteMarca = format(deleteMarcas, idMarcas);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteMarca, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete marca(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjMarcas){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjMarcas.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateMarcas, [
                    element.mrc_id, element.mrc_descricao
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Marca(s) atualizado com sucesso!',
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