import React from 'react'
import { Badge, HStack, Text, Icon } from '@chakra-ui/react'
import { FaBuilding } from 'react-icons/fa'
import { colors } from '../../constants/colors'

const AdministrationBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Badge
      bg={colors.badge}
      p={2}
      borderRadius="4px"
      minWidth="150px"
      maxWidth="100%"
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
          {name}
        </Text>
      </HStack>
    </Badge>
  )
}

export default AdministrationBadge
