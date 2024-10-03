import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Tower {
  pisos: number
  localChecked: boolean
  pisosIguales: boolean
  isLetras: boolean
  pisosValues: string[]
}

interface TowerState {
  towers: Tower[]
  street: string
  number: string
}

const initialState: TowerState = {
  towers: [
    {
      pisos: 0,
      localChecked: false,
      pisosIguales: false,
      isLetras: false,
      pisosValues: []
    }
  ],
  street: '',
  number: ''
}

export const towerSlice = createSlice({
  name: 'towers',
  initialState,
  reducers: {
    addTower(state) {
      state.towers.push({
        pisos: 0,
        localChecked: false,
        pisosIguales: false,
        isLetras: false,
        pisosValues: []
      })
    },
    removeTower(state, action: PayloadAction<number>) {
      if (state.towers.length > 1) {
        state.towers.splice(action.payload, 1)
      }
    },
    duplicateTower(state, action: PayloadAction<number>) {
      const towerToDuplicate = state.towers[action.payload]
      const duplicatedTower = { ...towerToDuplicate }
      state.towers.push(duplicatedTower)
    },
    updatePisos(state, action: PayloadAction<{ index: number; pisos: number }>) {
      state.towers[action.payload.index].pisos = action.payload.pisos
    },
    updateLocalChecked(
      state,
      action: PayloadAction<{ index: number; localChecked: boolean }>
    ) {
      state.towers[action.payload.index].localChecked = action.payload.localChecked
    },
    updatePisosIguales(
      state,
      action: PayloadAction<{ index: number; pisosIguales: boolean }>
    ) {
      state.towers[action.payload.index].pisosIguales = action.payload.pisosIguales
    },
    updateIsLetras(state, action: PayloadAction<{ index: number; isLetras: boolean }>) {
      state.towers[action.payload.index].isLetras = action.payload.isLetras
    },
    handleAccept(state) {
      const buildingData = {
        street: state.street,
        number: state.number,
        towers: state.towers.map((tower, index) => ({
          towerName: `Torre ${index + 1}`,
          pisos: tower.pisos,
          localChecked: tower.localChecked,
          isLetras: tower.isLetras,
          pisosValues: tower.pisosValues,
        }))
      }
      console.log(buildingData)
    },
     // Agregamos las acciones para actualizar los valores de calle y número
     updateStreet(state, action: PayloadAction<string>) {
      state.street = action.payload
    },
    updateNumber(state, action: PayloadAction<string>) {
      state.number = action.payload
    },

  }
})

export const {
  addTower,
  removeTower,
  duplicateTower,
  updatePisos,
  updateLocalChecked,
  updatePisosIguales,
  updateIsLetras,
  handleAccept,
  updateStreet,
  updateNumber
} = towerSlice.actions

export default towerSlice.reducer
