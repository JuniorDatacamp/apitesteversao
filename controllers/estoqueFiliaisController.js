const estoqueFiliaisModel = require('../models/estoqueFiliais');
const funcUtils = require('../utils/funcUtils');

class estoqueFiliais {
        
    constructor(body) {
            
        this.estfil_id       = body.estfil_id,
        this.fil_id          = body.fil_id,
        this.pro_referencia  = body.pro_referencia,
        this.estfil_estoque  = body.estfil_estoque
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        estoqueFiliaisModel.getEstoqueFiliais()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                estoqueFiliais: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar o Estoque das Filiais!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayEstoqueFiliais = [];
    
    try {
        req.body.estoqueFiliais.forEach(valor => {
            arrayEstoqueFiliais.push(new estoqueFiliais(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        estoqueFiliaisModel.insert(arrayEstoqueFiliais)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Estoque da Filial inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const filId = req.params.filID;
    const arrayProId = req.query.pro_referencia;

    Promise.all([      
        estoqueFiliaisModel.delete(filId, arrayProId)
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

    var arrayEstoqueFiliais = [];
    
    try {
        req.body.estoqueFiliais.forEach(valor => {
            arrayEstoqueFiliais.push(new estoqueFiliais(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesestoqueFiliais;
    promisesestoqueFiliais = estoqueFiliaisModel.update(arrayEstoqueFiliais);

    Promise.all(  
        promisesestoqueFiliais
    )
    .then(
        (resultados) => {

            console.log('Estoque da Filial atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Estoque da Filial atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};