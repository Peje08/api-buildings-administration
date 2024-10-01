import React from 'react';
import { VStack, Input, Button, HStack, Text } from '@chakra-ui/react';
import { strings } from '../../constants/strings';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  return (
    <VStack spacing={4} width="100%">
      <Input placeholder="Usuario o Email" />
      <Input placeholder="Contraseña" type="password" />
      <Button colorScheme="teal" width="100%">
        {strings.login}
      </Button>
      <HStack>
        <Text>{strings.dontHaveUser}</Text>
        <Button variant="link" color="teal.500" onClick={onRegisterClick}>
          {strings.register}
        </Button>
      </HStack>
    </VStack>
  );
};

export default LoginForm;
