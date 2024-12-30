import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<IUser | null>) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;

