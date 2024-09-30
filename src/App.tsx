import { Container } from '@chakra-ui/react'
import { colors } from './constants/colors'
import { Login } from './components/Login'

function App() {
  return (
    <>
      <Container
        bg={colors.adminBackground}
        maxW="100%"
        height="100vh"
        border="1px"
        borderColor="#236A62"
      >
        <Login />
      </Container>
    </>
  )
}

export default App
