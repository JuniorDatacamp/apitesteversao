const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlTiposPedido =
    ` select tpp_id, tpp_nome, tpp_gera_financ, tpp_baixa_estoq, tpp_tipo, tpp_vlr_total_zerado from tipos_pedido `;

const insertTiposPedido =
    ` insert into tipos_pedido
        (tpp_id, tpp_nome, tpp_gera_financ, tpp_baixa_estoq, tpp_tipo, tpp_vlr_total_zerado)
    values
        %L `;

const deleteTiposPedido =
    `   WITH retorno AS 
            (DELETE FROM tipos_pedido WHERE tpp_id in (%s) RETURNING tpp_id, 'tiposPedido', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `;

const updateTiposPedido = 
    `   update tipos_pedido set
            tpp_nome = $2, tpp_gera_financ = $3, tpp_baixa_estoq = $4, 
            tpp_tipo = $5, tpp_vlr_total_zerado = $6, tpp_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo' 
        where 
            tpp_id = $1 `;

exports.retonarTiposPedidoApp = function retonarTiposPedidoApp(package){
    
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        var params = [];
    
        if (package.pacotefull){
            var addWhere = ' ';
        }else{
            var addWhere = ' where tpp_dt_ultima_atualizacao > $1 ';
            params.push(package.data);
        }

        ConexaoBanco.query(sqlTiposPedido+addWhere, params, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.getTiposPedido = function getTiposPedido(){

    const ConexaoBanco = Configuracao.conexao;
    
    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlTiposPedido, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.insert = function insert(ObjTiposPedido){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsTiposPedido     = [];

        ObjTiposPedido.forEach(tiposPedidos => {
            
            paramsTiposPedido.push([
                tiposPedidos.tpp_id, tiposPedidos.tpp_nome, tiposPedidos.tpp_gera_financ, tiposPedidos.tpp_baixa_estoq, 
                tiposPedidos.tpp_tipo, tiposPedidos.tpp_vlr_total_zerado
            ]);
        });       

        var sql = format(insertTiposPedido, paramsTiposPedido);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir tipo(s) de pedido. '+ error);
                return reject(error);
            }
            else{
                console.log('Tipo(s) de pedido inserido com sucesso! Quantidade registros:', results.rowCount);
                var tiposPedidos = results.rows;
                return resolve(tiposPedidos);
            }
        });
    });
};

exports.delete = function(idTiposPedido){

    const sqlDeleteTiposPedido = format(deleteTiposPedido, idTiposPedido);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteTiposPedido, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete tipo(s) de pedido efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function update(ObjTiposPedido){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    ObjTiposPedido.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateTiposPedido, [
                    element.tpp_id, element.tpp_nome, element.tpp_gera_financ, element.tpp_baixa_estoq, 
                    element.tpp_tipo, element.tpp_vlr_total_zerado
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Tipo(s) de pedido atualizado com sucesso!',
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