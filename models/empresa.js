const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlEmpresasApp =
    `   select
    	    emp_id, emp_nome, emp_cnpj, emp_endereco, emp_numero, emp_bairro, emp_cidade, emp_estado,
            emp_cep, emp_complemento, emp_telefone, emp_email, emp_homepage
       from
    	    empresas `;

const sqlEmpresas = 
    `   select
    	    emp_id, emp_nome, emp_cnpj, emp_endereco, emp_numero, emp_bairro, emp_cidade, emp_estado,
            emp_cep, emp_complemento, emp_telefone, emp_email, emp_homepage, emp_contato,
	        emp_nfeemail_servidorsmtp, emp_nfeemail_porta, emp_nfeemail_usuario,
	        emp_nfeemail_senha, emp_nfeemail_conexao_segura, emp_nfeemail_mensagem, emp_email_tls,
	        emp_email_conf_leitura
       from
    	    empresas `;

const insertEmpresas =
    `   insert into empresas 
            (emp_id, emp_nome, emp_cnpj, emp_endereco, emp_numero, emp_bairro, emp_cidade, emp_estado,
            emp_cep, emp_complemento, emp_telefone, emp_email, emp_homepage, emp_contato, 
            emp_nfeemail_servidorsmtp, emp_nfeemail_porta, emp_nfeemail_usuario, 
            emp_nfeemail_senha, emp_nfeemail_conexao_segura, emp_nfeemail_mensagem, emp_email_tls, 
            emp_email_conf_leitura            
            )
        values
            %L   `;

const updateEmpresas =
    `   update empresas set
            emp_nome = $2, emp_cnpj = $3, emp_endereco = $4, emp_numero = $5, emp_bairro = $6,
            emp_cidade = $7, emp_estado = $8, emp_cep = $9, emp_complemento = $10, emp_telefone = $11,
            emp_email = $12, emp_homepage = $13, emp_contato = $14,
            emp_nfeemail_servidorsmtp = $15, emp_nfeemail_porta = $16, emp_nfeemail_usuario = $17, 
            emp_nfeemail_senha = $18, emp_nfeemail_conexao_segura = $19, emp_nfeemail_mensagem = $20, 
            emp_email_tls = $21, emp_email_conf_leitura = $22, emp_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            emp_id = $1
    `;

exports.retornarEmpresaApp = function retornarEmpresaApp(package){

    //utilizar no sync e syncFull. 

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
        var params = [];

        if (package.pacotefull){
            var addWhere = ' ';
        }else{
            var addWhere = ' where emp_dt_ultima_atualizacao > $1 ';
            params.push(package.data);            
        }             
  
        console.log('Consultando empresas...');
        ConexaoBanco.query(sqlEmpresasApp+addWhere, params, (error, resultsEmpresa) => {
            
            if (error){
                return reject('Erro ao consultar empresa(s) no banco de dados.');
            }else{  
                const empresa = resultsEmpresa.rows[0];
                return resolve(empresa);
            }
        });
    });
};

exports.getEmpresas = function getEmpresas(){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco = Configuracao.conexao;        

        ConexaoBanco.query(sqlEmpresas, (error, results) => {
        
            if (error){
                return reject(error);
            }else{              
                const empresas = results.rows;
                return resolve(empresas);
            }
        });
    });
};

exports.insert = function insert(objEmpresas){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco  = Configuracao.conexao;
        var paramsEmpresas     = [];

        objEmpresas.forEach(empresa => {
            
            paramsEmpresas.push([
                empresa.emp_id, empresa.emp_nome, empresa.emp_cnpj, empresa.emp_endereco, empresa.emp_numero, 
                empresa.emp_bairro, empresa.emp_cidade, empresa.emp_estado, empresa.emp_cep, empresa.emp_complemento, 
                empresa.emp_telefone, empresa.emp_email, empresa.emp_homepage, empresa.emp_contato,
                empresa.emp_nfeemail_servidorsmtp, empresa.emp_nfeemail_porta, empresa.emp_nfeemail_usuario, 
                empresa.emp_nfeemail_senha, empresa.emp_nfeemail_conexao_segura, empresa.emp_nfeemail_mensagem, 
                empresa.emp_email_tls, empresa.emp_email_conf_leitura
            ]);
        });       

        var sql = format(insertEmpresas, paramsEmpresas);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir empresa(s). '+ error);
                return reject(error);
            }
            else{
                console.log('Empresa(s) inserido com sucesso! Quantidade registros:', results.rowCount);
                var marca = results.rows;
                return resolve(marca);
            }
        });
    });    
};

exports.update = function update(objEmpresas){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    objEmpresas.forEach(element => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateEmpresas, [
                    element.emp_id, element.emp_nome, element.emp_cnpj, element.emp_endereco, element.emp_numero, 
                    element.emp_bairro, element.emp_cidade, element.emp_estado, element.emp_cep, element.emp_complemento, 
                    element.emp_telefone, element.emp_email, element.emp_homepage, element.emp_contato,
                    element.emp_nfeemail_servidorsmtp, element.emp_nfeemail_porta, element.emp_nfeemail_usuario, 
                    element.emp_nfeemail_senha, element.emp_nfeemail_conexao_segura, element.emp_nfeemail_mensagem, 
                    element.emp_email_tls, element.emp_email_conf_leitura
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Empresa(s) atualizado com sucesso!',
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