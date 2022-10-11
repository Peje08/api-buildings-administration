const oracledb = require('oracledb');
const { select } = require('../db_config/oracledb-wrapper');
const { query } = require('../querys');

const index = ({ res }) => res.status(200).json({ code: 200, message: 'Welcome to API Template Nodejs Prefix' });

const controllerFunc = async (req, res) => {
    const { param1, param2 } = req.params
    const queryString = query();
    const { success, data, message, code } = await select(queryString, {
        foo: { type: oracledb.STRING, val: param1 },
        var: { type: oracledb.NUMBER, val: Number(param2) }
    });
    return res.status(code).json({ success, data, message });
};

module.exports = { index, controllerFunc }