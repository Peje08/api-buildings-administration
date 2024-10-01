import React from 'react'
import { Flex, Text, NumberInput, NumberInputField } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

const BuildingNumberInput: React.FC = () => {
  return (
    <Flex align="center" width="100%">
      <Text width="30%">{strings.number}</Text>
      <NumberInput width="70%" isRequired aria-required="true">
        <NumberInputField placeholder={strings.enterNumber} />
      </NumberInput>
    </Flex>
  )
}

export default BuildingNumberInput
