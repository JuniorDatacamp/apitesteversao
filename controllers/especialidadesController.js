const especialidadesModel = require('../models/especialidades');
const funcUtils = require('../utils/funcUtils');

class especialidade {
        
    constructor(body) {
            
            this.esp_id         = body.esp_id,
            this.esp_descricao  = body.esp_descricao,
            this.esp_finan      = body.esp_finan
    }
}

exports.pesquisarTodos = function(req, res){
    
    Promise.all([      
        especialidadesModel.getEspecialidadesFull()
    ])
    .then(
        (resultados) => {
 
            res.status(200).json({
                especialidades: resultados[0]
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar todas especialidades!! [ ${erro} ]`});
        }
    );
};

exports.inserir = function(req, res){

    var arrayEspecialidade = [];
    
    try {
        req.body.especialidades.forEach(valor => {
            arrayEspecialidade.push(new especialidade(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        });
    }

    Promise.all([
        especialidadesModel.insert(arrayEspecialidade)
    ])
    .then(
        (resultados) => {
           
            res.status(200).json({
                mensagem: 'Especialidades(s) inserido com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};

exports.deletar = function(req, res){

    const paramsId = req.query.esp_id;

    Promise.all([      
        especialidadesModel.delete(paramsId)
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

    var arrayEspecialidade = [];
    
    try {
        req.body.especialidades.forEach(valor => {
            arrayEspecialidade.push(new especialidade(valor));
        });

    } catch (error) {
        res.status(400).json({
            mensagem: 'A requisição não está de acordo com o formato esperado. Verifique o JSON (body) que está sendo enviado.'
        }); 
    }

    var promisesEspecialidade;
    promisesEspecialidade = especialidadesModel.update(arrayEspecialidade);

    Promise.all(  
        promisesEspecialidade
    )
    .then(
        (resultados) => {

            console.log('Especialidades(s) atualizado com sucesso!');

            res.status(200).json({
                mensagem: 'Especialidades(s) atualizado com sucesso!'
            });
        },
        (erro) => {
            console.log(erro);
            funcUtils.getMensagemErros(erro, res);
        }
    );    
};