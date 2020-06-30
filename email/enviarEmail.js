var nodemailer = require('nodemailer');
const Configuracao = require('../config/database');
const utils = require('../utils/funcUtils');

const htmlPrincipal =
`<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Pedido aplicativo Datacamp.</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
    <div style="background-color: white; width: 100%; height: 100%; border-radius: 10px; font-family:Verdana, sans-serif;">

        <div id="box"> 
            
            <div style="background-color: #f0f0f0; color: black; width: 100%; height: 100%; border-radius: 10px; font-family:Verdana, sans-serif; padding-top: 5px; padding-left: 5px;">
            
                <td style="color: black;" colspan="4">                    
                    <p style="color: black;"> Prezado(a) {cli_nome} </p>                        
                    <p style="color: black;"> Esta é a confirmação de que seu pedido de N° {ped_id} foi finalizado com sucesso. </p>
                    <p style="color: black;"> Por favor, leia essa mensagem com muita ATENÇÃO.</p>                    
                    <p style="color: black;">  Obrigado pelo seu pedido! </p>
                    <br style="color: black;">
                    <strong><p style="color: black;"> {emp_nome} </p></strong>                
                    <br>
                </td>
            </div>

            <br>

            <table style="border-collapse:collapse; border-style:solid; border-width:1px; border-color: black;">

                <colgroup>
                    <col style="width: 130px">
                    <col style="width: 170px">
                    <col style="width: 132px">
                    <col style="width: 121px">
                    <col style="width: 137px">               
                </colgroup>

                <tr>
                    <th style="background-color:#00669F; text-align:left; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;" colspan="2">
                        <span style="font-weight:bold;color:#f0f0f0">Pedido n° </span>
                        <span style="font-weight:normal;color:#f0f0f0"> {ped_id} </span>
                    </th>

                    <th style="background-color:#00669F; text-align:left; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;" colspan="4">
                        <span style="font-weight:bold;color:#f0f0f0">Emissão </span>
                        <span type="date" style="font-weight:normal;color:#f0f0f0"> {ven_data} </span>
                    </th>
                </tr>

                <tr>
                    <td style="background-color:#f9f9f9; font-weight:bold; text-align:left; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;" colspan="2">Produto</td>
                    <td style="background-color:#f9f9f9; font-weight:bold; text-align:center; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;">Preço Unit.</td>
                    <td style="background-color:#f9f9f9; font-weight:bold; text-align:center; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;">Qtde.</td>
                    <td style="background-color:#f9f9f9; font-weight:bold; text-align:center; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;">Desconto(%)</td>
                    <td style="background-color:#f9f9f9; font-weight:bold; text-align:center; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;">Preço Total</td>
                </tr>

                {htmlItens}
                
                <tr>
                    <!-- espaço na tabela -->
                    <td style="text-align:left; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;" colspan="6"> </td> 
                </tr>
                <th style="background-color:#f9f9f9; text-align:left; vertical-align:top; font-family:Verdana, sans-serif; font-size:14px; padding:10px 5px; overflow:hidden; word-break:normal;" colspan="6">
                    <span style="font-weight:bold">Valor Total </span> 
                    <span style="font-weight:normal"> R$ {ven_total} </span>
                </th>
            </table>
        </div>
    </div>
</body>
</html>`

const tagItens =
    "   <tr>  "+
    "       <td style='text-align:left; vertical-align:top; padding:10px 5px;' colspan='2'> {itv_descricao} </td>  "+
    "       <td style='text-align:center; vertical-align:top; padding:10px 5px;'> {itv_precovenda} </td>  "+
    "       <td style='text-align:center; vertical-align:top; padding:10px 5px;'> {itv_qtde} </td>  "+
    "       <td style='text-align:center; vertical-align:top; padding:10px 5px;'> {itv_desconto} </td>  "+
    "       <td style='text-align:center; vertical-align:top; padding:10px 5px;'> {itv_valortotal} </td>  "+
    "   </tr>    "

const sqlPedidoEnviar =
    "   select   "+
    "	    ped_id, v.ven_data, ven_total, itv_descricao, itv_precovenda, itv_qtde, itv_desconto, itv_valortotal,   "+
    "   	cli_email, cli_nome, "+
	"       emp_nome, emp_email, emp_homepage, emp_distribuidor, emp_contato, emp_nfeemail_servidorsmtp,  "+
	"       emp_nfeemail_porta, emp_nfeemail_usuario, emp_nfeemail_senha, emp_nfeemail_conexao_segura,  "+
	"       emp_nfeemail_mensagem, emp_email_tls, emp_email_conf_leitura  "+
    "   from   "+
    "	    empresas, venda v   "+
    "   inner join   "+
    "	    item_venda i on v.ven_uuid = i.ven_uuid   "+
    "   inner join  "+
	"       clientes c on v.cli_uuid = c.cli_uuid   "+
    "   where   "+
    "	    v.ven_uuid = $1   "+
    "   order by   "+
    "	    itv_descricao "

