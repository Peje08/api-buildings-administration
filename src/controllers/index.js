const oracledb = require('oracledb');
const { select, execute } = require('../db_config/oracledb-wrapper');
const { query, queryInsert } = require('../querys');

const index = ({ res }) => res.status(200).json({ code: 200, message: 'Welcome to API Template Nodejs Prefix' });

const controllerFuncSelect = async (req, res) => {
    const { param1, param2 } = req.params
    const queryString = query();
    const { success, data, message, code } = await select(queryString, {
        foo: { type: oracledb.STRING, val: param1 },
        var: { type: oracledb.NUMBER, val: Number(param2) }
    });
    return res.status(code).json({ success, data, message });
};

const controllerFuncExecute = async (req, res) => {
    const someData = req.body
    const queryString = queryInsert();
    const { success, data, message, code } = await execute(queryString,{
        a: { type: oracledb.STRING, val: someData.value1 },
        b: { type: oracledb.NUMBER, val: Number(someData.value2) }
    });
    return res.status(code).json({ success, data, message });
};

module.exports = { index, controllerFuncSelect, controllerFuncExecute }