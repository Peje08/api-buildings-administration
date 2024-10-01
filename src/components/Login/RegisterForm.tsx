import React from 'react';
import { VStack, Input, Button, HStack } from '@chakra-ui/react';
import { strings } from '../../constants/strings';

interface RegisterFormProps {
  onCancelClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onCancelClick }) => {
  return (
    <VStack spacing={4} width="100%">
      <Input placeholder="Usuario" />
      <Input placeholder="Mail" />
      <Input type="password" placeholder="Clave" />
      <Input type="password" placeholder="Confirmar clave" />
      <HStack spacing={4} width="100%">
        <Button colorScheme="teal" width="100%">
          {strings.accept}
        </Button>
        <Button onClick={onCancelClick} colorScheme="gray" width="100%">
          {strings.cancel}
        </Button>
      </HStack>
    </VStack>
  );
};

export default RegisterForm;
