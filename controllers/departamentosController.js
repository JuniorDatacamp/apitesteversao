const departamentosModel = require('../models/departamentos');
const funcUtils = require('../utils/funcUtils');

class departamento {
        
    constructor(body) {
            
            this.dep_id             = body.dep_id,
            this.dep_descricao      = body.dep_descricao,
            this.dep_desconto       = body.dep_desconto,
            this.dep_coeficiente    = body.dep_coeficiente,
            this.dep_situacao       = body.dep_situacao;
            this.dep_acesso_api     = body.dep_acesso_api;
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);

    Promise.all([      
        departamentosModel.getDepartamentosFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                departamentos: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );      
};

exports.deletar = function(req, res){

    var paramsDepId = req.query.dep_id;

    Promise.all([      
        departamentosModel.delete(paramsDepId)
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

    var arrayDepto = [];
    
    try {
        req.body.departamentos.forEach(valor => {
            arrayDepto.push(new departamento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }
   
    var promisesDepto;
    promisesDepto = departamentosModel.update(arrayDepto);

    Promise.all(
        promisesDepto
    )
    .then(
        (resultados) => {

            console.log('Departamento(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Departamento(s) atualizado com sucesso!'
            });
        }
    )
    .catch(
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);            
        }
    )
};

exports.inserir = function(req, res){

    var arrayDepto = [];
    
    try {
        req.body.departamentos.forEach(valor => {
            arrayDepto.push(new departamento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        departamentosModel.insert(arrayDepto)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Departamento(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};