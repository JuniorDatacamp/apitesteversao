const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlMunicipios = 
    ` select mun_cod, mun_nome, mun_cod_uf, mun_uf from municipios `;

const sqlOrderby =
    ' order by mun_nome ';

const insertMunicipios =
    `   insert into municipios 
            (mun_cod, mun_nome, mun_cod_uf, mun_uf)
        values 
            %L `;

const deleteMunicipios =
    `   WITH retorno AS 
            (DELETE FROM municipios WHERE mun_cod in (%s) RETURNING mun_cod, 'municipios', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `

const updateMunicipios =
    `   update municipios
            set mun_nome = $2, mun_cod_uf = $3, mun_uf = $4, mun_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            mun_cod = $1 `;

exports.retornarMunicipiosApp = function retornarMunicipios(package){

    return new Promise((resolve, reject) => {   
        
        const ConexaoBanco = Configuracao.conexao;
        var params = [];

        if (package.pacotefull){
            var addWhere = " where mun_uf = 'MG' ";
        }else{
            var addWhere = " where mun_uf = 'MG' and mun_dt_ultima_atualizacao > $1 ";
            params.push(package.data);
        }     
    
        console.log('Consultando municipios...');
        ConexaoBanco.query(sqlMunicipios +addWhere +sqlOrderby, params, (error, results) => {

            if (error){
                return reject('Erro ao consultar municípios no banco de dados.');
            }else{  
                const municipios = results.rows;    
                return resolve(municipios);
            }
        });
    });
};

exports.getMunicipiosFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlMunicipios +parametro +sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const municipio = results.rows;
                return resolve(municipio);
            }
        });
    });      
};

exports.delete = function(idMunicipios){

    const sqlDeleteMunicipio = format(deleteMunicipios, idMunicipios);

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteMunicipio, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete municipio(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });   
};

exports.update = function(objMunicipios){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    objMunicipios.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateMunicipios, [                    
                    element.mun_cod, element.mun_nome, element.mun_cod_uf, element.mun_uf
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Municipio(s) atualizado com sucesso!',
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

exports.insert = function (objMunicipios){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsMunicipios     = [];

        objMunicipios.forEach(municipio => {
            
            paramsMunicipios.push([
                municipio.mun_cod, municipio.mun_nome, municipio.mun_cod_uf, municipio.mun_uf
            ]);
        });       

        var sql = format(insertMunicipios, paramsMunicipios);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir municipio(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Municipio(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var resultCliente = results.rows;
                return resolve(resultCliente);
            }
        });
    });     
};