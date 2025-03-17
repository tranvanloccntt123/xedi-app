import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IDriverTripRequest, ITripRequest } from "@/src/types";
import {
  acceptDriverTripRequest,
  fetchDriverTripRequestAccepted,
} from "./tripRequestsThunk";

export interface TripRequestsState {
  currentTripRequest: ITripRequest | null;
  currentDriverTripRequest: IDriverTripRequest | null;
  requestsDeleted: Record<number, boolean>;
  tripRequestAccepted: Record<number, IDriverTripRequest>;
  tripRequestInfo: Record<number, ITripRequest>;
}

const initialState: TripRequestsState = {
  requestsDeleted: {},
  tripRequestAccepted: {},
  tripRequestInfo: {},
  currentTripRequest: null,
  currentDriverTripRequest: null,
};

const tripRequestsSlice = createSlice({
  name: "tripRequests",
  initialState,
  reducers: {
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

export const { setCurrentTripRequest, setCurrentDriverTripRequest } =
  tripRequestsSlice.actions;
export default tripRequestsSlice.reducer;
