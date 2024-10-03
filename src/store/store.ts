import { configureStore } from '@reduxjs/toolkit'
import towerReducer from '../redux/towerSlice'

const store = configureStore({
  reducer: {
    towers: towerReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
