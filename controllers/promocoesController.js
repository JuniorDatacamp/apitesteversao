const promocaoModel = require('../models/promocoes');
const funcUtils = require('../utils/funcUtils');

class promocao {
        
    constructor(body) {

        this.prm_id              = body.prm_id, 
        this.prm_descricao       = body.prm_descricao,
        this.prm_dt_lancamento   = body.prm_dt_lancamento, 
        this.prm_dt_inicial      = body.prm_dt_inicial, 
        this.prm_dt_final        = body.prm_dt_final
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);    
    
    Promise.all([      
        promocaoModel.getPromocao(textParams)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                promocoes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas promoções!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayPromocao = [];
    
    try {
        req.body.promocoes.forEach(valor => {
            arrayPromocao.push(new promocao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        promocaoModel.insert(arrayPromocao)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Promoções inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.prm_id;

    Promise.all([      
        promocaoModel.delete(paramsId)
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

    var arrayPromocao = [];
    
    try {
        req.body.promocoes.forEach(valor => {
            arrayPromocao.push(new promocao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesPromises;
    promisesPromises = promocaoModel.update(arrayPromocao);

    Promise.all(  
        promisesPromises
    )
    .then(
        (resultados) => {

            console.log('Promoções atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Promoções atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};