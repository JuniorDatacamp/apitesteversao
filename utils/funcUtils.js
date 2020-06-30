const crypto = require('crypto');
const CryptoGcm = require('crypto-gcm');
const global = require('../config/global');

/* ( models/produtos - retornarProdutos é um exemplo de como utilizar )
    
    Adicione o funcUtils.js no seu arquivo.
    require('../utils/funcUtils'); ou  utils = require('../utils/funcUtils');

    replaceAll
        var texto = " exemplo de teste n° {0} ";
        var textoFormatado = texto.replaceAll('{0}', 1);  
        retorno = exemplo de teste n° 1
*/

String.prototype.replaceAll = String.prototype.replaceAll || function(de, para) {
    return this.split(de).join(para);
};

exports.formatarComZero = function(num, size){
    var s = "00" + num;
    return s.substr(s.length-size);
}

exports.getMensagemErros = function getMensagemErros(error, res){

    switch (parseInt(error.code)) {
        
        case 23502:
            res.status(422).json({
                mensagem: "O campo não pode ficar null! ",
                tabela: error.table,                 
                detalhe: {coluna: error.column, linha: error.detail}});
            break;

        case 23503:
            res.status(409).json({
                mensagem: "Erro ao executar o comando. FOREIGN KEY VIOLATION ",
                tabela: error.table,
                detalhe: error.detail});
            break;            

        case 23505:
            res.status(409).json({
                mensagem: "Registro duplicado no banco de dados! ",
                tabela: error.table,
                detalhe: error.detail});
            break;

        case 22001:
            res.status(422).json({
                mensagem: "Valor do campo maior que o permitido no banco de dados! ",
                erro: error,
                detalhe: error.error});
            break;

        case 42703:
            res.status(422).json({
                mensagem: "Coluna não existe!",
                erro: error,
                detalhe: String(error)});
            break;

        case 42883:
            res.status(422).json({
                mensagem: "Erro de conversão do tipo da coluna!",
                erro: error});
            break;

        default:
            res.status(500).json({
                mensagem: "Erro não conhecido!",
                erro: error});
            break;            
    }
}

exports.getFormatParams = function getMensagemErros(req){
   
    /*
        ** função de retorno para pesquisas no banco de dados. **

        base da url: comparação?coluna=valordesejado
        obs: em pesquisa de string, adicionar a palavra com aspas simples. ='teste'

    --igual--
        igual?coluna=valordesejado
            Exemplo localhost:8000/api/departamentos/igual?dep_descricao='Massas'
    
    --dif--
        diff?coluna=valordesejado
            Exemplo localhost:8000/api/departamentos/dif?dep_id=150

    --in--
        in?coluna=(valordesejado)
            Exemplo localhost:8000/api/departamentos/in?dep_id=(150, 151)

    --maior e menor--
        maior?coluna=(valordesejado) ou menor?coluna=(valordesejado)

        Exemplo localhost:8000/api/departamentos/maior?dep_id=150
        Exemplo localhost:8000/api/departamentos/menor?dep_id=150

    --maior igual e menor igual--
        ma_igual?coluna=(valordesejado) ou me_igual?coluna=(valordesejado)

        Exemplo localhost:8000/api/departamentos/ma_igual?dep_id=150
        Exemplo localhost:8000/api/departamentos/me_igual?dep_id=150   

    --like--
        like?coluna=(%valordesejado)
            Exemplo localhost:8000/api/departamentos/like?dep_descricao=('%Mass')
        
        like?coluna=(%valordesejado%)
            Exemplo localhost:8000/api/departamentos/like?dep_descricao=('%Mass%')

        like?coluna=(valordesejado%)
            Exemplo localhost:8000/api/departamentos/like?dep_descricao=('Mass%')        
    */

    var textQuery;

    switch (req.params.pesquisa) {

        case 'like':
            
            for(var i in req.query){
                textQuery = 'where ' + i +' like ' + req.query[i];
            }
            return textQuery;

        case 'igual':            
            
            for(var i in req.query){
                textQuery = 'where ' + i +' = ' + req.query[i];
            }
            return textQuery;

        case 'dif':
            
            for(var i in req.query){
                textQuery = 'where ' + i +' <> ' + req.query[i];
            }
            return textQuery;

        case 'in':

            for(var i in req.query){
                textQuery = 'where ' + i +' in ' + req.query[i];
            }
            return textQuery;

        case 'maior':

            for(var i in req.query){
                textQuery = 'where ' + i +' > ' + req.query[i];
            }
            return textQuery;

        case 'menor':

            for(var i in req.query){
                textQuery = 'where ' + i +' < ' + req.query[i];
            }
            return textQuery;

        case 'ma_igual':

            for(var i in req.query){
                textQuery = 'where ' + i +' >= ' + req.query[i];
            }
            return textQuery;

        case 'me_igual':

            for(var i in req.query){
                textQuery = 'where ' + i +' <= ' + req.query[i];
            }
            return textQuery;

        default:
            return textQuery = ' ';
    }    
}

exports.codigoAleatorio = function codigoAleatorio(){
    
    function gerarPassword() {
        // return Math.random().toString(36).slice(-10);
        return Math.random();
    };

    const senhaGerada = Array.apply(null, Array(10)).map(gerarPassword);
    const indAleatorio = Math.floor(Math.random() * 9);
    const codigoValido = JSON.stringify(senhaGerada[indAleatorio]);

    return codigoValido.slice(3, 7);
}

exports.criptografar = function criptografar(texto){

    var emBase64 = new Buffer.from(texto).toString("base64")
        
    return emBase64;
}

exports.descriptografar = function descriptografar(texto){
   
    var deBase64 = new Buffer.from(texto, "base64").toString("ascii")

    return deBase64;
}