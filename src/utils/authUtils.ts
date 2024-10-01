import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { NavigateFunction } from 'react-router-dom'

interface LoginData {
  email: string
  password: string
}

export const handleLogin = async (
  loginData: LoginData,
  setLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>,
  navigate: NavigateFunction
) => {
  setLoading(true)
  try {
    const response = await axios.post(
      'https://api-buildings-administration.onrender.com/api/user/login',
      {
        email: loginData.email,
        password: loginData.password,
      }
    )

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('name', response.data.name)

      navigate('/home')
    } else {
      throw new Error('No se recibió un token')
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    toast({
      title: 'Error en el inicio de sesión',
      description: 'Credenciales incorrectas o servidor inaccesible.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  } finally {
    setLoading(false)
  }
}

export const handleLogout = (navigate: NavigateFunction) => {
  localStorage.removeItem('token')

  navigate('/login')
}
