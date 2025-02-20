const { createLogger, format, transports } = require('winston')

// Configuración de colores para cada nivel de log
const logColors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	debug: 'blue'
}

const colorizeUser = (user) => `\x1b[35m${user}\x1b[0m`

require('winston').addColors(logColors)

const logger = createLogger({
	level: 'debug',
	format: format.combine(
		format.colorize(),
		format.printf(({ level, message }) => {
			return `[${level}]: ${message}`
		})
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(({ level, message }) => {
					return `[${level}]: ${message}`
				})
			)
		})
	]
})

logger.logUserAction = (message, user) => {
	logger.info(`${message} by user ${colorizeUser(user)}`)
}

module.exports = logger
