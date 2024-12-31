import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFixedRoute } from '@/src/types';

interface FixedRoutesState {
  routes: IFixedRoute[];
}

const initialState: FixedRoutesState = {
  routes: [],
};

const fixedRoutesSlice = createSlice({
  name: 'fixedRoutes',
  initialState,
  reducers: {
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute[]>) => {
      state.routes = action.payload;
    },
    addFixedRoute: (state, action: PayloadAction<IFixedRoute>) => {
      state.routes.push(action.payload);
    },
    updateFixedRoute: (state, action: PayloadAction<IFixedRoute>) => {
      const index = state.routes.findIndex(route => route.id === action.payload.id);
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    },
    deleteFixedRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(route => route.id !== action.payload);
    },
  },
});

export const { setFixedRoutes, addFixedRoute, updateFixedRoute, deleteFixedRoute } = fixedRoutesSlice.actions;
export default fixedRoutesSlice.reducer;

