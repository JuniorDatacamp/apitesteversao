const tiposPedidoModel = require('../models/tiposPedido');
const funcUtils = require('../utils/funcUtils');

class tiposPedido {
        
    constructor(body) {

        this.tpp_id               = body.tpp_id, 
        this.tpp_nome             = body.tpp_nome, 
        this.tpp_gera_financ      = body.tpp_gera_financ, 
        this.tpp_baixa_estoq      = body.tpp_baixa_estoq, 
        this.tpp_tipo             = body.tpp_tipo, 
        this.tpp_vlr_total_zerado = body.tpp_vlr_total_zerado
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        tiposPedidoModel.getTiposPedido()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                tiposPedido: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todos tipos de pedido!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayTiposPedido = [];    
    
    try {
        req.body.tiposPedido.forEach(valor => {
            arrayTiposPedido.push(new tiposPedido(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        tiposPedidoModel.insert(arrayTiposPedido)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Tipo(s) de pedido inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.tpp_id;

    Promise.all([      
        tiposPedidoModel.delete(paramsId)
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

    var arrayTiposPedido = [];
    
    try {
        req.body.tiposPedido.forEach(valor => {
            arrayTiposPedido.push(new tiposPedido(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesTipoPedido;
    promisesTipoPedido = tiposPedidoModel.update(arrayTiposPedido);

    Promise.all(  
        promisesTipoPedido
    )
    .then(
        (resultados) => {

            console.log('Tipo(s) de pedido atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Tipo(s) de pedido atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};