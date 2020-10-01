const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlFiliais =
    ` select fil_id, fil_cnpj, fil_nome, fil_uf, fil_ie, mun_cod, fil_im, fil_suframa from filiais `;

const insertFiliais =
    ` insert into filiais
        (fil_id, fil_cnpj, fil_nome, fil_uf, fil_ie, mun_cod, fil_im, fil_suframa)
    values
        %L `;

const deleteFiliais =
    ` delete from filiais where fil_id in (%s) `; 

const updateFiliais = 
    `   update filiais set fil_cnpj = $2, fil_nome = $3, fil_uf = $4, fil_ie = $5, mun_cod = $6, fil_im = $7, fil_suframa = $8 where fil_id = $1 `;

exports.getFiliais = function getFiliais(){    
    
    return new Promise((resolve, reject) => {        

        const ConexaoBanco = Configuracao.conexao;
        ConexaoBanco.query(sqlFiliais, (error, results) => {

            if (error){
                return reject(error);
            }else{
                const Filiais = results.rows;
                return resolve(Filiais);
            }                
        });
    }); 
};

exports.insert = function insert(ObjFiliais){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;

        var paramsFiliais      = [];

        ObjFiliais.forEach(Filial => {
            
            paramsFiliais.push([
                Filial.fil_id, Filial.fil_cnpj, Filial.fil_nome, Filial.fil_uf, Filial.fil_ie, Filial.mun_cod, Filial.fil_im, Filial.fil_suframa
            ]);
        });       

        var sql = format(insertFiliais, paramsFiliais);
       
        ConexaoBanco.query(sql, (error, results) => {            
           
            if (error){
                console.log('Erro ao inserir Filial. '+ error);
                return reject(error);
            }
            else{
                console.log('Filial inserido com sucesso! Quantidade registros:', results.rowCount);
                var Filiais = results.rows;
                return resolve(Filiais);
            }
        });
    });
};

exports.delete = function(idFiliais){

    const sqlDeleteFiliais = format(deleteFiliais, idFiliais);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteFiliais, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete Filial efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjFiliais){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjFiliais.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateFiliais, [
                    element.fil_id, element.fil_cnpj, element.fil_nome, element.fil_uf, element.fil_ie, element.mun_cod, element.fil_im, element.fil_suframa
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Filial atualizado com sucesso!',
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