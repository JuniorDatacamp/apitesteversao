const tiposPagtosClienteModel = require('../models/tiposPagtosClientes');
const funcUtils = require('../utils/funcUtils');

class tipoPagamentoCliente {
        
    constructor(body) {

        this.tpc_id    = body.tpc_id,
        this.tpg_id    = body.tpg_id,
        this.cli_id    = body.cli_id,
        this.cli_uuid  = body.cli_uuid        
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req); 

    Promise.all([      
        tiposPagtosClienteModel.getTiposPagtosClienteFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                tiposPagtosCliente: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserir = function(req, res){

    var arrayTiposPagtosCliente = [];
    
    try {
        req.body.tiposPagtosCliente.forEach(valor => {
            arrayTiposPagtosCliente.push(new tipoPagamentoCliente(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        tiposPagtosClienteModel.insert(arrayTiposPagtosCliente)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Tipos de pagamento do Cliente inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.tpc_id;

    Promise.all([      
        tiposPagtosClienteModel.delete(paramsId)
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

    var arrayTiposPagtosCliente = [];
    
    try {
        req.body.tiposPagtosCliente.forEach(valor => {
            arrayTiposPagtosCliente.push(new tipoPagamentoCliente(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesTiposPagtosCliente;
    promisesTiposPagtosCliente = tiposPagtosClienteModel.update(arrayTiposPagtosCliente);

    Promise.all(  
        promisesTiposPagtosCliente
    )
    .then(
        (resultados) => {

            console.log('Tipos de pagamento do Cliente atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Tipos de pagamento do Cliente atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};