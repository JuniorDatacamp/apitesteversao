const restricoesModel = require('../models/restricoes');
const funcUtils = require('../utils/funcUtils');

class restricao {
        
    constructor(body) {
       
        this.res_id             = body.res_id,
        this.res_descricao      = body.res_descricao,
        this.res_figura         = body.res_figura,
        this.res_situacao       = body.res_situacao,
        this.res_senha          = body.res_senha,
        this.res_bloq_debitos   = body.res_bloq_debitos
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        restricoesModel.getRestricoes()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                restricoes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas restrições!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayRestricoes = [];
    
    try {
        req.body.restricoes.forEach(valor => {
            arrayRestricoes.push(new restricao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        restricoesModel.insert(arrayRestricoes)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Restrições inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.res_id;

    Promise.all([      
        restricoesModel.delete(paramsId)
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

    var arrayRestricoes = [];
    
    try {
        req.body.restricoes.forEach(valor => {
            arrayRestricoes.push(new restricao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesRestricoes;
    promisesRestricoes = restricoesModel.update(arrayRestricoes);

    Promise.all(  
        promisesRestricoes
    )
    .then(
        (resultados) => {

            console.log('Restrições atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Restrições atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};