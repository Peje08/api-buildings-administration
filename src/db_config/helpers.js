const { camelCase, snakeCase } = require('lodash')

const formatTypes = {
	camelizeKeys: (obj) => {
		if (Array.isArray(obj)) {
			return obj.map((v) => formatTypes.camelizeKeys(v))
		} else if (obj != null && obj.constructor === Object) {
			return Object.keys(obj).reduce(
				(result, key) => ({
					...result,
					[camelCase(key)]: formatTypes.camelizeKeys(obj[key])
				}),
				{}
			)
		}
		return obj
	},
	snakelizeKeys: (obj) => {
		if (Array.isArray(obj)) {
			return obj.map((v) => formatTypes.snakelizeKeys(v))
		} else if (obj != null && obj.constructor === Object) {
			return Object.keys(obj).reduce(
				(result, key) => ({
					...result,
					[snakeCase(key)]: formatTypes.snakelizeKeys(obj[key])
				}),
				{}
			)
		}
		return obj
	}
}

const rowsFormat = (type, rows) => (formatTypes[type] ? formatTypes[type](rows) : rows)

const logConsole = (msg) =>
	console.log(`Date: ${new Date()} -  ${JSON.stringify(msg, Object.getOwnPropertyNames(msg))}`)

module.exports = { rowsFormat, logConsole }
