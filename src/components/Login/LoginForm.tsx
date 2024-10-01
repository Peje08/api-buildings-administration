import React from 'react';
import { VStack, Input, Button, Link, HStack, Text } from '@chakra-ui/react';
import { strings } from '../../constants/strings';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  return (
    <VStack spacing={4} width="100%">
      <Input placeholder="Usuario o Mail" />
      <Input type="password" placeholder="Clave" />
      <Link alignSelf="flex-start" color="teal.500" href="#">
        {strings.forgotPassword}
      </Link>
      <Button colorScheme="teal" width="100%">
        {strings.accept}
      </Button>
      <HStack spacing={1}>
        <Text>{strings.dontHaveUser}</Text>
        <Link color="teal.500" onClick={onRegisterClick}>
          {strings.clickHere}
        </Link>
      </HStack>
    </VStack>
  );
};

export default LoginForm;
