import { VStack, Button, Flex, Icon } from '@chakra-ui/react'
import { FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom' 
import { colors } from '../../constants/colors'
import { strings } from '../../constants/strings'
import { handleLogout } from '../../utils/authUtils' 

const Sidebar: React.FC = () => {
  const navigate = useNavigate() 

  return (
    <VStack
      as="aside"
      align="flex-start"
      p={4}
      bg={colors.adminBackground}
      borderRight="2px"

      borderColor={colors.verticalDivider}
      spacing={8}
      width="15%"
      justifyContent="space-between"
    >
      <Flex flex="1" justifyContent="flex-end" alignSelf="stretch">
        {/* Cerrar Sesión */}
        <Button
          leftIcon={<Icon as={FaSignOutAlt} />}
          colorScheme="teal"
          variant="outline"
          width="100%"
          alignSelf="flex-end"
          onClick={() => handleLogout(navigate)} 
        >
          {strings.logout}
        </Button>
      </Flex>
    </VStack>
  )
}

export default Sidebar
