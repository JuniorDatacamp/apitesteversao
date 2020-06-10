const configuracaoPainel = require('../../config/database');
const utils = require('../../utils/funcUtils');

const sqlUsuarioLogin = 
    "   select "+
    "       usu_id, usu_ativo, emp_id  "+
    "   from "+
    "       usuarios_login "+
    "   where "+
    "       usu_token = $1 and usu_ativo = $2 ";

const sqlInsertLogin = 
    "   insert into  "+
    "	    usuarios_login (usu_ativo, emp_id, usu_token)  "+
    "   values "+
    "	    ($1, $2, $3) ";

const sqlUpdateUsuariosLogin =
    "  update usuarios_login set usu_ativo = 'N' where usu_token = $1 ";
    
const sqlNomeUsuario = 
    ' select usa_nome from usuarios_autorizados where usa_email = $1 ';

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

exports.retornarLogin = function retornarLogin(token){

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlUsuarioLogin, [token, 'S'], (error, results) => {
            const usuario = results.rows;
    
            return resolve(usuario);
        });
    });
};

exports.insertLogin = function insertLogin(codEmpresa, oToken){

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlInsertLogin, ['S', codEmpresa, oToken], (error, results) => {
    
            if (error){
                console.log('Erro ao tentar inserir token no painel de licença.', error);
                return reject("Erro ao tentar inserir token no painel de licença! " + error);
            }else{
                return resolve(results.rows);
            }
        });
    });    
};

exports.logout = function logout(oToken){

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlUpdateUsuariosLogin, [oToken], (error, results) => {
            const usuario = results.rowCount;
    
            if (error){
                return reject("Erro ao tentar efetuar logout.");
            }else{
                return resolve(usuario);
            }            
        });
    });
};

exports.atualizarCodigoAcesso = function atualizarCodigoAcesso(email){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco = configuracaoPainel.conexaoPainel;        

        ConexaoBanco.query(sqlNomeUsuario, [email], (error, results) => {            

            if (error){
                return reject("Erro ao buscar usuário para atualizar código de confirmação do usuário. "+ error);
            }else{
                if (results.rowCount > 0){
            
                    const nomeUsuario = results.rows[0].usa_nome;
                    const codigoConfirmacao = utils.codigoAleatorio();

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
};

exports.verificaCodigoAcesso = function verificaCodigoAcesso(codigo, email){

    const ConexaoBanco = configuracaoPainel.conexaoPainel;

    return new Promise((resolve, reject) => {
    
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
};