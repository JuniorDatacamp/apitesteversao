const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlItemPromocao =
    `   select
            ipr_id, prm_id, pro_id, ipr_vlr_promocao, pgr_id
        from
	        item_promocao `;

const insertItemPromocao =
    `   insert into item_promocao
            (ipr_id, prm_id, pro_id, ipr_vlr_promocao, pgr_id)
        values
            %L `;

const deleteItemPromocao =
    `   delete from item_promocao where ipr_id in (%s) `;

const updateItemPromocao =
    `   update item_promocao
            set prm_id = $2, pro_id = $3, ipr_vlr_promocao = $4, pgr_id = $5, ipr_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            ipr_id = $1 `;

exports.getItemPromocao = function getItemPromocao(parametro){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlItemPromocao+parametro+' order by ipr_id', (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const itemPromocao = results.rows;
                return resolve(itemPromocao);
            }
        });
    });
};

exports.insert = function insert(ObjItemPromocao){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsItemPromocao     = [];

        ObjItemPromocao.forEach(itemPromocao => {

            paramsItemPromocao.push([
                itemPromocao.ipr_id, itemPromocao.prm_id, itemPromocao.pro_id, itemPromocao.ipr_vlr_promocao,
                itemPromocao.pgr_id
            ]);
        });       

        var sql = format(insertItemPromocao, paramsItemPromocao);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir item de promoção. '+ error);
                return reject(error);
            }
            else{
                console.log('Item de promoção inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });
};

exports.delete = function(idItemPromocao){

    const sqlDeleteItemPromocao = format(deleteItemPromocao, idItemPromocao);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteItemPromocao, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete item de promoção efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjItemPromocao){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjItemPromocao.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateItemPromocao, [
                    element.ipr_id, element.prm_id, element.pro_id, element.ipr_vlr_promocao, element.pgr_id                    
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Item de promoção atualizado com sucesso!',
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