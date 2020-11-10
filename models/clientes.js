const Configuracao = require('../config/database');
var varDataAtual = new Date();
const format = require('pg-format');
const recebersModel = require('../models/recebers');
const vendasModel = require('../models/vendas');
const tiposPagtosClienteModel = require('../models/tiposPagtosClientes');

const sqlClienteApp = 
    ` select
        c.cli_id, c.cli_uuid, cli_ativo, c.vdd_id, cli_nomefantasia, cli_nome,
        cli_endereco, cli_bairro, cli_numero,
        mun_cod, cli_cidade, cli_estado, cli_cep, cli_telefone, cli_email, cli_tipopes,
        cli_cgc, cli_cpf, cli_inscricao, cli_inscricao_mun, cli_contato,  cli_telcontato,
        cli_enderecocobranca, cli_bairrocobranca, mun_cod as cidade_cobranca,
        cli_cepcobranca, cli_numero as numero_cobranca,
        cli_cidadecobranca, cli_estadocobranca, cli_observacao,
        c.res_id, r.res_descricao, r.res_situacao, res_bloq_debitos,
        c.esp_id, esp_descricao, esp_finan,
        cli_datacadastro, maxcompras,
        case
            when (cast(now() as date) - cast(cli_datacadastro as date) <= 7) then '#006EAD'
            when r.res_situacao = 'S' then '#D00303'
        else
            '#000000'
        end as corlegenda
        %s
    from
        CLIENTES c	        
    left join
        RESTRICOES r on c.res_id = r.RES_ID
    left join
        ESPECIALIDADE e on c.ESP_ID = e.ESP_ID  
    where
        (cast(c.vdd_id as varchar(10)) ilike $1) `;

const insertClientesCompleto =
    `   INSERT INTO clientes(
           cli_id, res_id, esp_id, pai_cod, tip_id, mun_cod, vdd_id, cli_cgc, cli_cpf, cli_inscricao, cli_datacadastro,
           cli_nome, cli_endereco, cli_bairro, cli_cep, cli_cidade, cli_estado, cli_enderecocobranca, cli_bairrocobranca,
           cli_cepcobranca, cli_cidadecobranca, cli_estadocobranca, cli_contato, cli_telefone, cli_celularfax, cli_condicaopagamento,
           cli_localpagamento, cli_observacao, cli_email, cli_homepage, cli_emitiretiqueta, maxcompras, cli_foto, cli_nomefantasia,
           cli_datanascimento, cli_pai, cli_mae, cli_telefone1, cli_telefone2, cli_referencia1, cli_referencia2, cli_referencia3,
           cli_reftel1, cli_reftel2, cli_reftel3, cli_tipopes, cli_codigo, cli_ativo, cli_datacompra, cli_datapagto, cli_descmax,
           cli_local_trabalho, cli_conjuge, cli_documento, oex_codigo, tdc_codigo, cli_ufdocto, cli_contrato_medical,
           cli_vlr_consulta_medical, cli_numfunc_medical, cli_cnae, cli_telcontato, cli_msn, cli_proprietario, cli_numero,
           cli_complemento, cli_diascontato, cli_credito, cli_integracao_vendas, cli_id_palm, cli_inscricao_mun, cli_suframa,
           cli_dias_padrao_venda, cli_rg, cli_sexo, tpg_id, cli_afe_codigo, cli_afe_dtvalidade, cli_ae_codigo, cli_ae_dtvalidade,
           cli_sus_codigo, cli_sus_dtvalidade, dt_atualizacao, cli_tipo_estab, cli_fazenda_nome, cli_fazenda_ie, cli_fazenda_local,
           cli_fazenda_mun_cod, cli_banco_tipo_conta, cli_banco_nome, cli_banco_numero, cli_banco_agencia, cli_banco_conta,
           cli_profissao, cli_renda, cli_subst_trib_iss, cli_rntrc, cli_banco_operacao, cli_dt_serasa, cli_dt_primeira_compra,
           cli_vlr_primeira_compra, cli_vlr_ult_compra, cli_data_alt_situacao, cli_dt_spc, set_id, cli_banco_cidade, cli_banco_conjunta,
           cli_banco_titular_sec, cli_tipo_consumidor, cli_end_com_telefone, cli_cnh, cli_dt_emissao_rg, cli_naturalidade, cli_nat_uf,
           cli_nacionalidade, cli_estado_civil, cli_num_dependentes, cli_grau_instrucao, cli_categoria, cli_tempo_residencia,
           cli_tipo_resid, cli_valor_prest_aluguel, cli_end_anterior, cli_end_ant_num, cli_end_ant_bairro, cli_end_ant_compl,
           cli_end_ant_cidade, cli_end_ant_cod_mun, cli_end_ant_cep, cli_end_ant_uf, cli_end_comercial, cli_end_com_num, cli_end_com_bairro,
           cli_end_com_compl, cli_end_com_cidade, cli_end_com_cod_mun, cli_end_com_cep, cli_end_com_uf, cli_end_com_email, cli_end_com_site,
           cli_com_cnpj, cli_com_atividade, cli_com_site_prof, cli_com_cargo, cli_com_dt_admissao, cli_com_outras_rendas, cli_com_fone_contador,
           cli_com_phone_rh, cli_conjuge_nome, cli_conjuge_sexo, cli_conjuge_cpf, cli_conjuge_rg, cli_conjuge_dt_nasc, cli_conjuge_naturalidade,
           cli_conjuge_nacionalidade, cli_conjuge_uf, cli_conjuge_emp, cli_conjuge_fone, cli_conjuge_profissao, cli_conjuge_tempo_serv,
           cli_conjuge_cargo, cli_conjuge_salario, cli_conjuge_email, mun_cod_rota, cli_estrangeiro, cli_doc_estrangeiro)
       VALUES
           %L  RETURNING cli_uuid, cli_id ; `;

