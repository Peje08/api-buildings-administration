const YAML = require('yamljs')

const userDoc = YAML.load('src/swagger/user.yaml')
const administrationDoc = YAML.load('src/swagger/administration.yaml')
const planDoc = YAML.load('src/swagger/plan.yaml')
const buildingDoc = YAML.load('src/swagger/building.yaml')
const towerDoc = YAML.load('src/swagger/tower.yaml')
const functionalUnitDoc = YAML.load('src/swagger/functionalUnit.yaml')
const documentDoc = YAML.load('src/swagger/document.yaml')
const baseDoc = YAML.load('src/swagger/index.yaml')

const swaggerDocument = {
	...baseDoc,
	paths: {
		...userDoc.paths,
		...administrationDoc.paths,
		...planDoc.paths,
		...buildingDoc.paths,
		...towerDoc.paths,
		...functionalUnitDoc.paths,
		...documentDoc.paths
	},
	components: {
		...baseDoc.components
	}
}

module.exports = swaggerDocument
