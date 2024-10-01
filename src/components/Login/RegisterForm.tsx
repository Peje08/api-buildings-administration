import React from 'react'
import {
  VStack,
  Input,
  Button,
  HStack,
  Text,
  FormControl,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/react'
import { strings } from '../../constants/strings'
import { useFormHandler } from '../../utils/useFormHandler'

interface RegisterFormProps {
  onCancelClick: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onCancelClick }) => {
  const { formData, errors, handleChange } = useFormHandler()

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
            {40 - formData.username.length} {strings.remainingCharacters}
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
          isDisabled={!!errors.email || !!errors.password}
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
