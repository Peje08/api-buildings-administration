import { Flex, Text } from '@chakra-ui/react'
import { ReactSVG } from 'react-svg'
import { icons } from '../../constants/icons'
import { strings } from '../../constants/strings'
import { colors } from '../../constants/colors'

const AuthContainer: React.FC = () => {
	return (
		<Flex
			direction='column'
			align='center'
			justify='center'
			width='50%'
			padding='4'
			bg={colors.adminBackground}
			textAlign='center'
		>
			<Flex justify='center' align='center' mb={4} maxWidth='30x'>
				<ReactSVG src={icons.cabildo} />
			</Flex>

			<Text fontSize='2xl' fontWeight='bold' mb={4}>
				{strings.welcome}
			</Text>
			<Text textAlign='center' px={8}>
				{strings.presentationText}
			</Text>
		</Flex>
	)
}

export default AuthContainer
