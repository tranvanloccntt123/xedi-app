import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IFixedRoute } from "@/src/types"

export interface FixedRoutesState {
  routes: IFixedRoute[]
  currentFixedRoute: IFixedRoute | null
}

const initialState: FixedRoutesState = {
  routes: [],
  currentFixedRoute: null,
}

const fixedRoutesSlice = createSlice({
  name: "fixedRoutes",
  initialState,
  reducers: {
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute[]>) => {
      state.routes = action.payload
    },
    addFixedRoute: (state, action: PayloadAction<IFixedRoute>) => {
      state.routes.push(action.payload)
    },
    updateFixedRoute: (state, action: PayloadAction<IFixedRoute>) => {
      const index = state.routes.findIndex((route) => route.id === action.payload.id)
      if (index !== -1) {
        state.routes[index] = action.payload
      }
    },
    deleteFixedRoute: (state, action: PayloadAction<number>) => {
      state.routes = state.routes.filter((route) => route.id !== action.payload)
    },
    clearFixedRoutes: (state) => {
      state.routes = process.env.NODE_ENV === "development" ? state.routes : []
    },
    setCurrentFixedRoute: (state, action: PayloadAction<IFixedRoute | null>) => {
      state.currentFixedRoute = action.payload
    },
  },
})

export const {
  setFixedRoutes,
  addFixedRoute,
  updateFixedRoute,
  deleteFixedRoute,
  clearFixedRoutes,
  setCurrentFixedRoute,
} = fixedRoutesSlice.actions
export default fixedRoutesSlice.reducer

