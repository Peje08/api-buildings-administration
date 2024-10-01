import React from 'react'
import {
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { FaBuilding, FaSignOutAlt, FaPen } from 'react-icons/fa'
import { strings } from '../../constants/strings'
import { icons } from '../../constants/icons'
import { ReactSVG } from 'react-svg'
import { colors } from '../../constants/colors'

const Home: React.FC = () => {
  return (
    <Flex direction="column" height="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        bg={colors.adminBackground}
        borderBottom="2px"
        borderColor={colors.verticalDivider}
        height="64px"
      >
        {/* Logo y Nombre */}
        <HStack>
          <ReactSVG src={icons.cabildo} />
          <Heading size="md">{strings.cabildo}</Heading>
        </HStack>

        {/* Advertencia de período de prueba */}
        <Text color="red.500" fontSize="sm">
          Tu período de prueba termina en 25 días
        </Text>
      </Flex>

      {/* Administración */}
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        bg={colors.adminBackground}
        borderBottom="2px"
        borderColor={colors.verticalDivider}
        height="64px"
      >
        <Badge
          bg={colors.badge}
          p={2}
          borderRadius="4px"
          minWidth="150px" // Mínimo ancho para el Badge
          maxWidth="100%" // Limita el ancho máximo
        >
          <HStack>
            <Icon as={FaBuilding} boxSize={6} fill={colors.badgeColorText} />
            <Text
              fontSize="lg"
              textAlign="right"
              fontWeight="600"
              textTransform="none"
              color={colors.badgeColorText}
              whiteSpace="normal"
              wordBreak="break-word"
            >
              Administración Pepito Cibrián S.A.
            </Text>
          </HStack>
        </Badge>
      </Flex>

      <Flex flex="1">
        {/* Panel izquierdo */}
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
          {/* Aseguramos que el botón esté al final */}
          <Flex flex="1" justifyContent="flex-end" alignSelf="stretch">
            {/* Cerrar Sesión */}
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

        {/* Panel central */}
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
      </Flex>
    </Flex>
  )
}

export default Home
