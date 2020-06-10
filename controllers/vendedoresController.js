const vendedoresModel = require('../models/vendedores');
const funcUtils = require('../utils/funcUtils');

class vendedor {
        
    constructor(body) {
            
        this.vdd_id                  = body.vdd_id,
        this.vdd_nome                = body.vdd_nome,
        this.vdd_comissao            = body.vdd_comissao,
        this.vdd_senha               = body.vdd_senha, 
        this.vdd_rua                 = body.vdd_rua,
        this.vdd_bairro              = body.vdd_bairro,
        this.vdd_cidade              = body.vdd_cidade,
        this.vdd_telefone            = body.vdd_telefone,
        this.vdd_ativo               = body.vdd_ativo,
        this.vdd_palm                = body.vdd_palm,
        this.vdd_ultimo_cli_id_palm  = body.vdd_ultimo_cli_id_palm,
        this.vdd_ultimo_ped_id       = body.vdd_ultimo_ped_id,
        this.vdd_usuario_datasus     = body.vdd_usuario_datasus,
        this.vdd_senha_datasus       = body.vdd_senha_datasus,
        this.vdd_senha_palm          = body.vdd_senha_palm,
        this.vdd_perc_desc_max       = body.vdd_perc_desc_max,
        this.vdd_cpf                 = body.vdd_cpf,
        this.vdd_rg                  = body.vdd_rg,
        this.vdd_dt_nasc             = body.vdd_dt_nasc,
        this.vdd_banco_numero        = body.vdd_banco_numero,
        this.vdd_banco_agencia       = body.vdd_banco_agencia,
        this.vdd_banco_operacao      = body.vdd_banco_operacao,
        this.vdd_banco_conta         = body.vdd_banco_conta,
        this.vdd_banco_nome          = body.vdd_banco_nome,
        this.vdd_banco_tipo_conta    = body.vdd_banco_tipo_conta,
        this.vdd_observacoes         = body.vdd_observacoes,
        this.vdd_numero              = body.vdd_numero,
        this.vdd_complemento         = body.vdd_complemento,
        this.vdd_cep                 = body.vdd_cep,
        this.vdd_estado              = body.vdd_estado,
        this.vdd_telefone2           = body.vdd_telefone2,
        this.vdd_telefone3           = body.vdd_telefone3,
        this.vdd_fax                 = body.vdd_fax,
        this.reg_id                  = body.reg_id,
        this.vdd_email               = body.vdd_email,
        this.vdd_max_pedidos         = body.vdd_max_pedidos,
        this.vdd_entra_rel_carga     = body.vdd_entra_rel_carga,
        this.vdd_comissao_tx1        = body.vdd_comissao_tx1
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);    

    Promise.all([
        vendedoresModel.getVendedoresFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                vendedores: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );      
};

exports.inserir = function(req, res){

    var arrayVendedor = [];
    
    try {
        req.body.vendedores.forEach(valor => {
            arrayVendedor.push(new vendedor(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        vendedoresModel.insert(arrayVendedor)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Vendedor inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.vdd_id;

    Promise.all([      
        vendedoresModel.delete(paramsId)
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

exports.alterar = function(req, res){

    var arrayVendedor = [];
    
    try {
        req.body.vendedores.forEach(valor => {
            arrayVendedor.push(new vendedor(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesVendedor;
    promisesVendedor = vendedoresModel.update(arrayVendedor);

    Promise.all(  
        promisesVendedor
    )
    .then(
        (resultados) => {

            console.log('Vendedor atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Vendedor atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};