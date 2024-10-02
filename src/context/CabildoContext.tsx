import { createContext, useContext, useState, ReactNode } from 'react'

type CabildoContextType = {
  value: string
  setValue: (newValue: string) => void
}

const CabildoContext = createContext<CabildoContextType | undefined>(undefined)

export const CabildoContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [value, setValue] = useState('default')

  return (
    <CabildoContext.Provider value={{ value, setValue }}>
      {children}
    </CabildoContext.Provider>
  )
}

export const useCabildoContext = () => {
  const context = useContext(CabildoContext)
  if (!context) {
    throw new Error(
      'useCabildoContext must be used within a CabildoContextProvider'
    )
  }
  return context
}