const insertClientesApp =
    ` INSERT INTO clientes(
       pai_cod, vdd_id, cli_nomefantasia, cli_nome, cli_endereco, cli_bairro,
       mun_cod, cli_cep, cli_telefone, cli_email, cli_tipopes,
       cli_cgc, cli_cpf, cli_inscricao, cli_inscricao_mun, cli_contato,
       cli_telcontato, cli_enderecocobranca, cli_bairrocobranca,
       cli_cepcobranca, cli_numero, cli_datacadastro, cli_cidade,
       cli_estado, cli_cidadecobranca, cli_estadocobranca, cli_observacao)
     VALUES
       ( 
       1058, $1, $2, $3, $4, $5,
       $6, $7, $8, $9, $10,
       $11, $12, $13, $14, $15,
       $16, $17, $18,
       $19, $20, $21, $22,
       $23, $24, $25, $26
       ) RETURNING cli_uuid, cli_id ; `

const updateClientesApp =
    `   update clientes set
           vdd_id = $1, cli_nomefantasia = $2, cli_nome = $3, cli_endereco = $4,
           cli_bairro = $5, mun_cod = $6, cli_cep = $7, cli_telefone = $8,
           cli_email = $9, cli_tipopes = $10, cli_cgc = $11, cli_cpf = $12, cli_inscricao = $13,
           cli_inscricao_mun = $14, cli_contato = $15, cli_telcontato = $16,
           cli_enderecocobranca = $17, cli_bairrocobranca = $18, cli_cepcobranca = $19,
           cli_numero = $20, cli_datacadastro = $21, cli_cidade = $22, cli_estado = $23,
           cli_cidadecobranca = $24, cli_estadocobranca = $25, cli_observacao = $26, 
           cli_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
       where
           cli_uuid = $27 `;

