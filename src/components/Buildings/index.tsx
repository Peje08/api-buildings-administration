import { useState } from 'react'
import { VStack, HStack } from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import StreetInput from './StreetInput'
import TowerAccordion from './TowerAccordion'
import ActionButtons from './ActionButtons'
import BuildingNumberInput from './NumberInputField'

interface BuildingConfigurationProps {
	onCancel: () => void
}

const BuildingConfiguration: React.FC<BuildingConfigurationProps> = ({ onCancel }) => {
	const [localChecked, setLocalChecked] = useState(false)
	const [pisos, setPisos] = useState(0)
	const [isLetras, setIsLetras] = useState(false)
	const [pisosIguales, setPisosIguales] = useState(false)
	const [pisosValues, setPisosValues] = useState<string[]>(Array(3).fill(''))

	const handlePisoChange = (value: string, index: number) => {
		if (pisosIguales && index === 0) {
			const newValues = Array(pisos).fill(value)
			setPisosValues(newValues)
		} else {
			const newValues = [...pisosValues]
			newValues[index] = value
			setPisosValues(newValues)
		}
	}

	const handlePisosChange = (value: number) => {
		setPisos(value)
		setPisosValues(Array(value).fill(''))
	}

	return (
		<VStack
			spacing={6}
			align='center'
			width='100%'
			p={15}
			bg={colors.inputBackground}
			border='1px'
			borderColor={colors.verticalDivider}
			borderRadius='4px'
		>
			<HStack width='90%' spacing={8}>
				<StreetInput />
				<BuildingNumberInput />
			</HStack>

			{/* Acordeón de la Torre 1 */}
			<TowerAccordion
				pisos={pisos}
				handlePisosChange={handlePisosChange}
				localChecked={localChecked}
				setLocalChecked={setLocalChecked}
				pisosIguales={pisosIguales}
				setPisosIguales={setPisosIguales}
				isLetras={isLetras}
				setIsLetras={setIsLetras}
				pisosValues={pisosValues}
				handlePisoChange={handlePisoChange}
			/>

			<ActionButtons onCancel={onCancel} />
		</VStack>
	)
}

export default BuildingConfiguration
