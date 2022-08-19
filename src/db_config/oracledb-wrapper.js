const oracledb = require("oracledb");
const { rowsFormat, logConsole } = require('./helpers');
const { getPool } = require('./connect');

//* get the connection pool and execute the query
const select = async (query, binds = {}, rowsFormatType = 'snakelizeKeys', options = { outFormat: oracledb.OUT_FORMAT_OBJECT }) => {
  const {dbPool} = await getPool();
  const connection = await dbPool.getConnection();
  console.log(connection);
  try {
    const { rows } = await connection.execute(query.trim(), binds, options);
    return { success: true, data: rowsFormat(rowsFormatType, rows) }
  } catch (error) {
    logConsole(error);
    return { success: false, message: error.message };
  } finally {
    if (dbPool) await connection.close();
  }
};

module.exports = {
  select
};
