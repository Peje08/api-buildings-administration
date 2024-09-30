import {
  Container,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import { icons } from '../../constants/icons'
import { strings } from '../../constants/strings'

export const Login = () => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      <GridItem w="100%" h="10" bg={colors.adminBackground}>
        <Container centerContent>
          <Image src={icons.cabildo} />
          <Text>{strings.presentationText}</Text>
        </Container>
      </GridItem>
      <GridItem w="100%" h="10" bg={colors.adminBackground}>
        <InputGroup>
          <InputLeftAddon>Nombre y Apellido</InputLeftAddon>
          <Input
            placeholder='asdasdasdasdada'
            _placeholder={{ opacity: .5, color: colors.textColor }}
          />
        </InputGroup>
      </GridItem>
    </Grid>
  )
}
