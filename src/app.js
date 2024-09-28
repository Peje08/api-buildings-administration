const PORT = process.env.PORT || 4000
const expressServer = require('./express')
require('./db_config/db')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const server = expressServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

module.exports = { server }
