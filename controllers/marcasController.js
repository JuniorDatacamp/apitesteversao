const marcasModel = require('../models/marcas');
const funcUtils = require('../utils/funcUtils');

class marca {
        
    constructor(body) {
            
        this.mrc_id             = body.mrc_id,
        this.mrc_descricao      = body.mrc_descricao
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        marcasModel.getMarcas()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                marcas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas marcas!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayMarca = [];
    
    try {
        req.body.marcas.forEach(valor => {
            arrayMarca.push(new marca(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        marcasModel.insert(arrayMarca)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Marca(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.mrc_id;

    Promise.all([      
        marcasModel.delete(paramsId)
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

    var arrayMarca = [];
    
    try {
        req.body.marcas.forEach(valor => {
            arrayMarca.push(new marca(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesMarca;
    promisesMarca = marcasModel.update(arrayMarca);

    Promise.all(  
        promisesMarca
    )
    .then(
        (resultados) => {

            console.log('Marca(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Marca(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};