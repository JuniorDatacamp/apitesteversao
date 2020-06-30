const requestServer = require('request');

exports.efetuarlogout = function(request, response){
    
    const hostname = process.env.HOST_PAINEL;
    const path = '/logout';

    const token = request.headers['x-access-token'];

    requestServer.post(`${hostname}${path}`, {
        headers : {
            "authorization": token
        }
    },
        (err, respServer, body) => {

        if (err){
            response.status(500).json({ mensagem: `Erro no logout do painel! [ ${err} ]` });
        }

        if (respServer.statusCode === 200){
            
            console.log('Logout usuário efetuado sucesso!');

            response.status(200).json(JSON.parse(body));

        }else{                    
            response.status(401).json(JSON.parse(body));
        }
    });
};