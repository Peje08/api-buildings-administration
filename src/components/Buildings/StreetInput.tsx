import React from 'react'
import { Flex, Text, Input } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

const StreetInput: React.FC = () => {
  return (
    <Flex align="center" width="100%">
      <Text width="10%" fontWeight={'bold'}>{strings.street}</Text>
      <Input
        placeholder={strings.enterStreet}
        width="90%"
        isRequired
        aria-required="true"
      />
    </Flex>
  )
}

export default StreetInput
