const oracledb = require("oracledb");
const { rowsFormat, logConsole } = require('./helpers');
const { getPool } = require('./connect');

//* SELECT statements
const select = async (query, binds = {}, rowsFormatType = 'snakelizeKeys', options = { outFormat: oracledb.OUT_FORMAT_OBJECT }) => {
  const { success, data, message, code } = await queryDb(query, binds, options);
  return { code, success, data: rowsFormat(rowsFormatType, data.rows), message }
};

//* INSERT, UPDATE, DELETE statements
const execute = async (query, binds = {}, options = { autoCommit: true }) => {
  return queryDb(query, binds, options);
};

const queryDb = async (query, binds, options) => {
  const { dbPool, online } = await getPool();
  if (!online) return { code: 400, success: false, message: 'Error conecting DB' };
  let connection = { close: () => true }
  try {
    connection = await dbPool.getConnection();
    const result = await connection.execute(query.trim(), binds, options);
    return { code: 200, success: true, data: result }
  } catch (error) {
    logConsole(error);
    return { code: 400, success: false, message: error.message };
  } finally {
    if (dbPool) await connection.close();
  }
}

module.exports = {
  select,
  execute
};
