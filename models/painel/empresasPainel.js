const configuracaoPainel = require('../../config/database');

const sqlQtdeAcessoEmpresa = 
    "   select   "+
    "	    emp_qtde_acesso, "+
    "	    (select count(*) as qtde_login from usuarios_login where usu_ativo = 'S' and emp_ativo = 'S' and emp_id = $1)  "+
    "   from  "+
    "	    empresas where emp_id = $2  ";

const sqlEmpresaLogin =
    "   select count(*) as login, emp_url from empresas where emp_id = $1 and emp_cnpj = $2 and emp_senha = $3 group by emp_url ";

//utilizar para login quando não é vendedor ex: retaguar ou outro painel
exports.login = function login(dadosLogin){

    const codEmpresa = dadosLogin.codEmpresa;
    const cnpjEmpresa = dadosLogin.cnpjEmpresa;
    const senhaEmpresa = dadosLogin.senhaEmpresa;

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {

        ConexaoBanco.query(sqlEmpresaLogin, [codEmpresa, cnpjEmpresa, senhaEmpresa], (error, results) => {
            const empresa = results.rows[0];
            
            if (error){
                return reject(error);
            }
            else{
                if (results.rowCount == 0){
                    return reject(401.005);
                }
                return resolve(empresa);
            }
        });
    });
};

exports.verificarQtdeAcesso = function verificarQtdeAcesso(codEmpresa){

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlQtdeAcessoEmpresa, [codEmpresa, codEmpresa], (error, results) => {

            if (results.rowCount == 0){
                return reject(401.005);
            }else if (parseInt(results.rows[0].qtde_login) >= parseInt(results.rows[0].emp_qtde_acesso)){
                return reject(401.006);
            }else{
                return resolve(results.rows[0].emp_qtde_acesso);
            }
        });
    });
};