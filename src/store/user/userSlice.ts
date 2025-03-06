import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IUser, UserState } from "@/src/types"
import { fetchUserInfo, updateUserInfo } from "./userThunks"

export const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      if (state.currentUser && action.payload.id === state.currentUser.id) {
        state.currentUser = action.payload
      }
    },
    clearUser: (state) => {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, updateUser, clearUser } = userSlice.actions
export default userSlice.reducer

