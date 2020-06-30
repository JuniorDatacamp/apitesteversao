const Configuracao = require('../config/database');
const utils = require('../utils/funcUtils');

const sqlUsuarios = 
    `   select 
            usa_id as id, usa_email as email, usa_telefone as telefone, usa_nome as nome, 
            usa_codigo_acesso as codacesso, usa_datahora_codigo as datahoracodigo, emp_id as codempresa, 
            usa_codigo_vendedor as codvendedor, usa_token as token, usa_ativo as ativo
        from
            usuarios_autorizados
        where
            emp_id = $1 and usa_nome ilike $2
    `;

const sqlOrderby =
    ' order by usa_nome';

const sqlInsertUsuarios =
    `   insert into usuarios_autorizados
	        (usa_email, usa_telefone, usa_nome, emp_id, usa_codigo_vendedor, usa_token, usa_ativo)
        values
            ($1, $2, $3, $4, $5, $6, $7) RETURNING usa_id as id;
    `;

const sqlEditUsuarios =
    `
        update usuarios_autorizados set usa_email = $1, usa_telefone = $2, usa_nome = $3, emp_id = $4, usa_codigo_vendedor = $5, usa_token = $6,
        usa_ativo = $7
        where
            usa_id = $8
    `;

const sqlAtualizarToken =
    `  
        update 
            usuarios_autorizados set usa_token = $1
        where
            usa_email = $2 
    `;

const sqlDeleteUsuarios =
    ` delete from usuarios_autorizados where usa_id = $1 `;

const sqlQtdeAcessoEmpresa =
    `   select
	        emp_qtde_acesso,
	        count(*) as qtde_login	
        from
	        empresas e 
        inner join
	        usuarios_autorizados u on e.emp_id = u.emp_id
        where 
	        emp_cnpj = $1 and usa_ativo = 'A' and emp_ativo = 'A'
        group by
            emp_qtde_acesso `;

const sqlNomeUsuario = 
    `   select 
            CAST(TO_CHAR(AGE(CURRENT_DATE, usa_datahora_codigo),'DD') AS INTEGER) AS dias, usa_nome,
            usa_codigo_acesso
        from 
            usuarios_autorizados where usa_email = $1 and usa_ativo = 'A' `;

const sqlUpdateCodigoUsuarioAtualizado =
    ' update usuarios_autorizados set usa_datahora_codigo = now(), usa_codigo_acesso = $1 where usa_email = $2 ';

const sqlValidarCodigoAcesso =
    `   select
            e.emp_id, emp_url, usa_codigo_vendedor
        from 
            usuarios_autorizados u
        inner join
            empresas e on u.emp_id = e.emp_id	
        where
            usa_codigo_acesso = $1 and usa_email = $2 and date(now()) - date(usa_datahora_codigo) <= 0  `;
            
const sqlUsuarioAtivo =
    `   select
            usa_id, usa_ativo, usa_token, emp_id
        from
            usuarios_autorizados
        where
            usa_token = $1 and usa_ativo = 'A'   `;

const sqlLogout =
    `   update usuarios_autorizados set usa_token = '' where usa_token = $1 `;

