import { Box, Button, useColorMode } from '@chakra-ui/react'

function App() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box textAlign="center" p={5}>
      <Button onClick={toggleColorMode}>
        Cambiar a {colorMode === 'light' ? 'oscuro' : 'claro'}
      </Button>
    </Box>
  )
}

export default App
