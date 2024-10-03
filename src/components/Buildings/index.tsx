import { VStack, HStack, Button } from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import StreetInput from './StreetInput'
import TowerAccordion from './TowerAccordion'
import ActionButtons from './ActionButtons'
import BuildingNumberInput from './NumberInputField'
import { useSelector, useDispatch } from 'react-redux'
import {
	addTower,
	removeTower,
	duplicateTower,
	updatePisos,
	updateLocalChecked,
	updatePisosIguales,
	updateIsLetras
} from '../../redux/towerSlice'
import { strings } from 'constants/strings'
import { RootState } from 'store/store'

const BuildingConfiguration: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
	const towers = useSelector((state: RootState) => state.towers.towers)
	const dispatch = useDispatch()

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
			overflowY={'scroll'}
			maxH={650}
		>
			<HStack width='90%' spacing={8}>
				<StreetInput />
				<BuildingNumberInput />
			</HStack>

			{/* Renderizamos los acordeones de las torres */}
			{towers.map((tower, index) => (
				<VStack key={index} width='100%' spacing={2}>
					<TowerAccordion
						towerName={`Torre ${index + 1}`}
						pisos={tower.pisos}
						handlePisosChange={(value) =>
							dispatch(updatePisos({ index, pisos: value }))
						}
						localChecked={tower.localChecked}
						setLocalChecked={(value) =>
							dispatch(updateLocalChecked({ index, localChecked: value }))
						}
						pisosIguales={tower.pisosIguales}
						setPisosIguales={(value) =>
							dispatch(updatePisosIguales({ index, pisosIguales: value }))
						}
						isLetras={tower.isLetras}
						setIsLetras={(value) =>
							dispatch(updateIsLetras({ index, isLetras: value }))
						}
						pisosValues={tower.pisosValues}
						handlePisoChange={() => {}}
						onRemoveTower={() => dispatch(removeTower(index))} 
						showRemoveButton={index > 0} 
					/>

					<HStack>
						<Button
							colorScheme='teal'
							onClick={() => dispatch(duplicateTower(index))}
							size={'sm'}
						>
							{strings.duplicateTower} {index + 1}
						</Button>

						{index > 0 && (
							<Button
								colorScheme='red'
								onClick={() => dispatch(removeTower(index))}
								size={'sm'}
							>
								{strings.removeTower}
							</Button>
						)}
					</HStack>
				</VStack>
			))}

			{/* Botones para duplicar/agregar torres */}
			<ActionButtons onCancel={onCancel} onAddTower={() => dispatch(addTower())} />
		</VStack>
	)
}

export default BuildingConfiguration
