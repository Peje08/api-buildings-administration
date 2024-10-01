import React from 'react'
import { Flex, Text, Input } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

const StreetInput: React.FC = () => {
  return (
    <Flex align="center" width="100%">
      <Text width="30%">{strings.street}</Text>
      <Input
        placeholder={strings.enterStreet}
        width="70%"
        isRequired
        aria-required="true"
      />
    </Flex>
  )
}

export default StreetInput
