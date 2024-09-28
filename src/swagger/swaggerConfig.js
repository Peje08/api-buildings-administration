const YAML = require('yamljs')

const userDoc = YAML.load('src/swagger/user.yaml')
const administrationDoc = YAML.load('src/swagger/administration.yaml')
const baseDoc = YAML.load('src/swagger/index.yaml')

const swaggerDocument = {
	...baseDoc,
	paths: {
		...userDoc.paths,
		...administrationDoc.paths
	},
	components: {
		...baseDoc.components
	}
}

module.exports = swaggerDocument
