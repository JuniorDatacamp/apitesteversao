const funcUtils = require('../utils/funcUtils');
const clientes = require('../models/clientes');
const jwt = require('../controllers/jwtController');

class cliente {
        
    constructor(body) {
            
            this.cli_id                  = body.cli_id,
            this.cli_uuid                = body.cli_uuid,
            this.res_id                  = body.res_id,
            this.esp_id                  = body.esp_id,
            this.pai_cod                 = 1058,
            this.tip_id                  = body.tip_id,
            this.mun_cod                 = body.mun_cod,
            this.vdd_id                  = body.vdd_id,
            this.cli_cgc                 = body.cli_cgc,
            this.cli_cpf                 = body.cli_cpf,
            this.cli_inscricao           = body.cli_inscricao,
            this.cli_datacadastro        = body.cli_datacadastro,
            this.cli_nome                = body.cli_nome,
            this.cli_endereco            = body.cli_endereco,
            this.cli_bairro              = body.cli_bairro,
            this.cli_cep                 = body.cli_cep,
            this.cli_cidade              = body.cli_cidade,
            this.cli_estado              = body.cli_estado,
            this.cli_enderecocobranca    = body.cli_enderecocobranca,
            this.cli_bairrocobranca      = body.cli_bairrocobranca,
            this.cli_cepcobranca         = body.cli_cepcobranca,
            this.cli_cidadecobranca      = body.cli_cidadecobranca,
            this.cli_estadocobranca      = body.cli_estadocobranca,
            this.cli_contato             = body.cli_contato,
            this.cli_telefone            = body.cli_telefone,
            this.cli_celularfax          = body.cli_celularfax,
            this.cli_condicaopagamento   = body.cli_condicaopagamento,
            this.cli_localpagamento      = body.cli_localpagamento,
            this.cli_observacao          = body.cli_observacao,
            this.cli_email               = body.cli_email,
            this.cli_homepage            = body.cli_homepage,
            this.cli_emitiretiqueta      = body.cli_emitiretiqueta,
            this.maxcompras              = body.maxcompras,
            this.cli_foto                = body.cli_foto,
            this.cli_nomefantasia        = body.cli_nomefantasia,
            this.cli_datanascimento      = body.cli_datanascimento,
            this.cli_pai                 = body.cli_pai,
            this.cli_mae                 = body.cli_mae,
            this.cli_telefone1           = body.cli_telefone1,
            this.cli_telefone2           = body.cli_telefone2,
            this.cli_referencia1          = body.cli_referencia1,
            this.cli_referencia2         = body.cli_referencia2,
            this.cli_referencia3         = body.cli_referencia3,
            this.cli_reftel1             = body.cli_reftel1,
            this.cli_reftel2             = body.cli_reftel2,
            this.cli_reftel3             = body.cli_reftel3,
            this.cli_tipopes             = body.cli_tipopes,
            this.cli_codigo              = body.cli_codigo,
            this.cli_ativo               = body.cli_ativo,
            this.cli_datacompra          = body.cli_datacompra,
            this.cli_datapagto           = body.cli_datapagto,
            this.cli_descmax             = body.cli_descmax,
            this.cli_local_trabalho      = body.cli_local_trabalho,
            this.cli_conjuge             = body.cli_conjuge,
            this.cli_documento           = body.cli_documento,
            this.oex_codigo              = body.oex_codigo,
            this.tdc_codigo              = body.tdc_codigo,
            this.cli_ufdocto             = body.cli_ufdocto,
            this.cli_contrato_medical    = body.cli_contrato_medical,
            this.cli_vlr_consulta_medical = body.cli_vlr_consulta_medical,
            this.cli_numfunc_medical      = body.cli_numfunc_medical,
            this.cli_cnae                 = body.cli_cnae,
            this.cli_telcontato           = body.cli_telcontato,
            this.cli_msn                 = body.cli_msn,
            this.cli_proprietario        = body.cli_proprietario,
            this.cli_numero              = body.cli_numero,
            this.cli_complemento         = body.cli_complemento,
            this.cli_diascontato         = body.cli_diascontato,
            this.cli_credito             = body.cli_credito,
            this.cli_integracao_vendas   = body.cli_integracao_vendas,
            this.cli_id_palm             = body.cli_id_palm,
            this.cli_inscricao_mun       = body.cli_inscricao_mun,
            this.cli_suframa             = body.cli_suframa,
            this.cli_dias_padrao_venda   = body.cli_dias_padrao_venda,
            this.cli_rg                  = body.cli_rg,
            this.cli_sexo                = body.cli_sexo,
            this.tpg_id                  = body.tpg_id,
            this.cli_afe_codigo          = body.cli_afe_codigo,
            this.cli_afe_dtvalidade      = body.cli_afe_dtvalidade,
            this.cli_ae_codigo           = body.cli_ae_codigo,
            this.cli_ae_dtvalidade       = body.cli_ae_dtvalidade,
            this.cli_sus_codigo          = body.cli_sus_codigo,
            this.cli_sus_dtvalidade      = body.cli_sus_dtvalidade,
            this.dt_atualizacao          = body.dt_atualizacao,
            this.cli_tipo_estab          = body.cli_tipo_estab,
            this.cli_fazenda_nome        = body.cli_fazenda_nome,
            this.cli_fazenda_ie          = body.cli_fazenda_ie,
            this.cli_fazenda_local       = body.cli_fazenda_local,
            this.cli_fazenda_mun_cod     = body.cli_fazenda_mun_cod,
            this.cli_banco_tipo_conta    = body.cli_banco_tipo_conta,
            this.cli_banco_nome          = body.cli_banco_nome,
            this.cli_banco_numero        = body.cli_banco_numero,
            this.cli_banco_agencia       = body.cli_banco_agencia,
            this.cli_banco_conta         = body.cli_banco_conta,
            this.cli_profissao           = body.cli_profissao,
            this.cli_renda               = body.cli_renda,
            this.cli_subst_trib_iss     = body.cli_subst_trib_iss,
            this.cli_rntrc               = body.cli_rntrc,
            this.cli_banco_operacao      = body.cli_banco_operacao,
            this.cli_dt_serasa           = body.cli_dt_serasa,
            this.cli_dt_primeira_compra  = body.cli_dt_primeira_compra,
            this.cli_vlr_primeira_compra = body.cli_vlr_primeira_compra,
            this.cli_vlr_ult_compra      = body.cli_vlr_ult_compra,
            this.cli_data_alt_situacao   = body.cli_data_alt_situacao,
            this.cli_dt_spc              = body.cli_dt_spc,
            this.set_id                  = body.set_id,
            this.cli_banco_cidade        = body.cli_banco_cidade,
            this.cli_banco_conjunta      = body.cli_banco_conjunta,
            this.cli_banco_titular_sec   = body.cli_banco_titular_sec,
            this.cli_tipo_consumidor     = body.cli_tipo_consumidor,
            this.cli_end_com_telefone    = body.cli_end_com_telefone,
            this.cli_cnh                 = body.cli_cnh,
            this.cli_dt_emissao_rg       = body.cli_dt_emissao_rg,
            this.cli_naturalidade        = body.cli_naturalidade,
            this.cli_nat_uf              = body.cli_nat_uf,
            this.cli_nacionalidade       = body.cli_nacionalidade,
            this.cli_estado_civil        = body.cli_estado_civil,
            this.cli_num_dependentes     = body.cli_num_dependentes,
            this.cli_grau_instrucao      = body.cli_grau_instrucao,
            this.cli_categoria           = body.cli_categoria,
            this.cli_tempo_residencia    = body.cli_tempo_residencia,
            this.cli_tipo_resid          = body.cli_tipo_resid,
            this.cli_valor_prest_aluguel = body.cli_valor_prest_aluguel,
            this.cli_end_anterior        = body.cli_end_anterior,
            this.cli_end_ant_num         = body.cli_end_ant_num,
            this.cli_end_ant_bairro      = body.cli_end_ant_bairro,
            this.cli_end_ant_compl       = body.cli_end_ant_compl,
            this.cli_end_ant_cidade      = body.cli_end_ant_cidade,
            this.cli_end_ant_cod_mun     = body.cli_end_ant_cod_mun,
            this.cli_end_ant_cep         = body.cli_end_ant_cep,
            this.cli_end_ant_uf          = body.cli_end_ant_uf,
            this.cli_end_comercial       = body.cli_end_comercial,
            this.cli_end_com_num         = body.cli_end_com_num,
            this.cli_end_com_bairro      = body.cli_end_com_bairro,
            this.cli_end_com_compl       = body.cli_end_com_compl,
            this.cli_end_com_cidade      = body.cli_end_com_cidade,
            this.cli_end_com_cod_mun     = body.cli_end_com_cod_mun,
            this.cli_end_com_cep         = body.cli_end_com_cep,
            this.cli_end_com_uf          = body.cli_end_com_uf,
            this.cli_end_com_email       = body.cli_end_com_email,
            this.cli_end_com_site        = body.cli_end_com_site,
            this.cli_com_cnpj            = body.cli_com_cnpj,
            this.cli_com_atividade       = body.cli_com_atividade,
            this.cli_com_site_prof       = body.cli_com_site_prof,
            this.cli_com_cargo           = body.cli_com_cargo,
            this.cli_com_dt_admissao     = body.cli_com_dt_admissao,
            this.cli_com_outras_rendas   = body.cli_com_outras_rendas,
            this.cli_com_fone_contador   = body.cli_com_fone_contador,
            this.cli_com_phone_rh        = body.cli_com_phone_rh,
            this.cli_conjuge_nome        = body.cli_conjuge_nome,
            this.cli_conjuge_sexo        = body.cli_conjuge_sexo,
            this.cli_conjuge_cpf         = body.cli_conjuge_cpf,
            this.cli_conjuge_rg          = body.cli_conjuge_rg,
            this.cli_conjuge_dt_nasc     = body.cli_conjuge_dt_nasc,
            this.cli_conjuge_naturalidade    = body.cli_conjuge_naturalidade,
            this.cli_conjuge_nacionalidade   = body.cli_conjuge_nacionalidade,
            this.cli_conjuge_uf              = body.cli_conjuge_uf,
            this.cli_conjuge_emp             = body.cli_conjuge_emp,
            this.cli_conjuge_fone            = body.cli_conjuge_fone,
            this.cli_conjuge_profissao       = body.cli_conjuge_profissao,
            this.cli_conjuge_tempo_serv      = body.cli_conjuge_tempo_serv,
            this.cli_conjuge_cargo           = body.cli_conjuge_cargo,
            this.cli_conjuge_salario         = body.cli_conjuge_salario,
            this.cli_conjuge_email           = body.cli_conjuge_email,
            this.mun_cod_rota                = body.mun_cod_rota,
            this.cli_estrangeiro             = body.cli_estrangeiro,
            this.cli_doc_estrangeiro         = body.cli_doc_estrangeiro
    }
}

