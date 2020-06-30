const empresasModel = require('../models/empresasModel');

module.exports = {    

    get (request, response){

        const { params } = request.params;
        
        empresasModel.get(params)
        .then(
            (resultados) => {
     
                response.status(200).json(
                    resultados
                );
            },
            (erro) => {
                response.status(500).json({error: `Erro ao pesquisar todas empresas!! [ ${erro} ]`});
            }
        );
    },

    insert (request, response){

        const empresa = { nome, cpf, cnpj, senha, ativo, qtdeacesso, url, nivel} = request.body;

        empresasModel.insert(empresa)
        .then(
            (resultados) => {
     
                response.status(200).json(
                    resultados
                );
            },
            (erro) => {
                response.status(500).json({error: `Erro ao cadastrar empresa!! [ ${erro} ]`});
            }
        );
    },
    
    edit (request, response){

        const empresa = { id, nome, cpf, cnpj, senha, ativo, qtdeacesso, url, nivel} = request.body;

        if (! id){
            response.status(400).json({
                error: "Não foi possível encontrar 'ID' da empresa."
            });
        }

        empresasModel.edit(empresa)
        .then(
            (resultados) => {
     
                response.status(200).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao editar empresa!! [ ${erro} ]`});
            }
        );
    },
    
    delete (request, response){

        const { params } = request.params;

        empresasModel.delete(params)
        .then(
            (resultados) => {
     
                response.status(204).json(resultados);
            },
            (erro) => {
                response.status(500).json({error: `Erro ao remover empresa!! [ ${erro} ]`});
            }
        );
    }
}