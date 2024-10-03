import { Flex, Text, Input } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

interface StreetInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StreetInput: React.FC<StreetInputProps> = ({ value, onChange }) => {
  return (
    <Flex align="center" width="100%">
      <Text width="10%" fontWeight={'bold'}>{strings.street}</Text>
      <Input
        placeholder={strings.enterStreet}
        width="90%"
        isRequired
        aria-required="true"
        value={value} // Ahora acepta el valor del input
        onChange={onChange} // Ahora acepta el evento onChange
      />
    </Flex>
  );
}

export default StreetInput;
