const Configuracao = require('../config/database');
const format = require('pg-format');

const sqlVendedorApp = 
    `   select
    	    vdd_id, vdd_nome, vdd_telefone,	vdd_email,
    	    'Vendedor' as cargo, vdd_perc_desc_max, vdd_max_pedidos
       from
    	    vendedor `;

const sqlVendedor = 
    `   select
            vdd_id, vdd_nome, vdd_comissao, vdd_senha, vdd_rua, vdd_bairro, vdd_cidade, 
            vdd_telefone, vdd_ativo, vdd_palm, vdd_ultimo_cli_id_palm, vdd_ultimo_ped_id, 
            vdd_usuario_datasus, vdd_senha_datasus, vdd_senha_palm, vdd_perc_desc_max, 
            vdd_cpf, vdd_rg, vdd_dt_nasc, vdd_banco_numero, vdd_banco_agencia, 
            vdd_banco_operacao, vdd_banco_conta, vdd_banco_nome, vdd_banco_tipo_conta, 
            vdd_observacoes, vdd_numero, vdd_complemento, vdd_cep, vdd_estado, 
            vdd_telefone2, vdd_telefone3, vdd_fax, reg_id, vdd_email, vdd_max_pedidos, 
            vdd_entra_rel_carga, vdd_comissao_tx1
        from 
            vendedor
    `;

const sqlOrderby =
    ' order by vdd_nome';

const insertVendedor =
    `   insert into vendedor 
            (vdd_id, vdd_nome, vdd_comissao, vdd_senha, vdd_rua, vdd_bairro, vdd_cidade, 
            vdd_telefone, vdd_ativo, vdd_palm, vdd_ultimo_cli_id_palm, vdd_ultimo_ped_id, 
            vdd_usuario_datasus, vdd_senha_datasus, vdd_senha_palm, vdd_perc_desc_max, 
            vdd_cpf, vdd_rg, vdd_dt_nasc, vdd_banco_numero, vdd_banco_agencia, 
            vdd_banco_operacao, vdd_banco_conta, vdd_banco_nome, vdd_banco_tipo_conta, 
            vdd_observacoes, vdd_numero, vdd_complemento, vdd_cep, vdd_estado, 
            vdd_telefone2, vdd_telefone3, vdd_fax, reg_id, vdd_email, vdd_max_pedidos, 
            vdd_entra_rel_carga, vdd_comissao_tx1)
        values 
            %L `;

const deleteVendedor =
    `   WITH retorno AS
            (DELETE FROM vendedor WHERE vdd_id in (%s) RETURNING vdd_id, 'vendedores', now())
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `

const updateVendedor =
    `   update vendedor 
            set vdd_nome = $2, vdd_comissao = $3, vdd_senha = $4, vdd_rua = $5, vdd_bairro = $6, vdd_cidade = $7,
            vdd_telefone = $8, vdd_ativo = $9, vdd_palm = $10, vdd_ultimo_cli_id_palm = $11, vdd_ultimo_ped_id = $12,
            vdd_usuario_datasus = $13, vdd_senha_datasus = $14, vdd_senha_palm = $15, vdd_perc_desc_max = $16,
            vdd_cpf = $17, vdd_rg = $18, vdd_dt_nasc = $19, vdd_banco_numero = $20, vdd_banco_agencia = $21,
            vdd_banco_operacao = $22, vdd_banco_conta = $23, vdd_banco_nome = $24, vdd_banco_tipo_conta = $25,
            vdd_observacoes = $26, vdd_numero = $27, vdd_complemento = $28, vdd_cep = $29, vdd_estado = $30,
            vdd_telefone2 = $31, vdd_telefone3 = $32, vdd_fax = $33, reg_id = $34, vdd_email = $35, vdd_max_pedidos = $36,
            vdd_entra_rel_carga = $37, vdd_comissao_tx1 = $38, vdd_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            vdd_id = $1 `;

//utilizando na chamada de rota de sincronização(sync)
exports.retornarVendedorApp = function retornarVendedorApp(packageSync){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
        var params = [];
        const dadosVendedor = packageSync.codVendedor;
        
        if (packageSync.pacotefull){
            var addWhere = ' where vdd_id = $1';
            params.push(dadosVendedor);
        }else{
            var addWhere = ' where vdd_id = $1 and vdd_dt_ultima_atualizacao > $2 ';
            params.push(dadosVendedor, packageSync.data);
        }

        console.log('Consultando vendedor...');
        ConexaoBanco.query(sqlVendedorApp+addWhere, params, (error, results) => {

            if (error){
                return reject('Erro ao consultar vendedor no banco de dados.');
            }else{            
                const vendedor = results.rows[0];        
                return resolve(vendedor);
            }
        });
    });
};

