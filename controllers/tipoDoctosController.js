const tipoDoctosModel = require('../models/tipoDoctos');
const funcUtils = require('../utils/funcUtils');

class tipoDocumento {
        
    constructor(body) {

        this.tip_id                  = body.tip_id, 
        this.tip_descricao           = body.tip_descricao, 
        this.tip_indicador_de_titulo = body.tip_indicador_de_titulo                
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        tipoDoctosModel.getTipoDocto()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                tiposDoctos: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas tipo documento!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayTipoDoctos = [];
    
    try {
        req.body.tiposDoctos.forEach(valor => {
            arrayTipoDoctos.push(new tipoDocumento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        tipoDoctosModel.insert(arrayTipoDoctos)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Tipos Documentos inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){
  
    const paramsId = req.query.tip_id;

    Promise.all([      
        tipoDoctosModel.delete(paramsId)
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

    var arrayTipoDoctos = [];
    
    try {
        req.body.tiposDoctos.forEach(valor => {
            arrayTipoDoctos.push(new tipoDocumento(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesTipoDoctos;
    promisesTipoDoctos = tipoDoctosModel.update(arrayTipoDoctos);

    Promise.all(  
        promisesTipoDoctos
    )
    .then(
        (resultados) => {

            console.log('Tipos Documentos atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Tipos Documentos atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};