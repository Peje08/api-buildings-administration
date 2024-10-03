import { Flex, Text, NumberInput, NumberInputField } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

interface BuildingNumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuildingNumberInput: React.FC<BuildingNumberInputProps> = ({ value, onChange }) => {
  return (
    <Flex align="center" width="100%">
      <Text width="15%" fontWeight={'bold'}>{strings.number}</Text>
      <NumberInput width="90%" isRequired aria-required="true">
        <NumberInputField
          placeholder={strings.enterNumber}
          value={value} // Ahora acepta el valor del input
          onChange={onChange} // Ahora acepta el evento onChange
        />
      </NumberInput>
    </Flex>
  );
}

export default BuildingNumberInput;
