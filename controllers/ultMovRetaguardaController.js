const funcUtils = require('../utils/funcUtils');
const ultMovRetaguarda = require('../models/ultMovRetaguarda');

class sincContador {
        
    constructor(body) {
            
        this.sco_id                    = body.sco_id,
        this.sco_ult_mov_id_bd         = body.sco_ult_mov_id_bd,
        this.sco_dt_ultima_atualizacao = body.sco_dt_ultima_atualizacao
    }
}

exports.pesquisar = function(req, res){

    Promise.all([      
        ultMovRetaguarda.getUltMovRetaguarda()
    ])
    .then(
        (resultados) => {            
           
            res.status(200).json({
                sincContador: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserir = function(req, res){

    var SincContador;
   
    try {
        SincContador = new sincContador(req.body.sincContador);

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        ultMovRetaguarda.insert(SincContador)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Último movimento da retaguarda inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.alterar = function(req, res){

    var SincContador;
    
    try {
        SincContador = new sincContador(req.body.sincContador);

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    ultMovRetaguarda.update(SincContador)
    .then(
        (resultados) => {

            console.log('Último movimento da retaguarda atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Último movimento da retaguarda atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.alterarDatahora = function(req, res){
   
    ultMovRetaguarda.updateDataHora()
    .then(
        (resultados) => {

            console.log('Último sync data/hora movimento da retaguarda atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Último sync data/hora movimento da retaguarda atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};