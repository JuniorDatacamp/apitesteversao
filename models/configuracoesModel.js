const Configuracao = require('../config/database');
const utils = require('../utils/funcUtils');

const sqlConfiguracoes = 
    `   select 
	        con_id, con_email_servidorsmtp, con_email_porta, con_email_usuario,
	        con_email_senha, con_email_conexao_segura, con_email_mensagem,
  	        con_email_tls, con_email_conf_leitura
        from 
	        configuracoes
    `;

const sqlOrderby =
    ' order by emp_nome';

const sqlInsertConfiguracoes =
    `   insert into configuracoes
            (con_email_servidorsmtp, con_email_porta, con_email_usuario, con_email_senha, 
            con_email_conexao_segura, con_email_mensagem, con_email_tls, con_email_conf_leitura)
        values
            ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

const sqlEditConfiguracoes =
    `
        update configuracoes set 
            con_email_servidorsmtp = $1, con_email_porta = $2, con_email_usuario = $3, con_email_senha = $4, 
            con_email_conexao_segura = $5, con_email_mensagem = $6, con_email_tls = $7, con_email_conf_leitura = $8
        where
            con_id = $9
    `;

const sqlDeleteConfiguracoes =
    ` delete from configuracoes where con_id = $1 `;

module.exports = {
    
    get (request, response){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlConfiguracoes, (error, results) => {

                if (error){
                    return reject('Erro ao consultar configurações no banco de dados.' + error);
                }else{
                    return resolve(results.rows);
                }
            });
        });
    },

    insert (objConfiguracoes){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;
           
            const cryptoSenhaEmail = utils.criptografar(objConfiguracoes.con_email_senha);

            ConexaoBanco.query(sqlInsertConfiguracoes, [
                objConfiguracoes.con_email_servidorsmtp, objConfiguracoes.con_email_porta, objConfiguracoes.con_email_usuario,
                cryptoSenhaEmail, objConfiguracoes.con_email_conexao_segura, objConfiguracoes.con_email_mensagem,
                objConfiguracoes.con_email_tls, objConfiguracoes.con_email_conf_leitura                

            ],(error, results) => {

                console.log(error);

                if (error){
                    return reject('Erro ao cadastrar configurações no banco de dados.' + error);
                }else{
                    return resolve('Configurações cadastrada com sucesso!');
                }
            });
        });
    },

    edit (objConfiguracoes){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlEditConfiguracoes, [
                objConfiguracoes.con_email_servidorsmtp, objConfiguracoes.con_email_porta, objConfiguracoes.con_email_usuario,
                objConfiguracoes.con_email_senha, objConfiguracoes.con_email_conexao_segura, objConfiguracoes.con_email_mensagem,
                objConfiguracoes.con_email_tls, objConfiguracoes.con_email_conf_leitura, objConfiguracoes.con_id
            ],(error, results) => {

                if (error){
                    return reject('Erro ao cadastrar configurações no banco de dados.' + error);
                }else{
                    return resolve('Configurações atualizada com sucesso!');
                }
            });
        });
    },

    delete (idEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlDeleteConfiguracoes, [idEmpresa], (error, results) => {

                if (error){
                    return reject('Erro ao remover configurações no banco de dados.' + error);
                }else{
                    return resolve('Configurações removida com sucesso!');
                }
            });
        });
    }
}