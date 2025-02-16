import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  lat: number | null;
  lon: number | null;
  granted: boolean;
}

const initialState: LocationState = {
  lat: null,
  lon: null,
  granted: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<{ lat: number; lon: number }>) {
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
    },
    setGranted(state, action: PayloadAction<boolean>) {
      state.granted = action.payload;
    },
  },
});

export const { setLocation, setGranted } = locationSlice.actions;

export default locationSlice.reducer;
