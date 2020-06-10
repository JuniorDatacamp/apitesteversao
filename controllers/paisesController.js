const paisesModel = require('../models/paises');
const funcUtils = require('../utils/funcUtils');

class pais {
        
    constructor(body) {
            
        this.pai_cod    = body.pai_cod,
        this.pai_nome   = body.pai_nome
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        paisesModel.getPaises()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                paises: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todos países!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayPaises = [];
    
    try {
        req.body.paises.forEach(valor => {
            arrayPaises.push(new pais(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        paisesModel.insert(arrayPaises)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Países inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.pai_cod;

    Promise.all([      
        paisesModel.delete(paramsId)
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

    var arrayPaises = [];
    
    try {
        req.body.paises.forEach(valor => {
            arrayPaises.push(new pais(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesPaises;
    promisesPaises = paisesModel.update(arrayPaises);

    Promise.all(  
        promisesPaises
    )
    .then(
        (resultados) => {

            console.log('Países atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Países atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};