import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IDriverTripRequest, ITripRequest } from "@/src/types";
import {
  acceptDriverTripRequest,
  fetchDriverTripRequestAccepted,
} from "./tripRequestsThunk";

export interface TripRequestsState {
  requests: ITripRequest[];
  currentTripRequest: ITripRequest | null;
  currentDriverTripRequest: IDriverTripRequest | null;
  requestsDeleted: Record<number, boolean>;
  tripRequestAccepted: Record<number, IDriverTripRequest>;
}

const initialState: TripRequestsState = {
  requests: [],
  requestsDeleted: {},
  tripRequestAccepted: {},
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
  extraReducers: (builder) => {
    builder
      .addCase(acceptDriverTripRequest.fulfilled, (state, action) => {
        state.tripRequestAccepted[action.payload.tripRequestId] =
          action.payload.driverTripRequest;
      })
      .addCase(fetchDriverTripRequestAccepted.fulfilled, (state, action) => {
        state.tripRequestAccepted[action.payload.tripRequestId] =
          action.payload.driverTripRequest;
      });
  },
});

export const {
  setTripRequests,
  addTripRequest,
  setCurrentTripRequest,
  setCurrentDriverTripRequest,
} = tripRequestsSlice.actions;
export default tripRequestsSlice.reducer;
