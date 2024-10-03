export interface Tower {
	pisos: number
	localChecked: boolean
	pisosIguales: boolean
	isLetras: boolean
	pisosValues: string[]
}

// Función para agregar una nueva torre
export const addTower = (towers: Tower[]): Tower[] => {
	return [
		...towers,
		{
			pisos: 0,
			localChecked: false,
			pisosIguales: false,
			isLetras: false,
			pisosValues: []
		}
	]
}

// Función para eliminar una torre
export const removeTower = (towers: Tower[], index: number): Tower[] => {
	if (towers.length > 1) {
		return towers.filter((_, i) => i !== index)
	}
	return towers
}

// Función para actualizar el número de pisos de una torre específica
export const updatePisos = (towers: Tower[], value: number, index: number): Tower[] => {
	const updatedTowers = [...towers]
	updatedTowers[index].pisos = value
	return updatedTowers
}

// Función para actualizar el estado de localChecked de una torre específica
export const updateLocalChecked = (towers: Tower[], value: boolean, index: number): Tower[] => {
	const updatedTowers = [...towers]
	updatedTowers[index].localChecked = value
	return updatedTowers
}

// Función para actualizar el estado de pisosIguales de una torre específica
export const updatePisosIguales = (towers: Tower[], value: boolean, index: number): Tower[] => {
	const updatedTowers = [...towers]
	updatedTowers[index].pisosIguales = value
	return updatedTowers
}

// Función para actualizar el estado de isLetras de una torre específica
export const updateIsLetras = (towers: Tower[], value: boolean, index: number): Tower[] => {
	const updatedTowers = [...towers]
	updatedTowers[index].isLetras = value
	return updatedTowers
}

// Función para actualizar los valores de las unidades funcionales
export const updatePisoValues = (
	towers: Tower[],
	value: string,
	index: number,
	towerIndex: number
): Tower[] => {
	const updatedTowers = [...towers]
	const pisosValues = [...updatedTowers[towerIndex].pisosValues]
	pisosValues[index] = value
	updatedTowers[towerIndex].pisosValues = pisosValues
	return updatedTowers
}

// Función para duplicar una torre
export const duplicateTower = (towers: Tower[], index: number): Tower[] => {
	const towerToDuplicate = towers[index]
	return [
		...towers,
		{
			...towerToDuplicate, 
			pisosValues: [...towerToDuplicate.pisosValues] 
		}
	]
}