const updateClientesCompleto =
    `   update clientes set
            vdd_id = $2, res_id = $3, esp_id = $4, cli_cgc = $5, cli_cpf = $6, cli_inscricao = $7, 
            cli_datacadastro = $8, cli_nome = $9, cli_endereco = $10, cli_bairro = $11, cli_cep = $12, cli_cidade = $13, 
            cli_estado = $14, cli_enderecocobranca = $15, cli_bairrocobranca = $16, cli_cepcobranca = $17,
            cli_cidadecobranca = $18, cli_estadocobranca = $19, cli_contato = $20, cli_telefone = $21, 
            cli_celularfax = $22, cli_condicaopagamento = $23, cli_localpagamento = $24, cli_observacao = $25, 
            cli_email = $26, cli_homepage = $27, cli_emitiretiqueta = $28, maxcompras = $29, cli_foto = $30,
            cli_nomefantasia = $31, cli_datanascimento = $32, cli_pai = $33, cli_mae = $34, cli_telefone1 = $35,
            cli_telefone2 = $36, cli_referencia1 = $37, cli_referencia2 = $38, cli_referencia3 = $39, 
            cli_reftel1 = $40, cli_reftel2 = $41, cli_reftel3 = $42, cli_tipopes = $43, cli_ativo = $44, 
            cli_datacompra = $45, cli_datapagto = $46, cli_descmax = $47, cli_local_trabalho = $48, cli_conjuge = $49,
            cli_documento = $50, oex_codigo = $51, tdc_codigo = $52, cli_ufdocto = $53, cli_contrato_medical = $54,
            cli_vlr_consulta_medical = $55, cli_numfunc_medical = $56, cli_cnae = $57, cli_telcontato = $58, 
            cli_msn = $59, cli_proprietario = $60, mun_cod = $61, cli_numero = $62, cli_complemento = $63, 
            cli_diascontato = $64, cli_credito = $65, cli_id_palm = $66, cli_inscricao_mun = $67, pai_cod = $68,
            cli_suframa = $69, cli_dias_padrao_venda = $70, cli_rg = $71, cli_sexo = $72, tpg_id = $73, tip_id = $74,
            cli_afe_codigo = $75, cli_afe_dtvalidade = $76, cli_ae_codigo = $77, cli_ae_dtvalidade = $78, 
            cli_sus_codigo = $79, cli_sus_dtvalidade = $80, dt_atualizacao = $81, cli_tipo_estab = $82, 
            cli_fazenda_nome = $83, cli_fazenda_ie = $84, cli_fazenda_local = $85, cli_fazenda_mun_cod = $86,
            cli_banco_tipo_conta = $87, cli_banco_nome = $88, cli_banco_numero = $89, cli_banco_agencia = $90,
            cli_banco_conta = $91, cli_profissao = $92, cli_renda = $93, cli_subst_trib_iss = $94, cli_rntrc = $95,
            cli_banco_operacao = $96, cli_integracao_vendas = $97, cli_dt_serasa = $98, cli_dt_primeira_compra = $99,
            cli_vlr_primeira_compra = $100, cli_vlr_ult_compra = $101, cli_data_alt_situacao = $102, cli_dt_spc = $103,
            set_id = $104, cli_banco_cidade = $105, cli_banco_conjunta = $106, cli_banco_titular_sec = $107,
            cli_tipo_consumidor = $108, cli_end_com_telefone = $109, cli_cnh = $110, cli_dt_emissao_rg = $111,
            cli_naturalidade = $112, cli_nat_uf = $113, cli_nacionalidade = $114, cli_estado_civil = $115, 
            cli_num_dependentes = $116, cli_grau_instrucao = $117, cli_categoria = $118, cli_tempo_residencia = $119,
            cli_tipo_resid = $120, cli_valor_prest_aluguel = $121, cli_end_anterior = $122, cli_end_ant_num = $123,
            cli_end_ant_bairro = $124, cli_end_ant_compl = $125, cli_end_ant_cidade = $126, cli_end_ant_cod_mun = $127,
            cli_end_ant_cep = $128, cli_end_ant_uf = $129, cli_end_comercial = $130, cli_end_com_num = $131,
            cli_end_com_bairro = $132, cli_end_com_compl = $133, cli_end_com_cidade = $134, cli_end_com_cod_mun = $135,
            cli_end_com_cep = $136, cli_end_com_uf = $137, cli_end_com_email = $138, cli_end_com_site = $139, 
            cli_com_cnpj = $140, cli_com_atividade = $141, cli_com_site_prof = $142, cli_com_cargo = $143, 
            cli_com_dt_admissao = $144, cli_com_outras_rendas = $145, cli_com_fone_contador = $146, 
            cli_com_phone_rh = $147, cli_conjuge_nome = $148, cli_conjuge_sexo = $149, cli_conjuge_cpf = $150,
            cli_conjuge_rg = $151, cli_conjuge_dt_nasc = $152, cli_conjuge_naturalidade = $153, 
            cli_conjuge_nacionalidade = $154, cli_conjuge_uf = $155, cli_conjuge_emp = $156, cli_conjuge_fone = $157,
            cli_conjuge_profissao = $158, cli_conjuge_tempo_serv = $159, cli_conjuge_cargo = $160, 
            cli_conjuge_salario = $161, cli_conjuge_email = $162, mun_cod_rota = $163, cli_estrangeiro = $164,
            cli_doc_estrangeiro = $165, cli_id = $166, cli_dt_ultima_atualizacao = now() AT TIME ZONE 'America/Sao_Paulo'
        where
            cli_uuid = $1
    `;

const sqlClienteDuplicado =
    ' select count(*) as qtde_registro from clientes where cli_cpf = $1 ';

const sqlClienteDuplicadoCNPJ =
    ' select count(*) as qtde_registro from clientes where cli_cgc = $1 ';

const sqlDeleteCliente =
    `   WITH retorno AS 
            (DELETE FROM clientes WHERE cli_uuid in (%s) RETURNING cli_uuid, 'clientes', now() AT TIME ZONE 'America/Sao_Paulo')
        INSERT INTO 
            ocorrencias (oco_id_tabela, oco_tabela, oco_dt_ultima_atualizacao) SELECT * FROM retorno; `;

const sqlClienteCompleto = 
    `   select * from clientes `;

const sqlOrderby =
    ' order by cli_nomefantasia ';

