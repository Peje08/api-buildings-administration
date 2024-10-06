import { useState } from 'react'
import {
	VStack,
	Input,
	Button,
	HStack,
	Text,
	useToast,
	Link,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton
} from '@chakra-ui/react'
import { strings } from '../../constants/strings'
import { useNavigate } from 'react-router-dom'
import { handleLogin } from '../../utils/authUtils'
import axios from 'axios'

interface LoginFormProps {
	onRegisterClick: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [recoveryEmail, setRecoveryEmail] = useState('')
	const toast = useToast()
	const navigate = useNavigate()
	const { isOpen, onOpen, onClose } = useDisclosure() // Para controlar el modal

	// Función para iniciar sesión al presionar Enter
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSubmit() // Llamamos a la función de submit cuando se presiona Enter
		}
	}

	const handleSubmit = async () => {
		await handleLogin({ email, password }, setLoading, toast, navigate)
	}

	const handleRecoverySubmit = async () => {
		setLoading(true)

		try {
			const response = await axios.post(
				'https://api-buildings-administration.onrender.com/api/user/forgot-password',
				{
					email: recoveryEmail
				}
			)

			if (response.status === 200) {
				toast({
					title: 'Solicitud enviada.',
					description: `Si el correo ${recoveryEmail} está registrado, recibirás instrucciones.`,
					status: 'success',
					duration: 5000,
					isClosable: true
				})
			}
		} catch (error: any) {
			toast({
				title: 'Error al enviar la solicitud.',
				description: error?.response?.data?.message || 'Hubo un problema con el servidor.',
				status: 'error',
				duration: 5000,
				isClosable: true
			})
		} finally {
			setLoading(false)
			onClose()
		}
	}

	return (
		<>
			<VStack spacing={4} width='100%'>
				{/* Input predictivo para email */}
				<Input
					list='email-options'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onKeyDown={handleKeyDown} // Detectamos la tecla Enter
					type='email'
				/>
				<Input
					placeholder='Contraseña'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyDown={handleKeyDown} // Detectamos la tecla Enter
					type='password'
				/>
				<HStack width='100%' justifyContent='space-between'>
					<Link onClick={onOpen} color='teal.500'>
						Olvidé mi contraseña
					</Link>
				</HStack>
				<Button
					colorScheme='teal'
					width='100%'
					onClick={handleSubmit}
					isLoading={loading}
					isDisabled={!email || !password || loading}
				>
					{strings.login}
				</Button>
				<HStack>
					<Text>{strings.dontHaveUser}</Text>
					<Button variant='link' color='teal.500' onClick={onRegisterClick}>
						{strings.register}
					</Button>
				</HStack>
			</VStack>

			{/* Modal de recuperación de contraseña */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Recuperar Contraseña</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Introduce tu correo electrónico para recuperar tu contraseña:</Text>
						<Input
							mt={4}
							placeholder='Correo electrónico'
							value={recoveryEmail}
							onChange={(e) => setRecoveryEmail(e.target.value)}
							type='email'
						/>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme='teal' mr={3} onClick={handleRecoverySubmit}>
							Enviar
						</Button>
						<Button variant='ghost' onClick={onClose}>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default LoginForm
