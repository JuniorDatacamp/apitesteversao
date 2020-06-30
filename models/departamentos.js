const format = require('pg-format');
const Configuracao = require('../config/database');
const sqlDepartamentos = 
    'select dep_id, dep_descricao, dep_desconto, dep_coeficiente, dep_situacao, dep_acesso_api from departamento ';

const sqlOrderby =
    ' order by dep_id ';

const insertDepartamento =
    `   insert into departamento 
            (dep_id, dep_descricao, dep_desconto, dep_coeficiente, dep_situacao, dep_acesso_api)
        values 
            ($1, $2, $3, $4, $5, $6) `;

const deleteDepartamento =
    `   WITH retorno AS 
            (DELETE FROM departamento WHERE dep_id in (%s) RETURNING dep_id, 'departamentos', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `

const updateDepartamento =
    `   update departamento 
            set dep_descricao = $2, dep_desconto = $3, dep_coeficiente = $4, dep_situacao = $5, dep_acesso_api = $6, dep_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            dep_id = $1 `;

exports.retornarDepartamentos = function retornarDepartamentos(package){

    //utilizar na sync e syncFull
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;        
        var params = [];

        if (package.pacotefull){
            var addWhere = ' ';
        }else{
            var addWhere = ' where dep_dt_ultima_atualizacao > $1 ';
            params.push(package.data);
        }
   
        console.log('Consultando departamento...');
        ConexaoBanco.query(sqlDepartamentos+addWhere+sqlOrderby, params, (error, results) => {
            
            if (error){
                return reject('Erro ao consultar departamento no banco de dados.');
            }else{
                const departamento = results.rows;
                return resolve(departamento);
            }
        });
    });
};

exports.getDepartamentosFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDepartamentos+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const departamento = results.rows;
                return resolve(departamento);
            }
        });
    });    
};

exports.delete = function(idDepartamentos){

    const sqlDeleteDepto = format(deleteDepartamento, idDepartamentos);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteDepto, function(error, results){

            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete departamento(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.update = function(objDepartamento){
   
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    objDepartamento.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateDepartamento, [
                    element.dep_id, element.dep_descricao, element.dep_desconto, 
                    element.dep_coeficiente, element.dep_situacao, element.dep_acesso_api
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Departamento atualizado com sucesso!',
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

exports.insert = function (objDepartamento){

    return new Promise((resolve, reject) => {    

        const ConexaoBanco = Configuracao.conexao;

        const dadosSqlDepartamento = Configuracao.formatSql('insert', 'departamento', objDepartamento, '');
        const insertDepartamento = dadosSqlDepartamento.sqlText;

        ConexaoBanco.query(insertDepartamento, (error, results) => {
        
            if (error){                    
                console.log('Erro ao inserir departamento. '+ error);
                return reject(error);
            }else{
                console.log('Departamento inserido com sucesso! Quantidade registros:', results.rowCount);
                const departamento = results.rows;
                return resolve(departamento);
            }                
        });
    });       
};