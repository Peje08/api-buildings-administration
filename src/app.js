const { port } = require('./globalConfig');
const expressServer = require('./express');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

expressServer.listen(port, () => console.log(`Server running on port ${port}`));
