import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/src/types';

interface UserState {
  users: Record<string, IUser>;
}

const initialState: UserState = {
  users: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      // state.users = action.payload;
      const users = {...state.users};
      users[action?.payload?.id || 'empty'] = action.payload;
      state.users = users;
    },
    clearUser: (state) => {
      state.users = {};
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

