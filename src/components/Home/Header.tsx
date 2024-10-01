import React from 'react'
import { Flex, HStack, Heading, Text } from '@chakra-ui/react'
import { ReactSVG } from 'react-svg'
import { icons } from '../../constants/icons'
import { colors } from '../../constants/colors'
import { strings } from '../../constants/strings'

const Header: React.FC = () => {
  return (
    <Flex
      as="header"
      justifyContent="space-between"
      alignItems="center"
      bg={colors.adminBackground}
      borderBottom="2px"
      borderColor={colors.verticalDivider}
      height="64px"
    >
      <HStack>
        <ReactSVG src={icons.cabildo} />
        <Heading size="md">{strings.cabildo}</Heading>
      </HStack>

      <Text color="red.500" fontSize="sm">
        Tu período de prueba termina en 25 días
      </Text>
    </Flex>
  )
}

export default Header
