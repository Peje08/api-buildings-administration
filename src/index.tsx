import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { CabildoContextProvider } from './context/CabildoContext'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './chakraTheme/theme'

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Provider store={store}>
        <CabildoContextProvider>
          <App />
        </CabildoContextProvider>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
