import React, { useState } from 'react'
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
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom' // Importar useNavigate para la redirección
import { strings } from '../../constants/strings'
import { useFormHandler } from '../../utils/useFormHandler'
import { handleRegister } from '../../utils/registerUtils' // Importamos la función desde utils

interface RegisterFormProps {
  onCancelClick: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onCancelClick }) => {
  const { formData, errors, handleChange } = useFormHandler()
  const [loading, setLoading] = useState(false) // Estado de carga
  const toast = useToast() // Para notificaciones
  const navigate = useNavigate() // Instanciamos useNavigate para redirigir

  const handleSubmit = async () => {
    console.log('Handling register submit...')
    await handleRegister(
      {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      },
      setLoading,
      toast,
      navigate // Pasamos navigate a la función handleRegister
    )
  }

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
        {errors.password && (
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        )}
      </FormControl>

      <HStack spacing={4} width="100%">
        <Button
          colorScheme="teal"
          width="100%"
          onClick={handleSubmit} // Llamamos a la función de registro
          isLoading={loading} // Muestra el spinner de carga si está cargando
          isDisabled={!!errors.email || !!errors.password || loading} // Deshabilita si hay errores o si está cargando
        >
          {strings.accept}
        </Button>
        <Button onClick={onCancelClick} colorScheme="gray" width="100%">
          {strings.cancel}
        </Button>
      </HStack>
    </VStack>
  )
}

export default RegisterForm
