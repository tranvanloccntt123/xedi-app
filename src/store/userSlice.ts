import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { IUser } from "@/src/types"

interface UserState {
  users: Record<string, IUser>
}

const initialState: UserState = {
  users: {},
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      const users = { ...state.users }
      users[action?.payload?.id || "empty"] = action.payload
      state.users = users
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      if (state.users[action.payload.id]) {
        state.users[action.payload.id] = action.payload
      }
    },
    clearUser: (state) => {
      state.users = {}
    },
  },
})

export const { setUser, updateUser, clearUser } = userSlice.actions
export default userSlice.reducer

