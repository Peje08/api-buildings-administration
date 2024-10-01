import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  Checkbox,
  Switch,
  VStack,
} from '@chakra-ui/react'
import { colors } from '../../constants/colors'
import { strings } from '../../constants/strings'

interface TowerAccordionProps {
  pisos: number
  handlePisosChange: (value: number) => void
  localChecked: boolean
  setLocalChecked: (value: boolean) => void
  pisosIguales: boolean
  setPisosIguales: (value: boolean) => void
  isLetras: boolean
  setIsLetras: (value: boolean) => void
  pisosValues: string[]
  handlePisoChange: (value: string, index: number) => void
}

const TowerAccordion: React.FC<TowerAccordionProps> = ({
  pisos,
  handlePisosChange,
  localChecked,
  setLocalChecked,
  pisosIguales,
  setPisosIguales,
  isLetras,
  setIsLetras,
  pisosValues,
  handlePisoChange,
}) => {
  return (
    <Accordion allowToggle width="95%">
      <AccordionItem>
        <h2>
          <AccordionButton _expanded={{ bg: colors.badge, color: 'white' }}>
            <Box flex="1" textAlign="left">
              <Text fontWeight="bold">{strings.tower} 1</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {/* Piso, Local, Pisos Iguales, y Letras/Números */}
          <HStack width="100%" spacing={6} alignItems="center" mb={4}>
            <HStack>
              <Text>{strings.floors}</Text>
              <NumberInput
                min={1}
                max={100}
                value={pisos}
                onChange={(valueString) =>
                  handlePisosChange(Number(valueString))
                }
                width="50%"
                isRequired
                aria-required="true"
              >
                <NumberInputField />
              </NumberInput>
            </HStack>

            <HStack>
              <Checkbox
                isChecked={localChecked}
                onChange={(e) => setLocalChecked(e.target.checked)}
              >
                {strings.premise}
              </Checkbox>
            </HStack>

            <HStack>
              <Checkbox
                isChecked={pisosIguales}
                onChange={(e) => setPisosIguales(e.target.checked)}
              >
                {strings.sameFloors}
              </Checkbox>
            </HStack>

            <HStack>
              <Text>{strings.letters}</Text>
              <Switch
                isChecked={isLetras}
                onChange={() => setIsLetras(!isLetras)}
              />
              <Text>{strings.numbers}</Text>
            </HStack>
          </HStack>

          {/* Fila de Local si el checkbox está marcado */}
          {localChecked && (
            <HStack width="100%" alignItems="center" mb={4}>
              <Text width="10%">{strings.premise}</Text>
              <NumberInput width="20%" isRequired aria-required="true">
                <NumberInputField />
              </NumberInput>
            </HStack>
          )}

          {/* Planta Baja */}
          <HStack width="100%" alignItems="center" mb={4}>
            <Text width="10%">{strings.groundFloor}</Text>
            <NumberInput width="20%" isRequired aria-required="true">
              <NumberInputField />
            </NumberInput>
          </HStack>

          {/* Mostrar inputs de pisos según la cantidad seleccionada */}
          <VStack width="100%" align="start" spacing={4}>
            {Array.from({ length: pisos }).map((_, index) => (
              <HStack key={index} width="100%" alignItems="center" mb={4}>
                <Text width="10%">
                  {strings.floor} {index + 1}
                </Text>
                <NumberInput
                  value={pisosValues[index]}
                  onChange={(valueString) =>
                    handlePisoChange(valueString, index)
                  }
                  isDisabled={pisosIguales && index >= 1}
                  width="20%"
                  isRequired
                  aria-required="true"
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TowerAccordion
