import axios from 'axios'

export interface RegisterData {
  name: string
  lastname?: string
  email: string
  password: string
  cellularNumber?: string
  type?: string
}

// Función para registrar un usuario
export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(
    'https://api-buildings-administration.onrender.com/api/user/register',
    {
      name: data.name,
      lastname: data.lastname || 'Hipermegared',
      email: data.email,
      password: data.password,
      cellularNumber: data.cellularNumber || '1111111',
      type: data.type || 'ADMINISTRATION',
    }
  )
  return response.data
}
