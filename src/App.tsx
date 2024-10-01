import { Container } from '@chakra-ui/react';
import { colors } from './constants/colors';
import LoginPage from './components/Login';  // Usaremos LoginPage para manejar login y registro
import { Routes, Route, Navigate } from 'react-router-dom'; // Importa Navigate para redirigir

function App() {
  return (
    <Container
      bg={colors.adminBackground}
      maxW="100%"
      height="100vh"
      border="1px"
      borderColor="#236A62"
    >
      <Routes>
        {/* Redirigir de "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Define las rutas */}
        {/* LoginPage manejará tanto login como registro */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
      </Routes>
    </Container>
  );
}

export default App;
