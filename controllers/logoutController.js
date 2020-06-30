const usuariosModel = require('../models/usuariosModel');

module.exports = {

    efetuarlogout (request, response){
       
        Promise.all([
            usuariosModel.logout(request.headers['authorization'])
        ])
        .then(
            (resultados) => {
    
                if (resultados[0] == 0){
                    response.status(422).json({mensagem: "Não foi encontrado vendedor para efetuar o logout."});
                }
                else{
                    response.status(200).json({mensagem: "Logout efetuado com sucesso!."});
                }
            },
            (erro) => {
                response.status(500).json({mensagem: `Erro no logout!! [ ${erro} ]`});
            }
        );
    }
};