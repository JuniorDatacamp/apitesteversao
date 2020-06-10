const tipoPagtosModel = require('../models/tipoPagtos');
const funcUtils = require('../utils/funcUtils');

class tipoPagamento {
        
    constructor(body) {

        this.tpg_id                  = body.tpg_id,
        this.tpg_descricao           = body.tpg_descricao,
        this.tpg_pagamento           = body.tpg_pagamento,
        this.tpg_preco               = body.tpg_preco,
        this.tpg_desconto            = body.tpg_desconto,
        this.tpg_tipo                = body.tpg_tipo,
        this.tpg_tipo_frete          = body.tpg_tipo_frete, 
        this.tpg_liberado_cli_novo   = body.tpg_liberado_cli_novo,
        this.tpg_custo_bancario      = body.tpg_custo_bancario,
        this.tpg_parc1               = body.tpg_parc1,
        this.tpg_parc2               = body.tpg_parc2,
        this.tpg_parc3               = body.tpg_parc3,
        this.tpg_parc4               = body.tpg_parc4,
        this.tpg_parc5               = body.tpg_parc5,
        this.tpg_parc6               = body.tpg_parc6,
        this.tpg_parc7               = body.tpg_parc7,
        this.tpg_parc8               = body.tpg_parc8,
        this.tpg_parc9               = body.tpg_parc9,
        this.tpg_parc10              = body.tpg_parc10, 
        this.tpg_parc11              = body.tpg_parc11,
        this.tpg_parc12              = body.tpg_parc12, 
        this.tpg_clp                 = body.tpg_clp,
        this.tpg_ctrl_pagto_cheque   = body.tpg_ctrl_pagto_cheque, 
        this.tpe_id                  = body.tpe_id,
        this.tpe_ind_pag             = body.tpe_ind_pag,
        this.tpe_pagamento           = body.tpe_pagamento,
        this.clf_id                  = body.clf_id,
        this.tip_id                  = body.tip_id,
        this.tpg_tipo_nfe            = body.tpg_tipo_nfe,
        this.tpg_catalogo            = body.tpg_catalogo,
        this.tpg_tef                 = body.tpg_tef,
        this.tpg_integrador_farmacia = body.tpg_integrador_farmacia
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        tipoPagtosModel.getTipoPagtos()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                tiposPagtos: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas Tipo de Pagamento!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayTipoPagto = [];
    
    try {
        req.body.tiposPagtos.forEach(valor => {
            arrayTipoPagto.push(new tipoPagamento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        tipoPagtosModel.insert(arrayTipoPagto)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Tipo de Pagamento inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.tpg_id;

    Promise.all([
        tipoPagtosModel.delete(paramsId)
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

    var arrayTipoPagto = [];
    
    try {
        req.body.tiposPagtos.forEach(valor => {
            arrayTipoPagto.push(new tipoPagamento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesTipoPagto;
    promisesTipoPagto = tipoPagtosModel.update(arrayTipoPagto);

    Promise.all(  
        promisesTipoPagto
    )
    .then(
        (resultados) => {

            console.log('Tipo de Pagamento atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Tipo de Pagamento atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};