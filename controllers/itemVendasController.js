const itemVendasModel = require('../models/itemVendas');
const funcUtils = require('../utils/funcUtils');

class itemVenda {
        
    constructor(body) {

        this.itv_uuid               = body.itv_uuid,
        this.itv_id                 = body.itv_id,
        this.ven_uuid               = body.ven_uuid,
        this.ven_data               = body.ven_data,
        this.pro_id                 = body.pro_id,
        this.itv_refer              = body.itv_refer,
        this.itv_qtde               = body.itv_qtde,
        this.itv_desconto           = body.itv_desconto,
        this.itv_precovenda         = body.itv_precovenda,
        this.itv_valortotal         = body.itv_valortotal,
        this.itv_data               = body.itv_data,
        this.itv_situacao           = body.itv_situacao,
        this.itv_comissao           = body.itv_comissao,
        this.pro_custoreal          = body.pro_custoreal,
        this.pro_custo              = body.pro_custo,
        this.itv_num_item           = body.itv_num_item,
        this.itv_un                 = body.itv_un,
        this.itv_tipo               = body.itv_tipo,
        this.itv_observacao         = body.itv_observacao,
        this.itv_descricao          = body.itv_descricao,
        this.itv_vlrmedio           = body.itv_vlrmedio,
        this.itv_trocado            = body.itv_trocado,
        this.itd_id                 = body.itd_id,
        this.itv_vlr_rateio_desc    = body.itv_vlr_rateio_desc,
        this.mrc_id                 = body.mrc_id,
        this.itv_num_pneu           = body.itv_num_pneu,
        this.tir_id                 = body.tir_id,
        this.itv_promocao           = body.itv_promocao,
        this.pro_composicao_if      = body.pro_composicao_if,
        this.pro_composicao_st      = body.pro_composicao_st,
        this.pro_composicao_ipi     = body.pro_composicao_ipi,
        this.pro_composicao_frete   = body.pro_composicao_frete,
        this.pro_composicao_lucro   = body.pro_composicao_lucro,
        this.pro_composicao_perc    = body.pro_composicao_perc,
        this.pro_composicao_venda   = body.pro_composicao_venda,
        this.pro_composicao_despfixas     = body.pro_composicao_despfixas,
        this.pro_composicao_com_vend      = body.pro_composicao_com_vend,
        this.pro_composicao_com_entrega   = body.pro_composicao_com_entrega,
        this.pro_composicao_custo         = body.pro_composicao_custo,
        this.itv_vlrfrete                 = body.itv_vlrfrete,
        this.itv_data_inclusao            = body.itv_data_inclusao,
        this.itv_vlr_descarga             = body.itv_vlr_descarga,
        this.vdd_id                       = body.vdd_id
    }
}

exports.itemVenda = function(objItemVenda){
    
    return new itemVenda(objItemVenda)    
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        itemVendasModel.getItemVenda()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                itemvendas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas item venda!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayItemVenda = [];
    
    try {
        req.body.itemvendas.forEach(valor => {
            arrayItemVenda.push(new itemVenda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        itemVendasModel.insert(arrayItemVenda)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                itemvendas: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.itv_uuid;

    Promise.all([      
        itemVendasModel.delete(paramsId)
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

    var arrayItemVenda = [];
    
    try {
        req.body.itemvendas.forEach(valor => {
            arrayItemVenda.push(new itemVenda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesItemVenda;
    promisesItemVenda = itemVendasModel.update(arrayItemVenda);

    Promise.all(  
        promisesItemVenda
    )
    .then(
        (resultados) => {

            console.log('Item venda atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Item venda atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};