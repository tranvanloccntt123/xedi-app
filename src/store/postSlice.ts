import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InputLocation, IFixedRoute } from "@/src/types";

export interface PostState {
  content: string;
  startLocation?: InputLocation;
  endLocation?: InputLocation;
  fixedRoute?: IFixedRoute[];
  departureTime?: Date
}

const initialState: PostState = {
  content: "",
  startLocation: undefined,
  endLocation: undefined,
  fixedRoute: undefined,
  departureTime: undefined,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setStartLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      console.log(action.payload);
      state.startLocation = action.payload;
    },
    setEndLocation: (
      state,
      action: PayloadAction<InputLocation | undefined>
    ) => {
      state.endLocation = action.payload;
    },
    setFixedRoutes: (state, action: PayloadAction<IFixedRoute | undefined>) => {
      state.fixedRoute = [...(state.fixedRoute || []), action.payload];
    },
    setDepartureTime: (state, action: PayloadAction<Date | undefined>) => {
      state.departureTime = action.payload
    },
    resetPost: () => initialState,
  },
});

export const {
  setContent,
  setStartLocation,
  setEndLocation,
  setFixedRoutes,
  resetPost,
  setDepartureTime
} = postSlice.actions;

export default postSlice.reducer;
