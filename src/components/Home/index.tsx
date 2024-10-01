import React from 'react'
import { Flex } from '@chakra-ui/react'
import Header from './Header'
import AdministrationBadge from './AdministrationBadge'
import Sidebar from './Sidebar'
import MainPanel from './MainPanel'
import { colors } from '../../constants/colors'

const Home: React.FC = () => {
  const userName = 'Administración de Consorcios Pepito Cibrián S.A.'

  return (
    <Flex direction="column" height="100vh" bg={colors.adminBackground}>
      <Header />

      {/* Administración */}
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems="center"
        bg={colors.adminBackground}
        borderBottom="2px"
        borderColor={colors.verticalDivider}
        height="7rem"
      >
        <AdministrationBadge name={userName} />
      </Flex>

      <Flex flex="1" >
        <Sidebar />
        <MainPanel />
      </Flex>
    </Flex>
  )
}

export default Home