const sqlGroupBy =
    `   group by
            c.cli_id, c.cli_uuid, cli_ativo, c.vdd_id, cli_nomefantasia, cli_nome, cli_endereco, cli_bairro, 
            cli_numero, mun_cod, cli_cidade, cli_estado, cli_cep, cli_telefone, cli_email, cli_tipopes,
            cli_cgc, cli_cpf, cli_inscricao, cli_inscricao_mun, cli_contato,  cli_telcontato,
            cli_enderecocobranca, cli_bairrocobranca, mun_cod, cli_cepcobranca, cli_numero,
            cli_cidadecobranca, cli_estadocobranca, cli_observacao, c.res_id, r.res_descricao, 
            r.res_situacao, res_bloq_debitos, c.esp_id, esp_descricao, esp_finan, cli_datacadastro, maxcompras `;

const sqlDocumentosExistentes =
    `   select 
            case
                when cli_tipopes = 'J' then cli_cgc
                else
                    cli_cpf
            end as cnpjcpf, vdd_id as codVendedor
        from
            clientes
        where
            (cli_cpf is not null) or (cli_cgc is not null)
        order by
            vdd_id
    `;

function formatSqlSyncronizacaoApp (package){

    // ** Função para retornar sql de acordo com syncfull ou sync para o aplicativo. **

    // ** Pedido do Renê ** - Coluna para o aplicativo saber se é um cliente novo.
    const colunaClienteNovo = 
        `    ,case
                when (%L <= cli_dt_inclusao) then true
            else false			
                end as cli_novo
        `;
    
    var params = [];
    var selectClientes = '';

    (package.vinculoClientesVendedor) ? params.push(package.codVendedor) : params.push('%');

    if (package.pacotefull){        
        selectClientes  = format(sqlClienteApp, '') + ` and cli_ativo = 'A' `;
    }else{
        const addColunaCliente  = format(colunaClienteNovo, package.data);
        
        selectClientes          = format(sqlClienteApp, addColunaCliente) + `
            and cli_uuid in (
                select cli_uuid from vw_atualizacao_clientes where dt_ultima_atualizacao > $2 group by cli_uuid
            )  or (cli_dt_ultima_atualizacao > $2 )
        `;

        params.push(package.data);
    };

    return {sql: selectClientes, parametros: params};
}

exports.clienteDuplicado = function clienteDuplicado(cpf, cnpj){ 

    var sql, params;

    if (!cnpj){
        sql = sqlClienteDuplicado;
        params = cpf;
    }else{
        sql = sqlClienteDuplicadoCNPJ;
        params = cnpj;
    }
    
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {
    
        //Verificando se existe o cliente com cnpj ou cpf cadastrado na base de dados.
        ConexaoBanco.query(sql, [params], (error, results) => {

            if (results.rows[0].qtde_registro > 0){
                return reject({clienteExistente: results.rows[0].qtde_registro});
            }else{
                return resolve({clienteExistente: results.rows[0].qtde_registro});
            }
        });
    });
};

exports.retornarClientesApp = function retornarClientesApp(package){    
    
    const ret            = formatSqlSyncronizacaoApp(package);
    const sqlClientes    = ret.sql;
    const paramsClientes = ret.parametros;
   
    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;
        var objRetornoClientes = [];

        console.log('Consultando clientes...');
        ConexaoBanco.query(sqlClientes+sqlOrderby, paramsClientes, (error, resultsClientes) => {
           
            if (error){
                return reject('Erro ao consultar cliente no banco de dados. ' + error);
            };

            if (resultsClientes.rows.length == 0) {
                //Não existe atualização dos dados.
                resolve([]);
            };

            Promise.all([
                recebersModel.getReceberApp(package),
                vendasModel.getVendasApp(package),
                tiposPagtosClienteModel.getTiposPagtosClienteApp(package)
            ])
            .then(
                (resultados) => {
                
                    var clientes = resultsClientes.rows;
                    var recebers = resultados[0];
                    var vendas = resultados[1];
                    var tiposPagtosCliente = resultados[2];
               
                    clientes.forEach(function (iClientes, indice, arrayClientes) {

                        if ((iClientes.res_situacao == 'N') && (iClientes.res_bloq_debitos == 'S')){
                            
                            const receberDoCliente = recebers.filter(function(obj) {                                    
                                return obj.cli_uuid === iClientes.cli_uuid;
                            });

                            const existeDocumentoAberto = receberDoCliente.filter((documento) => {
                                return documento.baixado === null;
                            });

                            if (existeDocumentoAberto.length > 0){
                                iClientes.corlegenda = "#0F8318";

                                receberDoCliente.forEach(function (itemReceber, indiceReceber, arrayReceber) {

                                    var dataAtual     = new Date(varDataAtual.getFullYear(), varDataAtual.getMonth(), varDataAtual.getDate());
                                    var dataDocumento = new Date(arrayReceber[indiceReceber].datavencimento);
            
                                    //Verificando se o cliente está bloqueado e retorna a corlegenda = "#D00303".
                                    if (dataAtual > dataDocumento && iClientes.res_bloq_debitos == 'S'){
                                        iClientes.corlegenda = "#D00303";
                                    }
                                });
                            };
                        };

                        //Filtrar receber e adicionar no objeto clientes.
                        iClientes.recebers = recebers.filter(function(obj) {
                            
                            if (obj.cli_uuid === iClientes.cli_uuid){                                                                        
                                return delete obj.cli_uuid, delete obj.cli_id;
                            }                                
                        });

                        iClientes.vendas = vendas.filter(function(obj) {

                            if (obj.cli_uuid === iClientes.cli_uuid){                                                                        
                                return delete obj.cli_uuid, delete obj.cli_id;
                            } 
                        });

                        iClientes.tipospagtoscliente = tiposPagtosCliente.filter(function(obj) {

                            if (obj.cli_uuid === iClientes.cli_uuid){                                                                        
                                return delete obj.cli_uuid, delete obj.cli_id;
                            } 
                        });

                        objRetornoClientes.push(iClientes);
                    });

                    if (clientes.length != 0 || recebers.length != 0 || vendas.length != 0 || tiposPagtosCliente.length != 0){
                        resolve(objRetornoClientes);
                    }else{
                        //Não existe atualização dos dados.
                        resolve([]);                            
                    }
                },
                (erro) => {                        
                    console.log(erro);
                    reject(erro);
                }
            );
        })            
    });
};

