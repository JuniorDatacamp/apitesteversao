const Configuracao = require('../config/database');
const utils = require('../utils/funcUtils');

const sqlEmpresas = 
    `   select 
            emp_id as id, emp_nome as nome, emp_cpf as cpf, emp_cnpj as cnpj, 
            emp_senha as senha, emp_ativo as ativo, emp_qtde_acesso as qtdeacesso, 
            emp_url as url, emp_nivel as nivel 
        from 
            empresas
        where
            emp_nome ilike $1
        order by
            emp_nome    
    `;

const sqlOrderby =
    ' order by emp_nome';

const sqlInsertEmpresas =
    `   insert into empresas
	        (emp_nome, emp_cpf, emp_cnpj, emp_senha, emp_ativo, emp_qtde_acesso, emp_url, emp_nivel)
        values
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING emp_id as id;
    `;

const sqlEditEmpresas =
    `
        update empresas set emp_nome = $1, emp_cpf = $2, emp_cnpj = $3, emp_senha = $4, emp_ativo = $5, 
            emp_qtde_acesso = $6, emp_url = $7, emp_nivel = $8
        where
            emp_id = $9
    `;

const sqlDeleteEmpresas =
    ` delete from empresas where emp_id = $1 `;

const sqlLogin =
    `   select 
            emp_id as id, emp_nivel as nivel, emp_nome as nome, coalesce(emp_url, '') as url
        from 
            empresas
        where
            (emp_cpf = $1 or emp_cnpj = $1) and emp_senha = $2 and emp_ativo = 'A'
    `; 

module.exports = {
    
    get (nomeEmpresa){

        return new Promise((resolve, reject) => {

            const empNome = (nomeEmpresa) ? '%'+nomeEmpresa+'%' : '%';

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlEmpresas, [empNome], (error, results) => {

                if (error){
                    return reject('Erro ao consultar empresas no banco de dados.' + error);
                }else{
                    return resolve(results.rows);
                }
            });
        });
    },

    insert (objEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            const cryptoSenha = utils.criptografar(objEmpresa.senha);

            ConexaoBanco.query(sqlInsertEmpresas, [
                objEmpresa.nome, objEmpresa.cpf, objEmpresa.cnpj, cryptoSenha, objEmpresa.ativo, 
                objEmpresa.qtdeacesso, objEmpresa.url, objEmpresa.nivel
            ],(error, results) => {
               
                if (error){
                    console.log(error);
                    return reject('Erro ao cadastrar empresa no banco de dados.' + error);
                }else{
                    return resolve(results.rows[0]);
                }
            });
        });
    },

    edit (objEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlEditEmpresas, [
                objEmpresa.nome, objEmpresa.cpf, objEmpresa.cnpj, objEmpresa.senha, objEmpresa.ativo, 
                objEmpresa.qtdeacesso, objEmpresa.url, objEmpresa.nivel, objEmpresa.id
            ],(error, results) => {

                if (error){
                    return reject('Erro ao cadastrar empresa no banco de dados.' + error);
                }else{
                    return resolve('Empresa atualizada com sucesso!');
                }
            });
        });
    },

    delete (idEmpresa){

        return new Promise((resolve, reject) => {

            const ConexaoBanco = Configuracao.conexao;

            ConexaoBanco.query(sqlDeleteEmpresas, [idEmpresa], (error, results) => {

                if (error){
                    return reject('Erro ao remover empresa no banco de dados.' + error);
                }else{
                    return resolve('Empresa removida com sucesso!');
                }
            });
        });
    },

    login (dadosLogin){

        return new Promise((resolve, reject) => {

            console.log(dadosLogin);

            const ConexaoBanco = Configuracao.conexao;

            const cryptSenha = utils.criptografar(dadosLogin.senha);

            console.log(cryptSenha);

            ConexaoBanco.query(sqlLogin, [dadosLogin.login, cryptSenha], (error, results) => {

                if (results.rowCount === 0){
                    return reject(401.005);
                }                
                else if (error){
                    return reject('Erro ao efetuar login.' + error);
                }else{                    
                    return resolve(results.rows[0]);
                }
            });
        });
    }    
}