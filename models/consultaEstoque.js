const format = require('pg-format');
const Configuracao = require('../config/database');
const sqlConsultaEstoques = 
    `   select 
            cnpj, empresa, pro_referencia, estoque, dt_ultima_atualizacao
        from 
            vw_estoques 
        where 
            pro_referencia ilike $1 order by pro_referencia
    `;

exports.getConsultaEstoques = function getConsultaEstoques(params){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
           
        console.log('Consultando estoques dos produtos...');
        ConexaoBanco.query(sqlConsultaEstoques, [params], (error, results) => {
            
            if (error){
                return reject('Erro ao consultar estoques dos produtos no banco de dados.'+error);
            }else{
                const estoques = results.rows;
                return resolve(estoques);
            }
        });
    });
};