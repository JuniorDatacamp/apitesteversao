const typesBD = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
};

const pg = require('pg');
const format = require('pg-format');

//converter todos numeric do banco de dados para float ou int.
//Foi preciso essa conversão, pois o javascript retorna como string numeros acima de 32 bits.

process.env.TZ = "America/Sao_Paulo";

pg.types.setTypeParser(typesBD.NUMERIC, parseFloat);
pg.types.setTypeParser(typesBD.INT8, parseInt);
pg.types.setTypeParser(typesBD.DATE, function(stringValue) {
    return new Date(Date.parse(stringValue))
});
pg.types.setTypeParser(typesBD.TIMESTAMP, function(stringValue) {
    return new Date(Date.parse(stringValue + "+0000"))
});

function createPool() {

    //variaveis de ambiente para configuração de acesso aos dados.
    const hostApi = (process.env.BD_HOST_API);
    const databaseApi = (process.env.BD_BASE_API);
    const bdUserApi = (process.env.BD_USER_API);
    const bdKeyApi = (process.env.BD_KEY_API);    

    const config = {
        host: hostApi, 
        port: 5432,
        database: databaseApi,
        user: bdUserApi,
        password: bdKeyApi,
        ssl: false
        // ,
        // statement_timeout: 30000,
        // query_timeout: 30000
    }; 

    const pool = new pg.Pool(config)
  
    pool.on("error", function(err, client) {
        console.error("**Falha ao tentar conectar com banco de dados da api.** ", err.message, err.stack);
    });
  
    return pool;
};

exports.conexao       = createPool();

exports.formatSql = function formatSql(tipoSql, tabela, obj, parametro){

    /*  Como utilizar a função com exemplo do obj do contas a receber.
        "parametro" = vazio, retorna na query sem where ou sem returning.

        ** insert **
        var dadosInsert = Configuracao.formatSql('insert', objReceber, 'returning rec_uuid');
        var textSql = dadosSqlReceber.sqlText;
        var params = dadosSqlReceber.valorParametro;

        ** update **
        var dadosUpdate = Configuracao.formatSql('update', objReceber, 'rec_uuid');
        var textSql = dadosSqlReceber.sqlText;
        var params = dadosSqlReceber.valorParametro;        
    */

    var colunas = [];
    // var valorColuna = [];
    var paramsWhere;
    var i;

    for (i in obj[0]){

        if (obj[0][i] != null || tipoSql == 'update'){
            colunas.push(i);
        }
    };

    var valorColuna = obj.map(function(obj) {
        return Object.keys(obj).map(function(chave) {
            return obj[chave];
        });
    });

    switch (tipoSql){
        
        case 'insert':
            var sqlValues = [];
            
            colunas.forEach(function (item, indice, array) {

                //parametro da query sempre iniciar com 1.
                indice = indice + 1;
                //adicionando numeros de parametros da query.
                sqlValues.push('$'+indice);
            });
            
            // var sqlPronto = 'insert into '+ tabela + ' ('+ colunas +') values ('+ sqlValues +') ' + parametro;
            var sqlPronto = 'insert into '+ tabela + ' ( '+ colunas +' ) values %L ' + parametro;
            var sqlPronto = format(sqlPronto, valorColuna);

            const objInsert = {sqlText: sqlPronto, valorParametro: valorColuna};
            
            return objInsert;

        case 'update':
            var colunasUpdate = [];

            colunas.forEach(function (item, indice, array) {

                //parametro da query sempre iniciar com 1.
                indice = indice + 1;
                //adicionando numeros de parametros da query.
        
                if (item == parametro){
                    paramsWhere = item + '= $'+indice;
                }else{
                    colunasUpdate.push(item + '= $'+indice);
                }
            });
            
            var sqlPronto = 'update '+ tabela +' set '+ colunasUpdate + ' where ' + paramsWhere;
            
            const objUpdate = {sqlText: sqlPronto, valorParametro: valorColuna[0]};
            return objUpdate;

        default: return '';
    }
}