const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTipoDocto =
    ` select tip_id, tip_descricao, tip_indicador_de_titulo from tipo_docto `;

const insertTipoDocto =
    ` insert into tipo_docto
        (tip_id, tip_descricao, tip_indicador_de_titulo)
    values
        %L `;

const deleteTipoDocto =
    ` delete from tipo_docto where tip_id in (%s) `;

const updateTipoDocto = 
    `   update tipo_docto set tip_descricao = $2, tip_indicador_de_titulo = $3, tip_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' where tip_id = $1 `;

exports.getTipoDocto = function getTipoDocto(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlTipoDocto, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tipoDocto = results.rows;
                return resolve(tipoDocto);
            }
        });
    });
};

exports.insert = function insert(ObjTipoDocto){
  
    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsTipoDocto     = [];

        ObjTipoDocto.forEach(tipoDocto => {
            
            paramsTipoDocto.push([                
                tipoDocto.tip_id, tipoDocto.tip_descricao, tipoDocto.tip_indicador_de_titulo
            ]);
        });       

        var sql = format(insertTipoDocto, paramsTipoDocto);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir tipos documentos. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipos Documentos inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });     
};

exports.delete = function(idTipoDocto){

    const sqlDeleteTipoDocto = format(deleteTipoDocto, idTipoDocto);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTipoDocto, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete tipos documentos efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function update(ObjTipoDocto){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjTipoDocto.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateTipoDocto, [
                    element.tip_id, element.tip_descricao, element.tip_indicador_de_titulo
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Tipos Documentos atualizado com sucesso!',
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