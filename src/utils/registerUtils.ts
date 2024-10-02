import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { NavigateFunction } from 'react-router-dom'
import { RegisterData } from '../api/userApi'

export const handleRegister = async (
  formData: RegisterData,
  setLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>,
  navigate: NavigateFunction
) => {
  setLoading(true)
  console.log('Data to be sent:', formData)
  try {
    // Llamamos a la función `registerUser` que hemos separado
    const response = await axios.post(
      'https://api-buildings-administration.onrender.com/api/user/register',
      {
        name: formData.name,
        lastname: formData.lastname || 'Hipermegared',
        email: formData.email,
        password: formData.password,
        cellularNumer: '1111111',
        type: formData.type || 'ADMINISTRATION',
      }
    )
    console.log('API Response:', response.data)
    // Si el registro es exitoso
    toast({
      title: 'Registro exitoso',
      description: 'Usuario registrado con éxito.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })

    navigate('/login')

    return response.data
  } catch (error) {
    let errorMessage = 'Hubo un problema al registrar el usuario.'

    // Verificamos si el error es una instancia de AxiosError
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data)
      errorMessage =
        error.response?.data?.message || error.message || 'Error desconocido'
    }

    // Mostrar más detalles en el toast
    toast({
      title: 'Error en el registro',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  } finally {
    setLoading(false)
  }
}
