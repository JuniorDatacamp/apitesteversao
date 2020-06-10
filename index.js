const http = require("http");
const AppServer = require("./server");

//import * as https from 'https'

// Para outras hospedagem alterar o método da porta e o arquivo package.json "start": "node index"
//const port = (process.env.PORT || 3000);

// utilizar quando for heroku
// Para heroku alterar o método da porta e o arquivo package.json "start": "node index.js"
const port = (process.env.PORT || 8000);

// AppServer.default.set('port', port);

//  Cria o servidor e passa a api pra ele.
const server = http.createServer(AppServer.default);
server.listen(port);
server.timeout = 60000;
server.on('listening', onListening);

/**
 * Função que diz que a porta do servidor está ativa
 */
function onListening() {
    console.log('Ouvindo na porta: ' + port);
}
