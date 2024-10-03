import { HStack, Button, Icon } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import { strings } from '../../constants/strings'

interface ActionButtonsProps {
	onCancel: () => void
	onAddTower: () => void
	onAccept: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, onAddTower, onAccept }) => {
	return (
		<>
			<HStack spacing={4} mt={4}>
				<Button
					leftIcon={<Icon as={FaPlus} />}
					colorScheme='teal'
					variant='outline'
					onClick={onAddTower}
					size={'sm'}
				>
					{strings.addTower}
				</Button>
			</HStack>

			{/* Botones de Aceptar y Cancelar */}
			<HStack spacing={4} mt={4}>
				<Button colorScheme='teal' onClick={onAccept}>
					{strings.accept}
				</Button>
				<Button colorScheme='teal' onClick={onCancel}>
					{strings.cancel}
				</Button>
			</HStack>
		</>
	)
}

export default ActionButtons