const sqlEmpresas = 
    ` select 
        emp_nome, emp_email, emp_homepage, emp_distribuidor, emp_contato, emp_nfeemail_servidorsmtp,
        emp_nfeemail_porta, emp_nfeemail_usuario, emp_nfeemail_senha, emp_nfeemail_conexao_segura,
        emp_nfeemail_mensagem, emp_email_tls, emp_email_conf_leitura
      from
        empresas `

exports.enviarVenda = function(numVenda){

    const ConexaoBanco = Configuracao.conexao; 
    
    ConexaoBanco.query(sqlPedidoEnviar, [numVenda.ven_uuid], function(error, results){
        if(error) 
            console.log('Erro ao consultar pedido para enviar email: '+error);
        else
            var usuario = results.rows[0].emp_nfeemail_usuario;
            var senha = results.rows[0].emp_nfeemail_senha;
            var destinatario = results.rows[0].cli_email;
            var seguranca = false;

            if (results.rows[0].emp_nfeemail_conexao_segura == 'S' || results.rows[0].emp_email_tls == 'S'){
                seguranca = true;
            }
        
            var transporter = nodemailer.createTransport({
                // service: 'Yahoo',
                host: results.rows[0].emp_nfeemail_servidorsmtp,
                port: results.rows[0].emp_nfeemail_porta,
                secure: seguranca,
                // logger: true,
                auth: {
                  user: usuario,
                  pass: senha
                }
            });

            var htmlPedido = htmlPrincipal.replaceAll('{cli_nome}', results.rows[0].cli_nome);
            htmlPedido = htmlPedido.replaceAll('{ped_id}', results.rows[0].ped_id);

            const dataVenda = new Date(results.rows[0].ven_data);

            htmlPedido = htmlPedido.replaceAll('{ven_data}', 
                utils.formatarComZero((dataVenda.getDate()), 2) + '/' +
                utils.formatarComZero((dataVenda.getMonth()+1), 2) + '/' +
                dataVenda.getFullYear()
            );            
            htmlPedido = htmlPedido.replaceAll('{ven_total}', results.rows[0].ven_total);
            htmlPedido = htmlPedido.replaceAll('{emp_nome}', results.rows[0].emp_nome);
        
            var htmlItens = '';
            var enviarTagtens = '';
            
            results.rows.forEach(function (itemPedido, indicePedido, arrayPedido) {
                htmlItens = tagItens.replaceAll('{itv_descricao}', arrayPedido[indicePedido].itv_descricao);
                htmlItens = htmlItens.replaceAll('{itv_precovenda}', arrayPedido[indicePedido].itv_precovenda);
                htmlItens = htmlItens.replaceAll('{itv_qtde}', arrayPedido[indicePedido].itv_qtde);
                htmlItens = htmlItens.replaceAll('{itv_desconto}', arrayPedido[indicePedido].itv_desconto);
                htmlItens = htmlItens.replaceAll('{itv_valortotal}', arrayPedido[indicePedido].itv_valortotal);
    
                enviarTagtens = enviarTagtens + htmlItens;
            })
            
            htmlPedido = htmlPedido.replaceAll('{htmlItens}', enviarTagtens);

            const mailOptions = {
                from: usuario,
                to: destinatario,
                subject: 'Enviando email do seu pedido',
                text: 'Mensagem automática sistema Datacamp.',
                html: htmlPedido
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                }else{
                    console.log('Email enviado: '+ info.response);
                    // transporter.close();                    
                }
            });
    });
}

//método para testar a configuração de email do cadastro de empresa.
exports.enviarTeste = function(req, res){

    const email = req.params.email;
    const ConexaoBanco = Configuracao.conexao; 
    
    ConexaoBanco.query(sqlEmpresas, function(error, results){
        if(error) 
            console.log('Erro ao enviar email de teste: '+error);
        else
            var usuario = results.rows[0].emp_nfeemail_usuario;
            var senha = results.rows[0].emp_nfeemail_senha;
            var destinatario = email;
            var seguranca = false;

            if (results.rows[0].emp_nfeemail_conexao_segura == 'S' || results.rows[0].emp_email_tls == 'S'){
                seguranca = true;
            }
        
            var transporter = nodemailer.createTransport({
                host: results.rows[0].emp_nfeemail_servidorsmtp,
                port: results.rows[0].emp_nfeemail_porta,
                secure: seguranca,
                auth: {
                  user: usuario,
                  pass: senha
                }
            });

            const mailOptions = {
                from: usuario,
                to: destinatario,
                subject: 'Enviando email de teste',
                text: 'Mensagem de configuração de email automático sistema Datacamp.',
                html: '<p>Teste efetuado com sucesso!</p>'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({mensagem: error});
                }else{
                    res.status(200).json({mensagem: 'Email enviado: '+ info.response});
                }
            });
    });
};