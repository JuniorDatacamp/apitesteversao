const filiaisModel = require('../models/filiais');
const funcUtils = require('../utils/funcUtils');

class filial {
        
    constructor(body) {
            
        this.fil_id       = body.fil_id,
        this.fil_cnpj     = body.fil_cnpj,
        this.fil_nome     = body.fil_nome,
        this.fil_uf       = body.fil_uf,
        this.fil_ie       = body.fil_ie,
        this.mun_cod      = body.mun_cod,
        this.fil_im       = body.fil_im,
        this.fil_suframa  = body.fil_suframa
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        filiaisModel.getFiliais()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                filiais: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas filiais!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayfiliais = [];
    
    try {
        req.body.filiais.forEach(valor => {
            arrayfiliais.push(new filial(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        filiaisModel.insert(arrayfiliais)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Filial inserida com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.fil_id;

    Promise.all([      
        filiaisModel.delete(paramsId)
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

    var arrayfiliais = [];
    
    try {
        req.body.filiais.forEach(valor => {
            arrayfiliais.push(new filial(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesfiliais;
    promisesfiliais = filiaisModel.update(arrayfiliais);

    Promise.all(  
        promisesfiliais
    )
    .then(
        (resultados) => {

            console.log('Filiais atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Filiais atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};