exports.alterarApp = function(cliente){
  
    const oCliente = cliente;
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {

        ConexaoBanco.query(updateClientesApp, [
            oCliente.vdd_id, oCliente.cli_nomefantasia, oCliente.cli_nome, oCliente.cli_endereco,
            oCliente.cli_bairro, oCliente.mun_cod, oCliente.cli_cep, oCliente.cli_telefone,
            oCliente.cli_email, oCliente.cli_tipopes, oCliente.cli_cgc, oCliente.cli_cpf, oCliente.cli_inscricao,
            oCliente.cli_inscricao_mun, oCliente.cli_contato, oCliente.cli_telcontato,
            oCliente.cli_enderecocobranca, oCliente.cli_bairrocobranca, oCliente.cli_cepcobranca,
            oCliente.cli_numero, oCliente.cli_datacadastro, oCliente.cli_cidade, oCliente.cli_estado,
            oCliente.cli_cidadecobranca, oCliente.cli_estadocobranca, oCliente.cli_observacao, oCliente.cli_uuid
        ], function(error, results){
            
            if(error){
                return reject(error);
            }else
                return resolve({
                    mensagem: 'Cliente atualizado com sucesso!',
                    registros: results.rowCount
                });
        });
    });
};

exports.getClientesFormat = function(parametro){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;

        ConexaoBanco.query(sqlClienteCompleto+parametro+' order by cli_nome', function(error, results){
            if(error){
                return reject(error);
            }
            else{
                const cliente = results.rows;
                return resolve(cliente);
            }
        });
    });
};

