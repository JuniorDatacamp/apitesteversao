const recebersModel = require('../models/recebers');
const funcUtils = require('../utils/funcUtils');

class receber {
        
    constructor(body) {

        this.documento               = body.documento, 
        this.clf_id                  = body.clf_id, 
        this.tip_id                  = body.tip_id, 
        this.loc_id                  = body.loc_id, 
        this.cli_id                  = body.cli_id, 
        this.vdd_id                  = body.vdd_id, 
        this.ven_id                  = body.ven_id, 
        this.ven_data                = body.ven_data, 
        this.sai_numnota             = body.sai_numnota, 
        this.sse_nronota             = body.sse_nronota, 
        this.codigoboleta            = body.codigoboleta, 
        this.tipopagamento           = body.tipopagamento, 
        this.datalancamento          = body.datalancamento, 
        this.dataemissao             = body.dataemissao, 
        this.datavencimento          = body.datavencimento, 
        this.datarecebimento         = body.datarecebimento, 
        this.valorareceber           = body.valorareceber, 
        this.valororiginal           = body.valororiginal, 
        this.valorrecebido           = body.valorrecebido, 
        this.valordevolvido          = body.valordevolvido, 
        this.juros                   = body.juros, 
        this.desconto                = body.desconto, 
        this.perccomissao            = body.perccomissao, 
        this.doctosubstituicao       = body.doctosubstituicao, 
        this.observacao              = body.observacao, 
        this.baixado                 = body.baixado, 
        this.duplicatadescontada     = body.duplicatadescontada, 
        this.situacao                = body.situacao, 
        this.mes_coo                 = body.mes_coo, 
        this.valorcorrigido          = body.valorcorrigido, 
        this.datadevolucao           = body.datadevolucao, 
        this.cheque_pre              = body.cheque_pre, 
        this.tur_id                  = body.tur_id, 
        this.rec_hora                = body.rec_hora, 
        this.auxilia                 = body.auxilia, 
        this.os_id                   = body.os_id, 
        this.os_data                 = body.os_data, 
        this.rec_id                  = body.rec_id,
        this.rec_banco               = body.rec_banco, 
        this.rec_agencia             = body.rec_agencia, 
        this.rec_conta               = body.rec_conta, 
        this.rec_emitente            = body.rec_emitente, 
        this.sai_id                  = body.sai_id, 
        this.rec_idsubstituicao      = body.rec_idsubstituicao, 
        this.devolucao               = body.devolucao, 
        this.bol_situacao            = body.bol_situacao, 
        this.dt_primeiro_vencto      = body.dt_primeiro_vencto, 
        this.rec_numcheque           = body.rec_numcheque, 
        this.rec_pedido              = body.rec_pedido, 
        this.correcao                = body.correcao, 
        this.dt_vencto_ini           = body.dt_vencto_ini, 
        this.cre_id                  = body.cre_id, 
        this.rec_duplicata_impressa  = body.rec_duplicata_impressa, 
        this.rec_baixa_via_pdv_id    = body.rec_baixa_via_pdv_id, 
        this.ser_id                  = body.ser_id, 
        this.rec_data_duplicata      = body.rec_data_duplicata, 
        this.rec_mensagem_consorcio  = body.rec_mensagem_consorcio, 
        this.chc_id                  = body.chc_id, 
        this.rec_nossonumero         = body.rec_nossonumero, 
        this.nfs_id                  = body.nfs_id, 
        this.con_id                  = body.con_id, 
        this.rec_tx_adesao           = body.rec_tx_adesao, 
        this.ban_id                  = body.ban_id, 
        this.rec_spc                 = body.rec_spc, 
        this.rec_serasa              = body.rec_serasa, 
        this.tpg_id                  = body.tpg_id, 
        this.rec_parcela             = body.rec_parcela, 
        this.rec_liquidado           = body.rec_liquidado, 
        this.mes_data                = body.mes_data, 
        this.pdv_id                  = body.pdv_id,
        this.cli_uuid                = body.cli_uuid, 
        this.ven_uuid                = body.ven_uuid,
        this.rec_uuid                = body.rec_uuid
    }
}

exports.pesquisarTodos = function(req, res){

    const textParams = funcUtils.getFormatParams(req);    

    Promise.all([      
        recebersModel.getReceberFormat(textParams)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                recebers: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.inserir = function(req, res){

    var arrayReceber = [];
    
    try {
        req.body.recebers.forEach(valor => {
            arrayReceber.push(new receber(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        recebersModel.insert(arrayReceber)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                recebers: resultados[0]
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.rec_uuid;

    Promise.all([      
        recebersModel.delete(paramsId)
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

    var arrayReceber = [];
    
    try {
        req.body.recebers.forEach(valor => {
            arrayReceber.push(new receber(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesReceber;
    promisesReceber = recebersModel.update(arrayReceber);

    Promise.all(  
        promisesReceber
    )
    .then(
        (resultados) => {

            console.log('Receber atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Receber atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};