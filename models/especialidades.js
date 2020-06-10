const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlEspecialidades = 
    ` select esp_id, esp_descricao, esp_finan from especialidade `;

const insertEspecialidades = 
    ` insert into especialidade 
        (esp_id, esp_descricao, esp_finan)
    values
        %L `;

const deleteEspecialidades =
    ` delete from especialidade where esp_id in (%s) `;        

const updateEspecialidades = 
    `   update 
            especialidade set esp_descricao = $2, esp_finan = $3
        where
            esp_id = $1 `;

exports.getEspecialidadesFull = function getEspecialidadesFull(){

    //Utilizar para chamada de get, receber todos os campos.

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlEspecialidades, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const especialidade = results.rows;
                return resolve(especialidade);
            }
        });
    });
};

exports.insert = function insert(ObjEspecialidades){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsEspecialidade     = [];

        ObjEspecialidades.forEach(especialidade => {
            
            paramsEspecialidade.push([
                especialidade.esp_id, especialidade.esp_descricao, especialidade.esp_finan
            ]);
        });       

        var sql = format(insertEspecialidades, paramsEspecialidade);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir especialidade(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Especialidade(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var resultCliente = results.rows;
                return resolve(resultCliente);
            }
        });
    });     
};

exports.delete = function(idEspecialidades){

    const sqlDeleteEspecialidade = format(deleteEspecialidades, idEspecialidades);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteEspecialidade, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete especialidade(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjEspecialidades){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjEspecialidades.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateEspecialidades, [
                    element.esp_id, element.esp_descricao, element.esp_finan
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Especialidades(s) atualizado com sucesso!',
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