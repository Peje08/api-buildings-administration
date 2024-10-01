import React from 'react'
import { VStack, Button, Flex, Icon } from '@chakra-ui/react'
import { FaSignOutAlt } from 'react-icons/fa'
import { colors } from '../../constants/colors'
import { strings } from '../../constants/strings'

const Sidebar: React.FC = () => {
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
        <Button
          leftIcon={<Icon as={FaSignOutAlt} />}
          colorScheme="teal"
          variant="outline"
          width="100%"
          alignSelf="flex-end"
        >
          {strings.logout}
        </Button>
      </Flex>
    </VStack>
  )
}

export default Sidebar
