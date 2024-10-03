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
  ]
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
    }
  }
})

export const {
  addTower,
  removeTower,
  duplicateTower,
  updatePisos,
  updateLocalChecked,
  updatePisosIguales,
  updateIsLetras
} = towerSlice.actions

export default towerSlice.reducer
