const dotenv = require("dotenv");
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "dev";
const isDevEnv = process.env.NODE_ENV === "dev";

module.exports = {
    port: process.env.PORT || 8080,
    env: process.env.NODE_ENV || "dev",
    db: {
        username: isDevEnv ? "PEC" : process.env.DBCP_PROD_PEC_NODE_USERNAME,
        password: isDevEnv
            ? "Claro2015"
            : process.env.DBCP_PROD_PEC_NODE_PASSWORD,
        schema: null,
        connectString: isDevEnv
            ? "bengolea.claro.amx:1521/ARDPROD.WORLD"
            : process.env.DBCP_PROD_PEC_NODE_URL
    }
};
