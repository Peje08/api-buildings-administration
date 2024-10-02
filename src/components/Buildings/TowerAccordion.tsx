import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Box,
	HStack,
	Text,
	NumberInput,
	NumberInputField,
	Checkbox,
	Switch,
	VStack,
	Button
} from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import { strings } from '../../constants/strings'
import { FaTrash } from 'react-icons/fa'

interface TowerAccordionProps {
	towerName: string
	pisos: number
	localChecked: boolean
	setLocalChecked: (value: boolean) => void
	pisosIguales: boolean
	setPisosIguales: (value: boolean) => void
	isLetras: boolean
	setIsLetras: (value: boolean) => void
	pisosValues: string[]
	handlePisoChange: (value: string, index: number) => void
	handlePisosChange: (value: number) => void
	onRemoveTower: () => void
	showRemoveButton: boolean
}

const TowerAccordion: React.FC<TowerAccordionProps> = ({
	towerName,
	pisos,
	handlePisosChange,
	localChecked,
	setLocalChecked,
	pisosIguales,
	setPisosIguales,
	isLetras,
	setIsLetras,
	pisosValues,
	handlePisoChange,
	onRemoveTower,
	showRemoveButton
}) => {
	return (
		<Accordion allowToggle width='95%'>
			<AccordionItem overflowY={'scroll'} maxH={450}>
				<h2>
					<AccordionButton _expanded={{ bg: colors.badge, color: 'white' }}>
						<Box flex='1' textAlign='left'>
							<Text fontWeight='bold'>{towerName}</Text>
						</Box>
						<AccordionIcon />
					</AccordionButton>
				</h2>
				<AccordionPanel pb={4}>
					{/* Piso, Local, Pisos Iguales, y Letras/Números */}
					<HStack width='100%' spacing={6} alignItems='center' mb={4}>
						<HStack>
							<Text>{strings.floors}</Text>
							<NumberInput
								min={0}
								max={100}
								value={pisos}
								onChange={(_, valueAsNumber) => handlePisosChange(valueAsNumber)}
								width='50%'
								isRequired
								aria-required='true'
							>
								<NumberInputField />
							</NumberInput>
						</HStack>

						<HStack>
							<Checkbox
								isChecked={localChecked}
								onChange={(e) => setLocalChecked(e.target.checked)}
							>
								{strings.premise}
							</Checkbox>
						</HStack>

						<HStack>
							<Checkbox
								isChecked={pisosIguales}
								onChange={(e) => setPisosIguales(e.target.checked)}
							>
								{strings.sameFloors}
							</Checkbox>
						</HStack>

						<HStack>
							<Text>{strings.letters}</Text>
							<Switch isChecked={isLetras} onChange={() => setIsLetras(!isLetras)} />
							<Text>{strings.numbers}</Text>
						</HStack>
					</HStack>

					{/* Fila de Local si el checkbox está marcado */}
					{localChecked && (
						<HStack width='100%' alignItems='center' mb={4}>
							<Text width='10%'>{strings.premise}</Text>
							<NumberInput width='20%' isRequired aria-required='true'>
								<NumberInputField />
							</NumberInput>
						</HStack>
					)}

					{/* Planta Baja */}
					<HStack width='100%' alignItems='center' mb={4}>
						<Text width='10%'>{strings.groundFloor}</Text>
						<NumberInput width='20%' isRequired aria-required='true'>
							<NumberInputField />
						</NumberInput>
					</HStack>

					{/* Mostrar inputs de pisos según la cantidad seleccionada */}
					<VStack width='100%' align='start' spacing={4}>
						{/* Si el valor de pisos es mayor a 0, generar los inputs */}
						{pisos > 0 &&
							Array.from({ length: pisos }).map((_, index) => (
								<HStack key={index} width='100%' alignItems='center' mb={4}>
									<Text width='10%'>
										{strings.floor} {index + 1}
									</Text>
									<NumberInput
										value={pisosValues[index]}
										onChange={(valueString) =>
											handlePisoChange(valueString, index)
										}
										isDisabled={pisosIguales && index >= 1}
										width='20%'
										isRequired
										aria-required='true'
									>
										<NumberInputField />
									</NumberInput>
								</HStack>
							))}
					</VStack>

					{/* Mostrar botón de eliminar solo si es Torre 2 en adelante */}
					{showRemoveButton && (
						<Button
							mt={4}
							colorScheme='red'
							leftIcon={<FaTrash />}
							onClick={onRemoveTower}
							alignSelf='flex-end'
						>
							{strings.removeTower}
						</Button>
					)}
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	)
}

export default TowerAccordion
