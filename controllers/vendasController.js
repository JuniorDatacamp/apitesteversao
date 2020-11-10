const vendasModel = require('../models/vendas');
const emails = require('../email/enviarEmail');
const jwt = require('../controllers/jwtController');
const funcUtils = require('../utils/funcUtils');

class venda {
        
    constructor(body) {

        this.ped_id                  = body.ped_id,
        this.ven_uuid                = body.ven_uuid,
        this.ven_id                  = body.ven_id,
        this.ven_data                = body.ven_data,
        this.cli_id                  = body.cli_id,
        this.cli_uuid                = body.cli_uuid,
        this.vdd_id                  = body.vdd_id,
        this.ven_tipo                = body.ven_tipo,
        this.ven_vecto1              = body.ven_vecto1,
        this.ven_vecto2              = body.ven_vecto2,
        this.ven_vecto3              = body.ven_vecto3,
        this.ven_vecto4              = body.ven_vecto4,
        this.ven_vecto5              = body.ven_vecto5,
        this.ven_vecto6              = body.ven_vecto6,
        this.ven_vecto7              = body.ven_vecto7,
        this.ven_vecto8              = body.ven_vecto8,
        this.ven_vecto9              = body.ven_vecto9,
        this.ven_total               = body.ven_total, 
        this.ven_desconto            = body.ven_desconto,
        this.ven_situacao            = body.ven_situacao, 
        this.ven_entrada             = body.ven_entrada, 
        this.trp_id                  = body.trp_id, 
        this.ven_observacao          = body.ven_observacao, 
        this.mes_coo                 = body.mes_coo, 
        this.mes_data                = body.mes_data, 
        this.pdv_id                  = body.pdv_id, 
        this.baixado                 = body.baixado, 
        this.sai_numnota             = body.sai_numnota,
        this.ven_outras              = body.ven_outras, 
        this.tpg_id                  = body.tpg_id, 
        this.ven_pedido              = body.ven_pedido, 
        this.ven_vecto10             = body.ven_vecto10, 
        this.ven_vecto11             = body.ven_vecto11, 
        this.ven_vecto12             = body.ven_vecto12, 
        this.ven_quantparcelas       = body.ven_quantparcelas,
        this.ven_diaparcelas         = body.ven_diaparcelas,
        this.pre_id                  = body.pre_id,
        this.ven_credito             = body.ven_credito,
        this.sai_id                  = body.sai_id,
        this.cag_id                  = body.cag_id,
        this.ped_hora                = body.ped_hora,
        this.ven_dt_entrega          = body.ven_dt_entrega,
        this.ven_urgente             = body.ven_urgente,
        this.etg_id                  = body.etg_id, 
        this.ven_dt_inclusao         = body.ven_dt_inclusao,
        this.ven_tipo_venda          = body.ven_tipo_venda,
        this.ven_dt_finalizacao      = body.ven_dt_finalizacao,
        this.tpp_id                  = body.tpp_id,
        this.ven_ender_entrega       = body.ven_ender_entrega,
        this.ven_num_bloco           = body.ven_num_bloco,
        this.ven_motorista           = body.ven_motorista,
        this.ven_contato             = body.ven_contato,
        this.ven_prazo_entrega       = body.ven_prazo_entrega,
        this.ven_custo_bancario      = body.ven_custo_bancario,
        this.reg_id                  = body.reg_id, 
        this.ven_cf_acertado         = body.ven_cf_acertado,
        this.itemvendas              = body.itemvendas,
        this.ven_cod_verificador     = body.ven_cod_verificador
    }
}

exports.pesquisarbyVendedor = function(req, res){

    const tipoToken = jwt.getTipoToken();
    const token = req.headers['x-access-token'];
    const codVendedor = (jwt.getToken(res, token, tipoToken.app).iss);

    Promise.all([      
        vendasModel.getVendasApp(codVendedor)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                vendas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas venda(s) por vendedor!! [ ${erro} ]`});
        }
    );    
};

exports.inserirApp = function(req, res){
    
    var objVenda;
   
    try {
        objVenda = new venda(req.body.vendas);

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON "vendas" no body que está sendo enviado.'
        });
    }    

    if (!objVenda.itemvendas || objVenda.itemvendas.length === 0){
        res.status(500).json({
            mensagem: 'Item venda não informado!'
        });
    };

    Promise.all([
        vendasModel.insertApp(objVenda)
    ])
    .then(
        (resultados) => {
           
            //Enviando e-mail da venda
            emails.enviarVenda(resultados[0]);

            res.status(200).json({
                vendas: resultados[0]
            });
        },
        (erro) => {

            //Tratamento se existir duplicidade de venda do app, retonar a venda para o aplicativo atualizar seus dados.
            if ((erro[0].code == 23505) && (erro[0].constraint === 'unique_ven_cod_verificador')){                              

                Promise.resolve(vendasModel.getVendaDuplicadasApp(erro[1].ven_cod_verificador))
                .then(
                    (resultados) => {
                        res.status(409).json(resultados[0]);
                    },
                    (rejeitado) => {
                        res.status(500).json(rejeitado);
                    }
                );

            }else{
                funcUtils.getMensagemErros(erro[0], res);
            };
        }
    );
};

exports.pesquisarTodos = function(req, res){
    
    const textParams = funcUtils.getFormatParams(req);
    
    Promise.all([      
        vendasModel.getVendas(textParams)
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                vendas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas venda(s)!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayVenda = [];
    
    try {
        req.body.vendas.forEach(valor => {
            arrayVenda.push(new venda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        vendasModel.insert(arrayVenda)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                vendas: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.deletar = function(req, res){

    const paramsId = req.query.ven_uuid;

    Promise.all([      
        vendasModel.delete(paramsId)
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

    var arrayVenda = [];
    
    try {
        req.body.vendas.forEach(valor => {
            arrayVenda.push(new venda(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesVenda;
    promisesVenda = vendasModel.update(arrayVenda);

    Promise.all(  
        promisesVenda
    )
    .then(
        (resultados) => {

            console.log('Venda(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Venda(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};