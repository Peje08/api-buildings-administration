const oracledb = require("oracledb");
const { camelizeKeys, logConsole } = require("./helpers");
const { getPool } = require("./connect");

//* get the connection pool and execute the query
const select = async (
    query,
    binds = {},
    camelize = true,
    options = { outFormat: oracledb.OUT_FORMAT_OBJECT }
) => {
    try {
        let pool = await getPool();
        const connection = await pool.getConnection();
        const { rows } = await connection.execute(query, binds, options);
        await connection.close();
        return camelize ? camelizeKeys(rows) : rows;
    } catch (error) {
        logConsole(error);
        return new Error(error);
    }
};

module.exports = {
    select
};
