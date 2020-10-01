const consultaEstoqueModel = require('../models/consultaEstoque');

exports.pesquisar = function(req, res){

    let params;

    (req.params.pesquisa) ? params = req.params.pesquisa : params = '%';
    
    consultaEstoqueModel.getConsultaEstoques(params).then(
        (resultados) => {
 
            res.status(200).json({
                estoques: resultados
            });
        },
        (erro) => {
            res.status(500).json({message: `Erro ao consultar os estoques!! [ ${erro} ]`});
        }
    );
};