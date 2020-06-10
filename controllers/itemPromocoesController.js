const itemPromocoesModel = require('../models/itemPromocoes');
const funcUtils = require('../utils/funcUtils');

class itemPromocao {
        
    constructor(body) {

        this.ipr_id              = body.ipr_id,
        this.prm_id              = body.prm_id, 
        this.pro_id              = body.pro_id,
        this.ipr_vlr_promocao    = body.ipr_vlr_promocao,
        this.pgr_id              = body.pgr_id
    }
}

exports.pesquisarTodos = function(req, res){
    
    const textParams = funcUtils.getFormatParams(req);
    
    Promise.all([      
        itemPromocoesModel.getItemPromocao(textParams)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                itempromocoes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas item de promoção!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayItemPromocao = [];
    
    try {
        req.body.itempromocoes.forEach(valor => {
            arrayItemPromocao.push(new itemPromocao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        itemPromocoesModel.insert(arrayItemPromocao)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Item de promoção inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.ipr_id;

    Promise.all([      
        itemPromocoesModel.delete(paramsId)
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

    var arrayItemPromocao = [];
    
    try {
        req.body.itempromocoes.forEach(valor => {
            arrayItemPromocao.push(new itemPromocao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesItemPromocao;
    promisesItemPromocao = itemPromocoesModel.update(arrayItemPromocao);

    Promise.all(  
        promisesItemPromocao
    )
    .then(
        (resultados) => {

            console.log('Item de promoção atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Item de promoção atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};