//utilizando na chamada de rota de login.
exports.loginVendedor = function loginVendedor(dadosVendedor){

    /*Verifica o login e retorna o vendedor como Promise. Utilizar este método se deseja receber o retorno da consulta.*/ 

    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {
  
        ConexaoBanco.query(sqlVendedorApp +' where vdd_id = $1 and vdd_senha_palm = $2', [
            dadosVendedor.codVendedor, dadosVendedor.senhaVendedor
        ], (error, results) => {

            const vendedor = results.rows[0];

            if (results.rowCount == 0){
                return reject(401.007);              
            }else{
                return resolve(vendedor);
            }
        });
    });
};

exports.getVendedoresFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlVendedor+parametro+sqlOrderby, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const vendedor = results.rows;
                return resolve(vendedor);
            }
        });
    });    
};

exports.insert = function (objVendedor){

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco     = Configuracao.conexao;
        var paramsVendedores   = [];

        objVendedor.forEach(vendedor => {
            
            paramsVendedores.push([
                vendedor.vdd_id, vendedor.vdd_nome, vendedor.vdd_comissao, vendedor.vdd_senha, vendedor.vdd_rua, 
                vendedor.vdd_bairro, vendedor.vdd_cidade, vendedor.vdd_telefone, vendedor.vdd_ativo, 
                vendedor.vdd_palm, vendedor.vdd_ultimo_cli_id_palm, vendedor.vdd_ultimo_ped_id, vendedor.vdd_usuario_datasus, 
                vendedor.vdd_senha_datasus, vendedor.vdd_senha_palm, vendedor.vdd_perc_desc_max, vendedor.vdd_cpf, 
                vendedor.vdd_rg, vendedor.vdd_dt_nasc, vendedor.vdd_banco_numero, vendedor.vdd_banco_agencia, 
                vendedor.vdd_banco_operacao, vendedor.vdd_banco_conta, vendedor.vdd_banco_nome, vendedor.vdd_banco_tipo_conta, 
                vendedor.vdd_observacoes, vendedor.vdd_numero, vendedor.vdd_complemento, vendedor.vdd_cep, vendedor.vdd_estado, 
                vendedor.vdd_telefone2, vendedor.vdd_telefone3, vendedor.vdd_fax, vendedor.reg_id, vendedor.vdd_email, 
                vendedor.vdd_max_pedidos, vendedor.vdd_entra_rel_carga, vendedor.vdd_comissao_tx1
            ]);
        });       

        var sql = format(insertVendedor, paramsVendedores);
       
        ConexaoBanco.query(sql, (error, results) => {
            
            if (error){
                console.log('Erro ao inserir vendedor. '+ error);
                return reject(error);
            }
            else{
                console.log('Vendedor inserido com sucesso! Quantidade registros:', results.rowCount);
                var resultCliente = results.rows;
                return resolve(resultCliente);
            }
        });
    });

};

exports.delete = function(idVendedor){

    const sqlDeleteVendedor = format(deleteVendedor, idVendedor);
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlDeleteVendedor, function(error, results){
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete vendedor efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });    
};

exports.update = function(objVendedor){
    
    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (errorBegin, resultsBegin) => {
    });

    var arrayPromise = [];

    objVendedor.forEach(vendedor => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateVendedor, [
                    vendedor.vdd_id, vendedor.vdd_nome, vendedor.vdd_comissao, vendedor.vdd_senha, vendedor.vdd_rua, 
                    vendedor.vdd_bairro, vendedor.vdd_cidade, vendedor.vdd_telefone, vendedor.vdd_ativo, 
                    vendedor.vdd_palm, vendedor.vdd_ultimo_cli_id_palm, vendedor.vdd_ultimo_ped_id, vendedor.vdd_usuario_datasus, 
                    vendedor.vdd_senha_datasus, vendedor.vdd_senha_palm, vendedor.vdd_perc_desc_max, vendedor.vdd_cpf, 
                    vendedor.vdd_rg, vendedor.vdd_dt_nasc, vendedor.vdd_banco_numero, vendedor.vdd_banco_agencia, 
                    vendedor.vdd_banco_operacao, vendedor.vdd_banco_conta, vendedor.vdd_banco_nome, vendedor.vdd_banco_tipo_conta, 
                    vendedor.vdd_observacoes, vendedor.vdd_numero, vendedor.vdd_complemento, vendedor.vdd_cep, vendedor.vdd_estado, 
                    vendedor.vdd_telefone2, vendedor.vdd_telefone3, vendedor.vdd_fax, vendedor.reg_id, vendedor.vdd_email, 
                    vendedor.vdd_max_pedidos, vendedor.vdd_entra_rel_carga, vendedor.vdd_comissao_tx1
                ], (error, results) => {

                    if (error){
                        return reject(error);
                    }else{
                        return resolve({
                            mensagem: 'Vendedor atualizado com sucesso!',
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