exports.pesquisarTodosApp = function(req, res){
    
    const tipoToken = jwt.getTipoToken();
    const token     = req.headers['x-access-token'];
    
    const objFullPackage = {
        codVendedor : (jwt.getToken(res, token, tipoToken.app).iss),
        pacotefull : true,
        data : req.params.ultimasincronizacao
    };
 
    Promise.all([      
        clientes.retornarClientesApp(objFullPackage)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                clientes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao pesquisar todos clientes!! [ ${erro} ]`});
        }
    );
};

exports.alterarApp = function(req, res){

    try {
        var objCliente = new cliente(req.body.clientes);        

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    Promise.all([      
        clientes.alterarApp(objCliente)
    ])
    .then(
        (resultados) => {            
           
            res.status(200).json({
                clientes: resultados[0]
            });
        },
        (erro) => {
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserirApp = function(req, res){

    try {
        var objCliente = new cliente(req.body.clientes);        

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    clientes.clienteDuplicado(objCliente.cli_cpf, objCliente.cli_cgc).then(
        (result) =>{
           
            clientes.insertApp(objCliente).then(
                (resultados) => {

                    res.status(200).json({
                        clientes: resultados
                    });
                },
                (erro) => {
                    console.log(erro);
                    funcUtils.getMensagemErros(erro, res);
                }
            );
        },
        (error) =>{
            //tratamento se retorno cliente duplicado e adicionar outros erros.
            if (error.clienteExistente > 0){
                res.status(409).json({
                    registroduplicado: 'Cliente já existente na base de dados!'
                });
            }else{
                console.log(error);
                funcUtils.getMensagemErros(error, res);
            }
        }
    )
};

exports.pesquisarTodos = function(req, res){
    
    const textParams = funcUtils.getFormatParams(req);

    Promise.all([      
        clientes.getClientesFormat(textParams)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                clientes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao pesquisar todos clientes!! [ ${erro} ]`});
        }
    );
};