module.exports = {
    
    get (codEmpresa, nomeUsuario){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            const usaNome = (nomeUsuario) ? '%'+nomeUsuario+'%' : '%';

            ConexaoBanco.query(sqlUsuarios, [codEmpresa, usaNome], (error, results) => {

                if (error){
                    return reject('Erro ao consultar usuário no banco de dados.' + error);
                }else{
                    return resolve(results.rows);
                }
            });
        });
    },

    insert (objUsuario){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlInsertUsuarios, [
                objUsuario.email, objUsuario.telefone, objUsuario.nome, objUsuario.codempresa, objUsuario.codvendedor,
                objUsuario.token, objUsuario.ativo
            ],(error, results) => {

                if (error){
                    return reject('Erro ao cadastrar usuário no banco de dados.' + error);
                }else{
                    return resolve(results.rows[0]);
                }
            });
        });
    },

    edit (objUsuario){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlEditUsuarios, [
                objUsuario.email, objUsuario.telefone, objUsuario.nome, objUsuario.codempresa, objUsuario.codvendedor,
                objUsuario.token, objUsuario.ativo, objUsuario.id
            ],(error, results) => {

                if (error){
                    return reject('Erro ao cadastrar usuário no banco de dados.' + error);
                }else{
                    return resolve('Usuário atualizada com sucesso!');
                }
            });
        });
    },

    delete (idEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlDeleteUsuarios, [idEmpresa], (error, results) => {

                if (error){
                    return reject('Erro ao remover usuário no banco de dados.' + error);
                }else{
                    return resolve('Usuário removida com sucesso!');
                }
            });
        });
    },

    validarUsuario (token){

        return new Promise((resolve, reject) => {
        
            const ConexaoBanco = Configuracao.conexao;
    
            ConexaoBanco.query(sqlUsuarioAtivo, [token], (error, results) => {
                
                if (results.rowCount === 0){
                    return reject(401.002);
                }else{
                    const usuario = results.rows[0];
                    return resolve(usuario);
                }
            });
        });
    },    

    autorizadoInclusao (cnpjEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;
        
            ConexaoBanco.query(sqlQtdeAcessoEmpresa, [cnpjEmpresa], (error, results) => {

                if (results.rowCount === 0){
                    return resolve('OK');
                }              
                else if (parseInt(results.rows[0].qtde_login) >= parseInt(results.rows[0].emp_qtde_acesso)){
                    return reject(401.006);
                }else{
                    return resolve('OK');
                }
            });
        });
    },

    atualizarToken (dadosUsuario){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlAtualizarToken, [dadosUsuario.token, dadosUsuario.email], (error, results) => {

                if (results.rowCount === 0){
                    return reject('Email cadastrado na base de dados diferente do painel.');
                }else if (error){
                    return reject('Erro ao atualizar token do usuário no banco de dados.' + error);
                }else{
                    return resolve('Token do Usuário atualizado com sucesso!');
                }
            });
        });
    },

    atualizarCodigoAcesso (email){

        return new Promise((resolve, reject) => {
        
            const ConexaoBanco = Configuracao.conexao;
    
            ConexaoBanco.query(sqlNomeUsuario, [email], (error, results) => {
   
                if (error){
                    return reject("Erro ao buscar usuário para atualizar código de confirmação do usuário. "+ error);
                }else{
                    if (results.rowCount > 0){

                        const nomeUsuario = results.rows[0].usa_nome;
                        var codigoConfirmacao;

                        if (results.rows[0].dias > 0 || results.rows[0].usa_codigo_acesso == 0 ) {
                            codigoConfirmacao = utils.codigoAleatorio();
                        }else{
                            codigoConfirmacao = results.rows[0].usa_codigo_acesso;
                        }                        
    
                        ConexaoBanco.query(sqlUpdateCodigoUsuarioAtualizado, [codigoConfirmacao, email], (errorUpdate, resultsUpdate) => {
                           
                            if(errorUpdate){
                                return reject("Erro ao atualizar código de confirmação do usuário. "+ errorUpdate);
                            }else{
                                return resolve({nomeUsuario, codigoConfirmacao});
                            }
                        });
                    }else{
                        return reject(401.007);
                    }
                }            
            });
        });
    },

    verificaCodigoAcesso(codigo, email){
    
        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;
        
            ConexaoBanco.query(sqlValidarCodigoAcesso, [codigo, email], (error, results) => {
                
                if (error){
                    return reject("Erro ao buscar usuário para validar código de confirmação. "+ error);
                }else{
                    if (results.rowCount > 0){
                        const usuario = results.rows[0];
    
                        return resolve(usuario);
                    }else{
                        return reject(401.007);
                    }
                }
            });
        });
    },

    logout (token){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlLogout, [token], (error, results) => {

                if (error){
                    return reject('Erro ao efetuar logout.' + error);
                }else{
                    return resolve(results.rowCount);
                }
            });
        });
    }
};