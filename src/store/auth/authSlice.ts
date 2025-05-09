import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserCoins,
  fetchMyUserInfo,
  updateUserInfo,
} from "@/src/store/user/userThunks";

export interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  coins: IUserCoin | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  coins: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      if (state.user && action.payload.id === state.user.id) {
        state.user = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserCoins.fulfilled, (state, action) => {
        state.coins = action.payload;
      });
  },
});

export const { setAuthenticated, logout, clearAuthData, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
