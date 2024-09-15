const { port } = require('./globalConfig')
const expressServer = require('./express')
require('./db_config/db')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const server = expressServer.listen(port, () => console.log(`🚀 Server running on port ${port}`))

module.exports = { server }