exports.alterarCompleto = function(req, res){

    var arrayCliente = [];
    
    try {
        req.body.clientes.forEach(valor => {
            arrayCliente.push(new cliente(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesCliente;
    promisesCliente = clientes.updateCompleto(arrayCliente);

    Promise.all(  
        promisesCliente
    )
    .then(
        (resultados) => {

            console.log('Cliente(s) atualizado com sucesso!');
           
            res.status(200).json({
                mensagem: 'Cliente(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserirCompleto = function(req, res){

    var arrayCliente = [];
    
    try {
        req.body.clientes.forEach(valor => {
            arrayCliente.push(new cliente(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([      
        // clientes.clienteDuplicado(oCliente.cli_cpf, oCliente.cli_cgc),
        clientes.insertCompleto(arrayCliente)
    ])
    .then(
        (resultados) => {            
            
            res.status(200).json({
                clientes: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);    
            funcUtils.getMensagemErros(erro, res);
        }
    );  
};

exports.delete = function(req, res){

    var paramsId = req.query.cli_uuid;

    Promise.all([
        clientes.delete(paramsId)
    ])
    .then(
        (resultados) => {
 
            console.log(resultados[0]);            
            
            res.status(200).json(
                resultados[0]
            );
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.documentosExistentes = function(req, res){
    
    Promise.all([
        clientes.documentosExistentes()
    ])
    .then(
        (resultados) => {
           
            res.status(200).json(
                resultados[0]
            );
        },
        (erro) => {
            console.log('Falha ao pesquisar documentos existentes!', erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};