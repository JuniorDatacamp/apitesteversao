var nodemailer = require('nodemailer');
const Configuracao = require('../config/database');
const utils = require('../utils/funcUtils');

const sqlConfiguracoes = 
    ` select 
	    con_id, con_email_servidorsmtp,	con_email_porta, con_email_usuario,	con_email_senha,
	    con_email_conexao_segura, con_email_mensagem, con_email_tls,
        con_email_conf_leitura
      from 
	    configuracoes `;

module.exports = {

    enviarCodigoConfirmacaoConta (nomeUsuario, codigoConfirmacao, email){

        return new Promise((resolve, reject) => {    
        
            const ConexaoBanco = Configuracao.conexao;
            
            ConexaoBanco.query(sqlConfiguracoes, function(error, results){
                if(error) 
                    reject('Erro ao pesquisar empresas para enviar código de confirmação por email. '+error);
                else
                    var usuario = results.rows[0].con_email_usuario;
                    var senha = utils.descriptografar(results.rows[0].con_email_senha);
                    var destinatario = email;
                    var seguranca = false;
    
                    if (results.rows[0].con_email_conexao_segura == 'S' || results.rows[0].con_email_tls == 'S'){
                        seguranca = true;
                    }
                
                    var transporter = nodemailer.createTransport({
                        host: results.rows[0].con_email_servidorsmtp,
                        port: results.rows[0].con_email_porta,
                        secure: seguranca,
                        connectionTimeout: 60000,
                        greetingTimeout: 30000,
                        socketTimeout: 30000,
                        auth: {
                        user: usuario,
                        pass: senha
                        }
                    });
    
                    var htmlConfirmacao =
                        `   <div style="background-color: #f0f0f0; border-radius: 10px; font-family:Verdana, sans-serif; padding-left: 10px; padding-top: 10px; padding-right: 10px; padding-bottom: 10px;">
                                <div style="background-color: white; color: black; width: 90%; height: 90%; border-radius: 10px; font-family:Verdana, sans-serif; padding-top: 5px; padding-left: 15px; margin: auto;">
                                    <td style="color: black; width: 90%; height: 90%;">
                                        <h3><p style="color: #00669F;"> Confirme seu e-mail </p></h3>
                                        <p style="color: black;"> Olá, {usuario}, </p>
                                        <p style="color: black;"> Para efetuar seu login, informe o código no aplicativo para confirmar o e-mail. </p>
                                            <div style="background-color: #00669F; color: white; text-align: center; width: 90%; height: 30px; margin: auto; padding-top: 10px;> 
                                                <p style="color: white;"> {codigo} </p>
                                            </div>
                                        <br>
                                        <p style="color: black;"> Depois de efetuar o login, você poderá enviar vendas com rapidez e facilidade.  </p>
                                        <p style="color: black;"> Obrigado! </p>
                                        <p style="color: black; font-size: 10px;"> Este é um e-mail gerado automaticamente. Não responda. </p>
                                        <br>
                                    </td>
                                </div>
                            </div>
                        `;
    
                    var htmlEnviar = htmlConfirmacao.replaceAll('{usuario}', nomeUsuario);
                    htmlEnviar = htmlEnviar.replaceAll('{codigo}', codigoConfirmacao);
    
                    const mailOptions = {
                        from: usuario,
                        to: destinatario,
                        subject: 'Enviando email de confirmação de usuário',
                        text: 'Login aplicativo DFV - Datacamp.',
                        html: htmlEnviar
                    };            
    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            // res.status(200).json({mensagem: error});
                            reject('Erro ao enviar código de confirmação por email. '+error);
                        }else{
                            // res.status(200).json({mensagem: 'Email enviado: '+ info.response});
                            resolve({mensagem: 'Email com código de confirmação enviado: '+ info.response});
                        }
                    });
            });
        });    
    }
}