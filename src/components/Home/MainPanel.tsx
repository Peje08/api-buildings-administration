import React, { useState } from 'react'
import { Flex, Button, Icon } from '@chakra-ui/react'
import { FaPen } from 'react-icons/fa'
import { strings } from '../../constants/strings'
import BuildingConfiguration from '../Buildings'

const MainPanel: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false)

  // Manejar la acción de Cancelar desde BuildingConfiguration
  const handleCancel = () => {
    setIsConfiguring(false)
  }

  return (
    <Flex flex="1" justify="center" align="center">
      {isConfiguring ? (
        // Si se está configurando, mostrar el componente de configuración
        <BuildingConfiguration onCancel={handleCancel} />
      ) : (
        // Si no se está configurando, mostrar el botón de "Configurar Edificio"
        <Button
          leftIcon={<Icon as={FaPen} />}
          colorScheme="teal"
          size="lg"
          variant="solid"
          onClick={() => setIsConfiguring(true)}
        >
          {strings.setBuilding}
        </Button>
      )}
    </Flex>
  )
}

export default MainPanel
