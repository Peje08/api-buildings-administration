import { useState, useEffect } from 'react'
import { VStack, Input, Button, Text, useToast, Heading, Spinner } from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from 'components/Home/Header'

const ResetPassword = () => {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [validToken, setValidToken] = useState(false)
	const toast = useToast()
	const { token } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await axios.get(
					`https://api-buildings-administration.onrender.com/api/user/reset-password/${token}`
				)
				if (response.status === 200) {
					setValidToken(true)
				}
			} catch (error) {
				toast({
					title: 'Token inválido o expirado.',
					description: 'El enlace ya no es válido.',
					status: 'error',
					duration: 5000,
					isClosable: true
				})
				navigate('/login')
			}
		}

		verifyToken()
	}, [token, toast, navigate])

	const handleSubmit = async () => {
		if (password !== confirmPassword) {
			return toast({
				title: 'Las contraseñas no coinciden.',
				status: 'error',
				duration: 5000,
				isClosable: true
			})
		}

		setLoading(true)
		try {
			const response = await axios.post(
				`https://api-buildings-administration.onrender.com/api/user/reset-password/${token}`,
				{ newPassword: password }
			)

			if (response.status === 200) {
				toast({
					title: '¡Contraseña restablecida con éxito!',
					status: 'success',
					duration: 5000,
					isClosable: true
				})
				navigate('/login')
			}
		} catch (error) {
			toast({
				title: 'Error al restablecer la contraseña.',
				description: error.response?.data?.message || 'Ocurrió un error.',
				status: 'error',
				duration: 5000,
				isClosable: true
			})
		} finally {
			setLoading(false)
		}
	}

	if (!validToken) {
		return (
			<VStack justifyContent='center' alignItems='center' height='100vh'>
				<Spinner size='xl' />
				<Text>Verificando token...</Text>
			</VStack>
		)
	}

	return (
		<VStack spacing={4} width='100%' maxW='400px' mx='auto' mt={10}>
			<Header showHeader={false} />
			<Heading as='h2' size='lg'>
				Restablecer tu contraseña
			</Heading>
			<Input
				placeholder='Nueva contraseña'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				type='password'
			/>
			<Input
				placeholder='Confirmar nueva contraseña'
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				type='password'
			/>
			<Button colorScheme='teal' width='100%' onClick={handleSubmit} isLoading={loading}>
				Restablecer contraseña
			</Button>
		</VStack>
	)
}

export default ResetPassword
