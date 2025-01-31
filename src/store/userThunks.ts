import { createAsyncThunk } from "@reduxjs/toolkit"
import { xediSupabase } from "@/src/lib/supabase"
import type { IUser } from "@/src/types"

export const fetchUserInfo = createAsyncThunk<IUser, void>("user/fetchUserInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await xediSupabase.tables.users.info()
    if (response.error) {
      throw new Error(response.error.message)
    }
    if (response.data && response.data.length > 0) {
      return response.data[0] as IUser
    } else {
      throw new Error("User not found")
    }
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const updateUserInfo = createAsyncThunk<IUser, Partial<IUser>>(
  "user/updateUserInfo",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await xediSupabase.tables.users.updateUser(userData as IUser)
      if (response.error) {
        throw new Error(response.error.message)
      }
      if (response.data && response.data.length > 0) {
        return response.data[0] as IUser
      } else {
        throw new Error("User update failed")
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

