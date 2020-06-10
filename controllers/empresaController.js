const empresaModel = require('../models/empresa');
const funcUtils = require('../utils/funcUtils');

class empresa {
        
    constructor(body) {
            
        this.emp_id          = body.emp_id,
        this.emp_nome        = body.emp_nome,
        this.emp_cnpj        = body.emp_cnpj,
        this.emp_endereco    = body.emp_endereco,
        this.emp_numero      = body.emp_numero, 
        this.emp_bairro      = body.emp_bairro, 
        this.emp_cidade      = body.emp_cidade, 
        this.emp_estado      = body.emp_estado,
        this.emp_cep         = body.emp_cep,
        this.emp_complemento = body.emp_complemento,
        this.emp_telefone    = body.emp_telefone,
        this.emp_email       = body.emp_email,
        this.emp_homepage    = body.emp_homepage,
        this.emp_contato     = body.emp_contato
        this.emp_nfeemail_servidorsmtp  = body.emp_nfeemail_servidorsmtp, 
        this.emp_nfeemail_porta         = body.emp_nfeemail_porta,
        this.emp_nfeemail_usuario       = body.emp_nfeemail_usuario,
        this.emp_nfeemail_senha         = body.emp_nfeemail_senha,
        this.emp_nfeemail_conexao_segura    = body.emp_nfeemail_conexao_segura,
        this.emp_nfeemail_mensagem          = body.emp_nfeemail_mensagem,
        this.emp_email_tls                  = body.emp_email_tls,
        this.emp_email_conf_leitura         = body.emp_email_conf_leitura
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([
        empresaModel.getEmpresas()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                empresas: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar Empresa(s)!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayEmpresas = [];
    
    try {
        req.body.empresas.forEach(valor => {
            arrayEmpresas.push(new empresa(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        empresaModel.insert(arrayEmpresas)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Empresa(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};

exports.alterar = function(req, res){

    var arrayEmpresas = [];
    
    try {
        req.body.empresas.forEach(valor => {
            arrayEmpresas.push(new empresa(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesEmpresas;
    promisesEmpresas = empresaModel.update(arrayEmpresas);

    Promise.all(  
        promisesEmpresas
    )
    .then(
        (resultados) => {

            console.log('Empresa(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Empresa(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );
};