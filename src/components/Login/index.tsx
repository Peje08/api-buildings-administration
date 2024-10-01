import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import AuthContainer from './AuthContainer';  // Este se mantiene siempre visible
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useNavigate, useLocation } from 'react-router-dom';  // Importamos hooks para manejar la navegación

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectamos si estamos en /register o /login
  const isRegistering = location.pathname === '/register';

  // Funciones para redirigir entre login y register
  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleCancelClick = () => {
    navigate('/login');
  };

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
        {/* El AuthContainer se mantiene siempre */}
        <AuthContainer />

        {/* Formulario: Login o Registro según la ruta */}
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
