import { useState } from 'react'
import { Flex, Button, Icon } from '@chakra-ui/react'
import { FaPen } from 'react-icons/fa'
import { strings } from '../../constants/strings'
import BuildingConfiguration from '../Buildings'
import { colors } from '../../constants/colors'

const MainPanel: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false)

  // Manejar la acción de Cancelar desde BuildingConfiguration
  const handleCancel = () => {
    setIsConfiguring(false)
  }

  return (
    <Flex
      flex="1"
      justify="center"
      align="center"
      width="100%"
      height="100%"
      bg={colors.adminBackground}
      position={'relative'}
    >
      {isConfiguring ? (
        <Flex
          width="100%"
          maxWidth="1200px"
          height="100%" // Mantener la altura al 100% del panel
          flexDirection="column"
          p={'1rem'}
        >
          <BuildingConfiguration onCancel={handleCancel} />
        </Flex>
      ) : (
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
