
exports.isEmptyOrNull = (str) => {
    if (typeof str !== "string") {
        return false;
    }
    return str === null || str === undefined || str.trim() === "";
}
