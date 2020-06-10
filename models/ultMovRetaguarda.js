const Configuracao = require('../config/database');

const sqlUltMovRetaguarda = 
    ' select sco_ult_mov_id_bd, sco_dt_ultima_atualizacao from sinc_contador ';

const insertUltMovRetaguarda = 
    ` insert into sinc_contador
        (sco_ult_mov_id_bd)
      values
        ($1) `;

const updateUltMovRetaguarda =
    ` update sinc_contador set sco_ult_mov_id_bd = $1 `;

const updateDataSyncRetaguarda =
    ` update sinc_contador set sco_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'  `;    

exports.getUltMovRetaguarda = function update(){
    
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlUltMovRetaguarda, (error, results) => {

            if (error){
                return reject(error);
            }else{
                const ultMovRetaguarda = results.rows;
                return resolve(ultMovRetaguarda[0]);
            }
        });
    });
};

exports.insert = function insert(ObjSincContador){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
     
        ConexaoBanco.query(insertUltMovRetaguarda, [ObjSincContador.sco_ult_mov_id_bd], (error, results) => {
            
            if (error){
                console.log('Erro ao inserir último movimento da retaguarda. '+ error);
                return reject(error);
            }
            else{
                console.log('Último movimento da retaguarda inserido com sucesso! Quantidade registros:', results.rowCount);
                var sinc = results.rows;
                return resolve(sinc);
            }
        });
    });
};

exports.update = function update(sincContador){
    
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(updateUltMovRetaguarda, [
            sincContador.sco_ult_mov_id_bd
        ], (error, results) => {

            if (error){
                return reject(error);
            }else{
                return resolve({
                    mensagem: 'Último movimento da retaguarda atualizado com sucesso!',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.updateDataHora = function updateDataHora(){
    
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(updateDataSyncRetaguarda, (error, results) => {

            if (error){
                return reject(error);
            }else{
                return resolve({
                    mensagem: 'Último sync data/hora movimento da retaguarda atualizado com sucesso!',
                    registros: results.rowCount
                });
            }
        });
    });
};