import React, { useState } from 'react'
import { VStack, Input, Button, HStack, Text, useToast } from '@chakra-ui/react'
import { strings } from '../../constants/strings'
import { useNavigate } from 'react-router-dom'
import { handleLogin } from '../../utils/authUtils'

interface LoginFormProps {
  onRegisterClick: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  // Función para iniciar sesión al presionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit() // Llamamos a la función de submit cuando se presiona Enter
    }
  }

  const handleSubmit = async () => {
    await handleLogin({ email, password }, setLoading, toast, navigate)
  }

  return (
    <VStack spacing={4} width="100%">
      {/* Input predictivo para email */}
      <Input
        list="email-options" // Agregamos datalist para opciones predictivas
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown} // Detectamos la tecla Enter
        type="email"
      />
      <datalist id="email-options">
        <option value="user1@example.com" />
        <option value="user2@example.com" />
        <option value="test@example.com" />
        {/* Agrega más opciones si lo deseas */}
      </datalist>

      <Input
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown} // Detectamos la tecla Enter
        type="password"
      />
      <Button
        colorScheme="teal"
        width="100%"
        onClick={handleSubmit}
        isLoading={loading}
        isDisabled={!email || !password || loading}
      >
        {strings.login}
      </Button>
      <HStack>
        <Text>{strings.dontHaveUser}</Text>
        <Button variant="link" color="teal.500" onClick={onRegisterClick}>
          {strings.register}
        </Button>
      </HStack>
    </VStack>
  )
}

export default LoginForm
