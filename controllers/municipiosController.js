const municipiosModel = require('../models/municipios');
const funcUtils = require('../utils/funcUtils');

class municipio {
        
    constructor(body) {
            
            this.mun_cod      = body.mun_cod,
            this.mun_nome     = body.mun_nome,
            this.mun_cod_uf   = body.mun_cod_uf,
            this.mun_uf       = body.mun_uf
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);

    Promise.all([      
        municipiosModel.getMunicipiosFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                municipios: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );      
};

exports.deletar = function(req, res){

    const paramsId = req.query.mun_cod;

    Promise.all([      
        municipiosModel.delete(paramsId)
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

    var arrayMunicipio = [];
    
    try {
        req.body.municipios.forEach(valor => {
            arrayMunicipio.push(new municipio(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesMunicipio;
    promisesMunicipio = municipiosModel.update(arrayMunicipio);

    Promise.all(  
        promisesMunicipio
    )
    .then(
        (resultados) => {

            console.log('Municipio(s) atualizado com sucesso!');
           
            res.status(200).json({
                mensagem: 'Municipio(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserir = function(req, res){

    var arrayMunicipio = [];
    
    try {
        req.body.municipios.forEach(valor => {
            arrayMunicipio.push(new municipio(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        municipiosModel.insert(arrayMunicipio)
    ])
    .then(
        (resultados) => {

            res.status(200).json({
                mensagem: 'Municipio(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};