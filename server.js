"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Dependencias
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const cors = require('cors');

//  CLASSE QUE GERA O APP
class App {
    //  Constrói os módulos usados pelo app
    constructor() {
        //  Cria a aplicação
        this.api = express();
        //  Cria o middleware
        this.middleware();
        //  Configura as rotas
        this.routes();        
    }
    //  Configura o middleware
    middleware() {
        this.api.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.api.use(bodyParser.json({ limit: '50mb' }));
        this.api.use(helmet());
    }

    routes() {
        let router;
        router = express.Router();
        this.api.use('/login', cors(), require('./routes/login'));
        this.api.use('/logout', cors(), require('./routes/logout'));
        this.api.use('/api', cors(), require('./routes/api'));
    }
}

exports.default = new App().api;