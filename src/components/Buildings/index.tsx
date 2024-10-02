import { useState } from 'react'
import { VStack, HStack } from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import StreetInput from './StreetInput'
import TowerAccordion from './TowerAccordion'
import ActionButtons from './ActionButtons'
import BuildingNumberInput from './NumberInputField'

interface BuildingConfigurationProps {
  onCancel: () => void
}

interface Tower {
  pisos: number
  localChecked: boolean
  pisosIguales: boolean
  isLetras: boolean
  pisosValues: string[]
}

const BuildingConfiguration: React.FC<BuildingConfigurationProps> = ({ onCancel }) => {
  // Estado inicial con una torre por defecto
  const [towers, setTowers] = useState<Tower[]>([
    {
      pisos: 0, // Valor inicial de los pisos
      localChecked: false,
      pisosIguales: false,
      isLetras: false,
      pisosValues: [] // Array para almacenar los valores de las unidades funcionales
    }
  ])

  // Agregar una nueva torre
  const handleAddTower = () => {
    setTowers([
      ...towers,
      {
        pisos: 0, // Nueva torre comienza con 0 pisos
        localChecked: false,
        pisosIguales: false,
        isLetras: false,
        pisosValues: []
      }
    ])
  }

  // Eliminar una torre
  const handleRemoveTower = (index: number) => {
    if (towers.length > 1) {
      const updatedTowers = towers.filter((_, i) => i !== index)
      setTowers(updatedTowers)
    }
  }

  // Actualizar el número de pisos de una torre específica
  const handlePisosChange = (value: number, index: number) => {
    const updatedTowers = [...towers]
    updatedTowers[index].pisos = value
    setTowers(updatedTowers)
  }

  // Actualizar el estado de localChecked de una torre específica
  const handleLocalCheckedChange = (value: boolean, index: number) => {
    const updatedTowers = [...towers]
    updatedTowers[index].localChecked = value
    setTowers(updatedTowers)
  }

  // Actualizar el estado de pisosIguales de una torre específica
  const handlePisosIgualesChange = (value: boolean, index: number) => {
    const updatedTowers = [...towers]
    updatedTowers[index].pisosIguales = value
    setTowers(updatedTowers)
  }

  // Actualizar el estado de isLetras de una torre específica
  const handleIsLetrasChange = (value: boolean, index: number) => {
    const updatedTowers = [...towers]
    updatedTowers[index].isLetras = value
    setTowers(updatedTowers)
  }

  return (
    <VStack
      spacing={6}
      align='center'
      width='100%'
      p={15}
      bg={colors.inputBackground}
      border='1px'
      borderColor={colors.verticalDivider}
      borderRadius='4px'
    >
      <HStack width='90%' spacing={8}>
        <StreetInput />
        <BuildingNumberInput />
      </HStack>

      {/* Renderizamos los acordeones de las torres */}
      {towers.map((tower, index) => (
        <VStack key={index} width='100%' spacing={2}>
          <TowerAccordion
            towerName={`Torre ${index + 1}`}
            pisos={tower.pisos}
            handlePisosChange={(value) => handlePisosChange(value, index)}
            localChecked={tower.localChecked}
            setLocalChecked={(value) => handleLocalCheckedChange(value, index)}
            pisosIguales={tower.pisosIguales}
            setPisosIguales={(value) => handlePisosIgualesChange(value, index)}
            isLetras={tower.isLetras}
            setIsLetras={(value) => handleIsLetrasChange(value, index)}
            pisosValues={tower.pisosValues}
            handlePisoChange={() => {}}
            showRemoveButton={index > 0}
            onRemoveTower={() => handleRemoveTower(index)}
          />
        </VStack>
      ))}

      {/* Botones para duplicar/agregar torres */}
      <ActionButtons onCancel={onCancel} onAddTower={handleAddTower} />
    </VStack>
  )
}

export default BuildingConfiguration
