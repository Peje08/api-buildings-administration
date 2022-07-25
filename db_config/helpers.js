const camelCase = require("lodash/camelCase");

const camelizeKeys = obj => {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [camelCase(key)]: camelizeKeys(obj[key])
            }),
            {}
        );
    }
    return obj;
};

const logConsole = msg =>
    console.log(
        `Date: ${new Date()} -  ${JSON.stringify(
            msg,
            Object.getOwnPropertyNames(msg)
        )}`
    );

module.exports = { camelizeKeys, logConsole };
