import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IUser } from "../types"
import { fetchUserInfo, updateUserInfo } from "./userThunks"

interface AuthState {
  isAuthenticated: boolean
  user: IUser | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.isAuthenticated = true
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    clearAuthData: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      if (state.user && action.payload.id === state.user.id) {
        state.user = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { setAuthenticated, logout, clearAuthData, updateUser } = authSlice.actions
export default authSlice.reducer

