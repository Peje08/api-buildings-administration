import React from 'react'
import { HStack, Button, Icon } from '@chakra-ui/react'
import { FaClone, FaPlus } from 'react-icons/fa'
import { strings } from '../../constants/strings'

interface ActionButtonsProps {
  onCancel: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel }) => {
  return (
    <>
      {/* Botones para Duplicar y Agregar Torre */}
      <HStack spacing={4} mt={4}>
        <Button
          leftIcon={<Icon as={FaClone} />}
          colorScheme="teal"
          variant="outline"
        >
          {strings.duplicateTower}
        </Button>
        <Button
          leftIcon={<Icon as={FaPlus} />}
          colorScheme="teal"
          variant="solid"
        >
          {strings.addTower}
        </Button>
      </HStack>

      {/* Botones de Aceptar y Cancelar */}
      <HStack spacing={4} mt={4}>
        <Button colorScheme="teal">{strings.accept}</Button>
        <Button colorScheme="teal" onClick={onCancel}>
          {strings.cancel}
        </Button>
      </HStack>
    </>
  )
}

export default ActionButtons
