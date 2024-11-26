
exports.isEmptyOrNull = (str) => {
    if (typeof str !== "string") {
        return true;
    }
    return str === null || str === undefined || str.trim() === "";
}
