const { logConsole } = require("./helpers");
const { db: credentials } = require("../globalConfig");
let oracledb;
let connectionPool;

//* create the connection pool with the proper dbParams
const createPool = async dbParams => {
    if (!connectionPool) {
        try {
            let username = dbParams.username || "";
            let password = dbParams.password || "";
            let connectString = dbParams.connectString || "";
            if (username === "" || password === "" || connectString === "")
                return false;

            oracledb = require("oracledb");
            const pool = await oracledb.createPool({
                user: username,
                password: password,
                connectString: connectString
            });
            connectionPool = pool;
            logConsole("Connection Pool created successfully");
            return true;
        } catch (error) {
            logConsole("Error creating pool - SOW:42");
            return false;
        }
    }
};

const getPool = async () => {
    await createPool(credentials);
    return connectionPool;
};

module.exports = { createPool, getPool };