exports.updateCompleto = function(objCliente){

    const ConexaoBanco = Configuracao.conexao;

    ConexaoBanco.query('begin', (error, results) => {
    });

    var arrayPromise = [];

    objCliente.forEach(oCliente => {

        arrayPromise.push(
            new Promise((resolve, reject) => {

                ConexaoBanco.query(updateClientesCompleto, [
                    oCliente.cli_uuid, oCliente.vdd_id, oCliente.res_id, oCliente.esp_id, oCliente.cli_cgc, oCliente.cli_cpf, oCliente.cli_inscricao, 
                    oCliente.cli_datacadastro, oCliente.cli_nome, oCliente.cli_endereco, oCliente.cli_bairro, oCliente.cli_cep, 
                    oCliente.cli_cidade, oCliente.cli_estado, oCliente.cli_enderecocobranca, oCliente.cli_bairrocobranca, 
                    oCliente.cli_cepcobranca, oCliente.cli_cidadecobranca, oCliente.cli_estadocobranca, oCliente.cli_contato, 
                    oCliente.cli_telefone, oCliente.cli_celularfax, oCliente.cli_condicaopagamento, oCliente.cli_localpagamento, 
                    oCliente.cli_observacao, oCliente.cli_email, oCliente.cli_homepage, oCliente.cli_emitiretiqueta, 
                    oCliente.maxcompras, oCliente.cli_foto, oCliente.cli_nomefantasia, oCliente.cli_datanascimento, oCliente.cli_pai, 
                    oCliente.cli_mae, oCliente.cli_telefone1, oCliente.cli_telefone2, oCliente.cli_referencia1, oCliente.cli_referencia2, 
                    oCliente.cli_referencia3, oCliente.cli_reftel1, oCliente.cli_reftel2, oCliente.cli_reftel3, oCliente.cli_tipopes, 
                    oCliente.cli_ativo, oCliente.cli_datacompra, oCliente.cli_datapagto, oCliente.cli_descmax, 
                    oCliente.cli_local_trabalho, oCliente.cli_conjuge, oCliente.cli_documento, oCliente.oex_codigo, oCliente.tdc_codigo, 
                    oCliente.cli_ufdocto, oCliente.cli_contrato_medical, oCliente.cli_vlr_consulta_medical, oCliente.cli_numfunc_medical, 
                    oCliente.cli_cnae, oCliente.cli_telcontato, oCliente.cli_msn, oCliente.cli_proprietario, oCliente.mun_cod, 
                    oCliente.cli_numero, oCliente.cli_complemento, oCliente.cli_diascontato, oCliente.cli_credito, oCliente.cli_id_palm, 
                    oCliente.cli_inscricao_mun, oCliente.pai_cod, oCliente.cli_suframa, oCliente.cli_dias_padrao_venda, oCliente.cli_rg, 
                    oCliente.cli_sexo, oCliente.tpg_id, oCliente.tip_id, oCliente.cli_afe_codigo, oCliente.cli_afe_dtvalidade, 
                    oCliente.cli_ae_codigo, oCliente.cli_ae_dtvalidade, oCliente.cli_sus_codigo, oCliente.cli_sus_dtvalidade, 
                    oCliente.dt_atualizacao, oCliente.cli_tipo_estab, oCliente.cli_fazenda_nome, oCliente.cli_fazenda_ie, 
                    oCliente.cli_fazenda_local, oCliente.cli_fazenda_mun_cod, oCliente.cli_banco_tipo_conta, oCliente.cli_banco_nome, 
                    oCliente.cli_banco_numero, oCliente.cli_banco_agencia, oCliente.cli_banco_conta, oCliente.cli_profissao, 
                    oCliente.cli_renda, oCliente.cli_subst_trib_iss, oCliente.cli_rntrc, oCliente.cli_banco_operacao, 
                    oCliente.cli_integracao_vendas, oCliente.cli_dt_serasa, oCliente.cli_dt_primeira_compra, oCliente.cli_vlr_primeira_compra, 
                    oCliente.cli_vlr_ult_compra, oCliente.cli_data_alt_situacao, oCliente.cli_dt_spc, oCliente.set_id, 
                    oCliente.cli_banco_cidade, oCliente.cli_banco_conjunta, oCliente.cli_banco_titular_sec, oCliente.cli_tipo_consumidor, 
                    oCliente.cli_end_com_telefone, oCliente.cli_cnh, oCliente.cli_dt_emissao_rg, oCliente.cli_naturalidade, 
                    oCliente.cli_nat_uf, oCliente.cli_nacionalidade, oCliente.cli_estado_civil, oCliente.cli_num_dependentes, 
                    oCliente.cli_grau_instrucao, oCliente.cli_categoria, oCliente.cli_tempo_residencia, oCliente.cli_tipo_resid, 
                    oCliente.cli_valor_prest_aluguel, oCliente.cli_end_anterior, oCliente.cli_end_ant_num, oCliente.cli_end_ant_bairro, 
                    oCliente.cli_end_ant_compl, oCliente.cli_end_ant_cidade, oCliente.cli_end_ant_cod_mun, oCliente.cli_end_ant_cep, 
                    oCliente.cli_end_ant_uf, oCliente.cli_end_comercial, oCliente.cli_end_com_num, oCliente.cli_end_com_bairro, 
                    oCliente.cli_end_com_compl, oCliente.cli_end_com_cidade, oCliente.cli_end_com_cod_mun, oCliente.cli_end_com_cep, 
                    oCliente.cli_end_com_uf, oCliente.cli_end_com_email, oCliente.cli_end_com_site, oCliente.cli_com_cnpj, 
                    oCliente.cli_com_atividade, oCliente.cli_com_site_prof, oCliente.cli_com_cargo, oCliente.cli_com_dt_admissao, 
                    oCliente.cli_com_outras_rendas, oCliente.cli_com_fone_contador, oCliente.cli_com_phone_rh, oCliente.cli_conjuge_nome, 
                    oCliente.cli_conjuge_sexo, oCliente.cli_conjuge_cpf, oCliente.cli_conjuge_rg, oCliente.cli_conjuge_dt_nasc, 
                    oCliente.cli_conjuge_naturalidade, oCliente.cli_conjuge_nacionalidade, oCliente.cli_conjuge_uf, oCliente.cli_conjuge_emp, 
                    oCliente.cli_conjuge_fone, oCliente.cli_conjuge_profissao, oCliente.cli_conjuge_tempo_serv, oCliente.cli_conjuge_cargo, 
                    oCliente.cli_conjuge_salario, oCliente.cli_conjuge_email, oCliente.mun_cod_rota, oCliente.cli_estrangeiro,
                    oCliente.cli_doc_estrangeiro, oCliente.cli_id
                ], (error, results) => {
                    
                    if(error){
                        return reject(error);
                    }else
                        return resolve({
                            mensagem: 'Cliente(s) atualizado com sucesso!',
                            registros: results.rowCount
                        });
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

exports.insertCompleto = function (objCliente){

    /* Retorna o cli_uuid e cli_id do cliente logo apos inserir no banco de dados. */ 

    return new Promise((resolve, reject) => {
        
        const ConexaoBanco           = Configuracao.conexao;
        var paramsCliente            = [];

        objCliente.forEach(oCliente => {
            
            paramsCliente.push([
                oCliente.cli_id, oCliente.res_id, oCliente.esp_id, oCliente.pai_cod, oCliente.tip_id, 
                oCliente.mun_cod, oCliente.vdd_id, oCliente.cli_cgc, oCliente.cli_cpf, oCliente.cli_inscricao, oCliente.cli_datacadastro,
                oCliente.cli_nome, oCliente.cli_endereco, oCliente.cli_bairro, oCliente.cli_cep, oCliente.cli_cidade, oCliente.cli_estado, 
                oCliente.cli_enderecocobranca, oCliente.cli_bairrocobranca, oCliente.cli_cepcobranca, oCliente.cli_cidadecobranca, 
                oCliente.cli_estadocobranca, oCliente.cli_contato, oCliente.cli_telefone, 
                oCliente.cli_celularfax, oCliente.cli_condicaopagamento, oCliente.cli_localpagamento, oCliente.cli_observacao, oCliente.cli_email, 
                oCliente.cli_homepage, oCliente.cli_emitiretiqueta, oCliente.maxcompras, oCliente.cli_foto, oCliente.cli_nomefantasia,
                oCliente.cli_datanascimento, oCliente.cli_pai, oCliente.cli_mae, oCliente.cli_telefone1, oCliente.cli_telefone2, oCliente.cli_referencia, 
                oCliente.cli_referencia2, oCliente.cli_referencia3, oCliente.cli_reftel1, oCliente.cli_reftel2, oCliente.cli_reftel3, oCliente.cli_tipopes, 
                oCliente.cli_codigo, oCliente.cli_ativo, oCliente.cli_datacompra, oCliente.cli_datapagto, oCliente.cli_descmax, oCliente.cli_local_trabalho, 
                oCliente.cli_conjuge, oCliente.cli_documento, oCliente.oex_codigo, oCliente.tdc_codigo, oCliente.cli_ufdocto, oCliente.cli_contrato_medical,
                oCliente.cli_vlr_consulta_medical, oCliente.cli_numfunc_medical, oCliente.cli_cnae, oCliente.cli_telcontato, oCliente.cli_msn, 
                oCliente.cli_proprietario, oCliente.cli_numero, oCliente.cli_complemento, oCliente.cli_diascontato, oCliente.cli_credito, 
                oCliente.cli_integracao_vendas, oCliente.cli_id_palm, oCliente.cli_inscricao_mun, oCliente.cli_suframa,            
                oCliente.cli_dias_padrao_venda, oCliente.cli_rg, oCliente.cli_sexo, oCliente.tpg_id, oCliente.cli_afe_codigo, 
                oCliente.cli_afe_dtvalidade, oCliente.cli_ae_codigo, oCliente.cli_ae_dtvalidade, oCliente.cli_sus_codigo, oCliente.cli_sus_dtvalidade, 
                oCliente.dt_atualizacao, oCliente.cli_tipo_estab, oCliente.cli_fazenda_nome, oCliente.cli_fazenda_ie, oCliente.cli_fazenda_local,
                oCliente.cli_fazenda_mun_cod, oCliente.cli_banco_tipo_conta, oCliente.cli_banco_nome, oCliente.cli_banco_numero, 
                oCliente.cli_banco_agencia, oCliente.cli_banco_conta, oCliente.cli_profissao, oCliente.cli_renda, oCliente.cli_subst_trib_iss, 
                oCliente.cli_rntrc, oCliente.cli_banco_operacao, oCliente.cli_dt_serasa, oCliente.cli_dt_primeira_compra, 
                oCliente.cli_vlr_primeira_compra, oCliente.cli_vlr_ult_compra, oCliente.cli_data_alt_situacao, oCliente.cli_dt_spc, 
                oCliente.set_id, oCliente.cli_banco_cidade, oCliente.cli_banco_conjunta, oCliente.cli_banco_titular_sec, 
                oCliente.cli_tipo_consumidor, oCliente.cli_end_com_telefone, oCliente.cli_cnh, oCliente.cli_dt_emissao_rg, 
                oCliente.cli_naturalidade, oCliente.cli_nat_uf, oCliente.cli_nacionalidade, oCliente.cli_estado_civil, 
                oCliente.cli_num_dependentes, oCliente.cli_grau_instrucao, oCliente.cli_categoria, oCliente.cli_tempo_residencia, 
                oCliente.cli_tipo_resid, oCliente.cli_valor_prest_aluguel, oCliente.cli_end_anterior, oCliente.cli_end_ant_num, 
                oCliente.cli_end_ant_bairro, oCliente.cli_end_ant_compl, oCliente.cli_end_ant_cidade, oCliente.cli_end_ant_cod_mun, 
                oCliente.cli_end_ant_cep, oCliente.cli_end_ant_uf, oCliente.cli_end_comercial, oCliente.cli_end_com_num, 
                oCliente.cli_end_com_bairro, oCliente.cli_end_com_compl, oCliente.cli_end_com_cidade, oCliente.cli_end_com_cod_mun, 
                oCliente.cli_end_com_cep, oCliente.cli_end_com_uf, oCliente.cli_end_com_email, oCliente.cli_end_com_site, oCliente.cli_com_cnpj, 
                oCliente.cli_com_atividade, oCliente.cli_com_site_prof, oCliente.cli_com_cargo, oCliente.cli_com_dt_admissao, 
                oCliente.cli_com_outras_rendas, oCliente.cli_com_fone_contador, oCliente.cli_com_phone_rh, oCliente.cli_conjuge_nome, 
                oCliente.cli_conjuge_sexo, oCliente.cli_conjuge_cpf, oCliente.cli_conjuge_rg, oCliente.cli_conjuge_dt_nasc, 
                oCliente.cli_conjuge_naturalidade, oCliente.cli_conjuge_nacionalidade, oCliente.cli_conjuge_uf, oCliente.cli_conjuge_emp, 
                oCliente.cli_conjuge_fone, oCliente.cli_conjuge_profissao, oCliente.cli_conjuge_tempo_serv, oCliente.cli_conjuge_cargo, 
                oCliente.cli_conjuge_salario, oCliente.cli_conjuge_email, oCliente.mun_cod_rota, oCliente.cli_estrangeiro, 
                oCliente.cli_doc_estrangeiro
            ]);
        });       

        var sqlInsertPronto = format(insertClientesCompleto, paramsCliente);

        ConexaoBanco.query(sqlInsertPronto, (error, results) => {
            
            if (error){
                return reject(error);
            }
            else{
                var resultCliente = results.rows;
                return resolve(resultCliente);
            }
        });
    });        
};

exports.insertApp = function (cliente){

    /* Retorna o cli_uuid e cli_id do cliente logo apos inserir no banco de dados. */ 

    const oCliente = cliente;
    const ConexaoBanco = Configuracao.conexao;

    return new Promise((resolve, reject) => {

        console.log('Gravando cliente do aplicativo...', 'vendedor: ', oCliente.vdd_id, cliente);
    
        ConexaoBanco.query(insertClientesApp, [
            oCliente.vdd_id, oCliente.cli_nomefantasia, oCliente.cli_nome, oCliente.cli_endereco, oCliente.cli_bairro, 
            oCliente.mun_cod, oCliente.cli_cep, oCliente.cli_telefone, oCliente.cli_email, oCliente.cli_tipopes, 
            oCliente.cli_cgc, oCliente.cli_cpf, oCliente.cli_inscricao, oCliente.cli_inscricao_mun, oCliente.cli_contato, 
            oCliente.cli_telcontato, oCliente.cli_enderecocobranca, oCliente.cli_bairrocobranca,  
            oCliente.cli_cepcobranca, oCliente.cli_numero, oCliente.cli_datacadastro, oCliente.cli_cidade, 
            oCliente.cli_estado, oCliente.cli_cidadecobranca, oCliente.cli_estadocobranca, oCliente.cli_observacao
        ], (error, results) => {
            
            if (error){
                return reject(error);
            }
            else{
                var resultCliente = {cli_uuid: results.rows[0].cli_uuid};
                return resolve(resultCliente);
            }
        });
    });
};

exports.delete = function (idCliente){

    const ConexaoBanco = Configuracao.conexao;
    const sqlDelCliente = format(sqlDeleteCliente, idCliente);

    return new Promise((resolve, reject) => {
    
        ConexaoBanco.query(sqlDelCliente, (error, results) => {
            
            if(error){
                return reject(error);
            }
            else{
                return resolve({
                    mensagem: 'Delete cliente(s) efetuado com sucesso.',
                    registros: results.rowCount
                });
            }
        });
    });
};

exports.documentosExistentes = function (package){

    if (package.pacotefull & package.vinculoClientesVendedor) {
    
        const ConexaoBanco = Configuracao.conexao;    

        return new Promise((resolve, reject) => {
        
            ConexaoBanco.query(sqlDocumentosExistentes, (error, results) => {
                
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(results.rows);
                }
            });
        });
    }
};