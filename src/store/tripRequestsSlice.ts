import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IDriverTripRequest, ITripRequest } from "@/src/types";

export interface TripRequestsState {
  requests: ITripRequest[];
  currentTripRequest: ITripRequest | null;
  currentDriverTripRequest: IDriverTripRequest | null;
}

const initialState: TripRequestsState = {
  requests: [],
  currentTripRequest: null,
  currentDriverTripRequest: null,
};

const tripRequestsSlice = createSlice({
  name: "tripRequests",
  initialState,
  reducers: {
    setTripRequests: (state, action: PayloadAction<ITripRequest[]>) => {
      state.requests = action.payload;
    },
    addTripRequest: (state, action: PayloadAction<ITripRequest>) => {
      state.requests.push(action.payload);
    },
    setCurrentTripRequest: (
      state,
      action: PayloadAction<ITripRequest | null>
    ) => {
      state.currentTripRequest = action.payload;
    },
    setCurrentDriverTripRequest: (
      state,
      action: PayloadAction<IDriverTripRequest | null>
    ) => {
      state.currentDriverTripRequest = action.payload;
    },
  },
});

export const {
  setTripRequests,
  addTripRequest,
  setCurrentTripRequest,
  setCurrentDriverTripRequest,
} = tripRequestsSlice.actions;
export default tripRequestsSlice.reducer;
