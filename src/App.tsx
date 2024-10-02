import { Container } from '@chakra-ui/react'
import { colors } from './constants/colors'
import LoginPage from './components/Login'
import Home from './components/Home'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Container bg={colors.adminBackground} maxW="100%" height="100vh" p={.5}>
      <Routes>
        {/* Redirigir de "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Define las rutas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Container>
  )
}

export default App
