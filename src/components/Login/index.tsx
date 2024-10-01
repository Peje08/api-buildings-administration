import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import AuthContainer from './AuthContainer';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => setIsRegistering(true);
  const handleCancelClick = () => setIsRegistering(false);

  return (
    <Flex
      direction="row"
      justify="center"
      align="center"
      height="100vh"
      bg="gray.50"
    >
      <Box
        width="60%"
        height="500px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        display="flex"
        flexDirection="row"
        boxShadow="md"
      >
        {/* Contenedor con texto e icono */}
        <AuthContainer />

        {/* Formulario: Login o Registro según el estado */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          width="50%"
          padding="8"
        >
          {isRegistering ? (
            <RegisterForm onCancelClick={handleCancelClick} />
          ) : (
            <LoginForm onRegisterClick={handleRegisterClick} />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default LoginPage;
