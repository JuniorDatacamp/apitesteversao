const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlPromocao =
    `   select 
	        prm_id, prm_descricao, prm_dt_lancamento, prm_dt_inicial, prm_dt_final
        from 
	        promocao `;

const insertPromocao =
    `   insert into promocao
            (prm_id, prm_descricao, prm_dt_lancamento, prm_dt_inicial, prm_dt_final)
        values
            %L `;

const deletePromocao =
    `   delete from promocao where prm_id in (%s) `;

const updatePromocao =
    `   update promocao 
            set prm_descricao = $2, prm_dt_lancamento = $3, prm_dt_inicial = $4, prm_dt_final = $5, 
            prm_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            prm_id = $1 `;

exports.getPromocao = function getPromocao(parametro){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlPromocao+parametro+' order by prm_id', (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const promocao = results.rows;
                return resolve(promocao);
            }
        });
    });
};

exports.insert = function insert(ObjPromocao){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsPromocao  = [];

        ObjPromocao.forEach(promocao => {
            
            paramsPromocao.push([
                promocao.prm_id, promocao.prm_descricao, promocao.prm_dt_lancamento, promocao.prm_dt_inicial, 
                promocao.prm_dt_final
            ]);
        });       

        var sql = format(insertPromocao, paramsPromocao);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir promoção. '+ error);
                return reject(error);
            }
            else{
                console.log('Promoção inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idPromocao){

    const sqlDeletePromocao = format(deletePromocao, idPromocao);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeletePromocao, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete promoção efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjPromocao){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjPromocao.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updatePromocao, [
                    element.prm_id, element.prm_descricao, element.prm_dt_lancamento, element.prm_dt_inicial, 
                    element.prm_dt_final
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Promoção atualizado com sucesso!',
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