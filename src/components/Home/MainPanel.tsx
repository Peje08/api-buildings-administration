import React from 'react'
import { Flex, Button, Icon } from '@chakra-ui/react'
import { FaPen } from 'react-icons/fa'
import { strings } from '../../constants/strings'

const MainPanel: React.FC = () => {
  return (
    <Flex flex="1" justify="center" align="center">
      <Button
        leftIcon={<Icon as={FaPen} />}
        colorScheme="teal"
        size="lg"
        variant="solid"
      >
        {strings.setBuilding}
      </Button>
    </Flex>
  )
}

export default MainPanel
