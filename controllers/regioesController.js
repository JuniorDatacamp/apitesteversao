const regioesModel = require('../models/regioes');
const funcUtils = require('../utils/funcUtils');

class regiao {
        
    constructor(body) {

        this.reg_id          = body.reg_id,
        this.reg_nome        = body.reg_nome,
        this.reg_percentual  = body.reg_percentual        
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        regioesModel.getRegioes()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                regioes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas regiões!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayRegioes = [];
    
    try {
        req.body.regioes.forEach(valor => {
            arrayRegioes.push(new regiao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        regioesModel.insert(arrayRegioes)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Regiões inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.reg_id;

    Promise.all([
        regioesModel.delete(paramsId)
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

    var arrayRegioes = [];
    
    try {
        req.body.regioes.forEach(valor => {
            arrayRegioes.push(new regiao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesRegioes;
    promisesRegioes = regioesModel.update(arrayRegioes);

    Promise.all(  
        promisesRegioes
    )
    .then(
        (resultados) => {

            console.log('Regiões atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Regiões atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};