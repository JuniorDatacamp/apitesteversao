const Configuracao = require('../config/database');

const sqlOcorrencias =
    `   select            
            coalesce(json_build_object(oco_tabela, json_agg(oco_id_tabela)), '[]') as ocorrencias
        from 
            ocorrencias  `;

function formatarOcorrencias(array){
    
    var clientes, configuracoes, departamentos, municipios, produtos, recebers,
    tiposdoctos, tipospagtos, tipospagtoscliente, vendedores;

    //Se existe ocorrencia(delete ou algo especial) para enviar para aplicativo.
    for (i in array){

        const dados = JSON.parse(JSON.stringify(array[i].ocorrencias));
        const NomeObjOcorrencias = Object.keys(dados);

        switch (String(NomeObjOcorrencias)) {
            case 'clientes':
                clientes = dados.clientes;
                break;

            case 'configuracoes':
                configuracoes = dados.configuracoes;
                break;
            
            case 'departamentos':
                departamentos = dados.departamentos;
                break;

            case 'municipios':
                municipios = dados.municipios;
                break;

            case 'produtos':
                produtos = dados.produtos;
                break;
                
            case 'recebers':
                recebers = dados.recebers;
                break;

            case 'tiposDoctos':
                tiposDoctos = dados.tiposdoctos;
                break;

            case 'tiposPagtos':
                tipospagtos = dados.tipospagtos;
                break;

            case 'tipospagtoscliente':
                tipospagtoscliente = dados.tipospagtoscliente;
                break;

            case 'vendedores':
                vendedores = dados.vendedores;
                break;                      
        
            default:
                break;
        }
    };

    return {
        ocorrencias: {
            clientes, configuracoes, departamentos, municipios, produtos, recebers,
            tiposdoctos, tipospagtos, tipospagtoscliente, vendedores
        }
    }
};

exports.retornarOcorrencias = function retornarOcorrencias(package){

    return new Promise((resolve, reject) => {

        const ConexaoBanco = Configuracao.conexao;        
        var params = [];

        if (package.pacotefull){
            var addWhere = ' ';
            return resolve([]);
        }else{
            var addWhere = ' where oco_dt_ultima_atualizacao > $1 group by oco_tabela';
            params.push(package.data);
        }
    
        console.log('Consultando ocorrencias...');
        ConexaoBanco.query(sqlOcorrencias+addWhere, params, (error, results) => {
            
            if (error){
                return reject('Erro ao consultar ocorrencias no banco de dados.');
            }else{
                const ocorrencia = formatarOcorrencias(results.rows);
                return resolve(ocorrencia);
            }
        });
    });
};