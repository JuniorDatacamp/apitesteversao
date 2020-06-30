const configuracoesModel = require('../models/configuracoesModel');

module.exports = {    

    get (request, response){

        configuracoesModel.get()
        .then(
            (resultados) => {
     
                response.status(200).json(
                    resultados
                );
            },
            (erro) => {
                response.status(500).json({error: `Erro ao pesquisar todas configurações!! [ ${erro} ]`});
            }
        );
    },

    insert (request, response){

        const configuracao = { 
            con_email_servidorsmtp, con_email_porta, con_email_usuario,
	        con_email_senha, con_email_conexao_segura, con_email_mensagem,
  	        con_email_tls, con_email_conf_leitura
        } = request.body;
        
        configuracoesModel.insert(configuracao)
        .then(
            (resultados) => {
     
                response.status(200).json(
                    resultados
                );
            },
            (erro) => {
                response.status(500).json({error: `Erro ao cadastrar configurações!! [ ${erro} ]`});
            }
        );
    },
    
    edit (request, response){

        const empresa = { 
            con_id, con_email_servidorsmtp, con_email_porta, con_email_usuario,
	        con_email_senha, con_email_conexao_segura, con_email_mensagem,
  	        con_email_tls, con_email_conf_leitura
        } = request.body;        

        if (! con_id){
            response.status(400).json({
                error: "Não foi possível encontrar 'ID' da configurações."
            });
        }

        configuracoesModel.edit(empresa)
        .then(
            (resultados) => {
     
                response.status(200).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao editar configurações!! [ ${erro} ]`});
            }
        );
    },
    
    delete (request, response){

        const { id } = request.params;

        configuracoesModel.delete(id)
        .then(
            (resultados) => {
     
                response.status(204).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao remover configurações!! [ ${erro} ]`});
            }
        );
    }
}