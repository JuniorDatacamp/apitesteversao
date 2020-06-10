const model = require('../models/vendedores');
const modelUsuarios = require('../models/painel/usuarios');
const modelEmpresas = require('../models/painel/empresas');
const jwt = require('jwt-simple');
const moment = require('moment');
const globalConfig = require("../config/global");
const nonceKeySalt = globalConfig.nonceKeySalt.value;
const CryptoGcm = require('crypto-gcm');

const definicaoCrypto = globalConfig.defCrypto;
const cg = new CryptoGcm(definicaoCrypto);

const verificaSenha = function(password, ValidPassword, next) {
  
  var isMatch = false;  
  
  if(password == ValidPassword){
    isMatch = true;
  }

  next(isMatch);  
};

/**
 * Validação do token recebido
 *
**/
module.exports = function(req, res) {
  
  try {    
    
    const codigoEmpresa  = req.body.login.codEmpresa;
    const codigoVendedor = req.body.login.codVendedor;
    const senha          = req.body.login.senhaVendedor;

    if (codigoEmpresa == '' || codigoVendedor == '' || senha == '') {
      return res.send({status: 401, message: "Login, Senha e Código Empresa Vazios."});
    }
    
    // Buscamos por usuários com os dados informados. 
    //Se der erro, res.end(401). Se não der erro, continua, retornando o resultado como user.
    model.findOne({_id: codigoVendedor}, function (err, user) {

      if (user == null) {
        return res.send({status: 401, message: "Usuário não encontrado."});
      }
      
      // Se ele não retornar o parâmetro isMatch, res.end(401) 
      verificaSenha(senha, user.senha, function(isMatch) {
        if (!isMatch) {
          return res.send({status: 401, message: "Senha não confere com a cadastrada."});
        }
      
        // Momento pra dizer quantidade de dias que o token ira expirar
        var expires = moment().add(365,'days').valueOf();
        var token = jwt.encode({
          iss: user.id, //aqui pode dar o erro.
          exp: expires
        }, nonceKeySalt);
        
        //Cadastrando usuário no painel de licença
        const novousuario = new modelUsuarios();

        novousuario.cnpjEmpresa = codigoEmpresa;
        novousuario.login       = codigoVendedor;
        novousuario.password    = cg.encrypt(senha);
        novousuario.tipo        = cg.encrypt("V");
        novousuario.ativo       = true;      

        novousuario.save(function(error) {
          if(error)
            res.send(error);
                
          // res.json({ message: 'Usuário(Vendedor) salvo com sucesso!' });
        });
        
        // testar token retornado para app.
        // console.log(token);      

        //Antes do retorno criptografar a senha do vendedor.
        user.senha = cg.encrypt(user.senha);

        return res.json({"vendedor": user, token : token});
      });
    });    
  }
  catch (e) {
      res.json({ status: 400, message: 'Erro ao tentar efetuar o login.'});
  }

};