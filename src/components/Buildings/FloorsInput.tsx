import { HStack, Text, NumberInput, NumberInputField, Checkbox } from '@chakra-ui/react'
import { strings } from '../../constants/strings'

interface FloorsInputProps {
  pisos: number
  handlePisosChange: (value: number) => void
  localChecked: boolean
  setLocalChecked: React.Dispatch<React.SetStateAction<boolean>>
  pisosIguales: boolean
  setPisosIguales: React.Dispatch<React.SetStateAction<boolean>>
}

const FloorsInput: React.FC<FloorsInputProps> = ({
  pisos,
  handlePisosChange,
  localChecked,
  setLocalChecked,
  pisosIguales,
  setPisosIguales
}) => {
  return (
    <HStack width="100%" spacing={6} alignItems="center" mb={4}>
      <HStack>
        <Text>{strings.floors}</Text>
        <NumberInput
          min={1}
          max={100}
          value={pisos}
          onChange={(valueString) => handlePisosChange(Number(valueString))}
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
    </HStack>
  )
}

export default FloorsInput
