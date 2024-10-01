import React, { useState } from 'react';
import {
  VStack,
  Input,
  Button,
  HStack,
  Text,
  FormControl,
  FormErrorMessage,
  Flex,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { strings } from '../../constants/strings';
import { useFormHandler } from '../../utils/useFormHandler';

interface RegisterFormProps {
  onCancelClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onCancelClick }) => {
  const { formData, errors, handleChange } = useFormHandler();
  const [loading, setLoading] = useState(false); // Estado de carga
  const toast = useToast(); // Para notificaciones

  // Función para manejar el registro
  const handleRegister = async () => {
    setLoading(true);
    console.log("Data to be sent:", formData);  // Verificar los valores enviados
    try {
      const response = await axios.post(
        'https://api-buildings-administration.onrender.com/api/user/register',
        {
          name: formData.username, // El input "username" llena "name"
          email: formData.email,   // El input "email" llena "email"
          password: formData.password, // El input "password" llena "password"
        }
      );
  
      // Aquí puedes utilizar `response.data` si es necesario
      console.log('API Response:', response.data);
  
      // Si el registro es exitoso
      toast({
        title: 'Registro exitoso',
        description: 'Usuario registrado con éxito.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Redirigir o hacer otra acción con `response.data` si lo necesitas
      // Por ejemplo, redirigir al dashboard:
      // navigate('/dashboard'); 
  
    } catch (error) {
      let errorMessage = 'Hubo un problema al registrar el usuario.';
  
      // Verificamos si el error es una instancia de AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data); // Mostrar más detalles en la consola
        errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      }
  
      // Mostrar más detalles en el toast
      toast({
        title: 'Error en el registro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <VStack spacing={4} width="100%">
      {/* Campo Usuario con contador descendente */}
      <FormControl>
        <Input
          placeholder={strings.user}
          maxLength={30}
          value={formData.username}
          name="username"
          onChange={handleChange}
        />
        <Flex justify="flex-end">
          <Text fontSize="sm" color="gray.500">
            {30 - formData.username.length} {strings.remainingCharacters}
          </Text>
        </Flex>
      </FormControl>

      {/* Campo Mail con validación */}
      <FormControl isInvalid={errors.email !== ''}>
        <Input
          placeholder={strings.mail}
          type="email"
          value={formData.email}
          name="email"
          onChange={handleChange}
        />
        {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
      </FormControl>

      {/* Campo Clave */}
      <FormControl>
        <Input
          placeholder={strings.password}
          type="password"
          value={formData.password}
          name="password"
          onChange={handleChange}
        />
      </FormControl>

      {/* Campo Confirmar Clave con validación */}
      <FormControl isInvalid={errors.password !== ''}>
        <Input
          placeholder={strings.confirmPassword}
          type="password"
          value={formData.confirmPassword}
          name="confirmPassword"
          onChange={handleChange}
        />
        {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
      </FormControl>

      <HStack spacing={4} width="100%">
        <Button
          colorScheme="teal"
          width="100%"
          onClick={handleRegister}  // Llamamos a la función de registro
          isLoading={loading}        // Muestra el spinner de carga si está cargando
          isDisabled={!!errors.email || !!errors.password || loading}  // Deshabilita si hay errores o si está cargando
        >
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
