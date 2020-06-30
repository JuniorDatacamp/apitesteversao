const configuracoesModel = require('../models/configuracoes');
const funcUtils = require('../utils/funcUtils');

class configuracao {
        
    constructor(body) {
            
        this.par_id                          = body.par_id,
        this.par_exp_rec_pda                 = body.par_exp_rec_pda,
        this.par_palm_bloq_restritos         = body.par_palm_bloq_restritos,
        this.par_diasdecarencia              = body.par_diasdecarencia,
        this.par_palm_bloq_sem_estoque       = body.par_palm_bloq_sem_estoque,
        this.par_palm_fabricante             = body.par_palm_fabricante,
        this.par_palm_campos_obrig           = body.par_palm_campos_obrig,
        this.par_palm_multiplo               = body.par_palm_multiplo,
        this.par_palm_controle_saldo_cli     = body.par_palm_controle_saldo_cli,
        this.par_palm_bloq_cli_pf            = body.par_palm_bloq_cli_pf,
        this.par_palm_bloq_pedido_pf         = body.par_palm_bloq_pedido_pf,
        this.par_integracao_pda              = body.par_integracao_pda,
        this.par_orc_outras                  = body.par_orc_outras,        
        this.par_orc_dias_maximo_dt_entrega  = body.par_orc_dias_maximo_dt_entrega,
        this.par_venda_inicio                = body.par_venda_inicio,
        this.par_palm_preco                  = body.par_palm_preco,
        this.par_altera_vlr_unit_app         = body.par_altera_vlr_unit_app
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        configuracoesModel.getConfiguracoesFull()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                configuracoes: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas configurações!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayConfiguracoes = [];
    
    try {
        req.body.configuracoes.forEach(valor => {
            arrayConfiguracoes.push(new configuracao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        configuracoesModel.insert(arrayConfiguracoes)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Configurações inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.alterar = function(req, res){

    var arrayConfiguracoes = [];
      
    try {
        req.body.configuracoes.forEach(valor => {
            arrayConfiguracoes.push(new configuracao(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesConfiguracoes;
    promisesConfiguracoes = configuracoesModel.update(arrayConfiguracoes);

    Promise.all(  
        promisesConfiguracoes
    )
    .then(
        (resultados) => {

            console.log('Configurações atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Configurações atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};