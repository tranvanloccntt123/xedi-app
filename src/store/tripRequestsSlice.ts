import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITripRequest } from '@/src/types';

interface TripRequestsState {
  requests: ITripRequest[];
}

const initialState: TripRequestsState = {
  requests: [],
};

const tripRequestsSlice = createSlice({
  name: 'tripRequests',
  initialState,
  reducers: {
    setTripRequests: (state, action: PayloadAction<ITripRequest[]>) => {
      state.requests = action.payload;
    },
    addTripRequest: (state, action: PayloadAction<ITripRequest>) => {
      state.requests.push(action.payload);
    },
    updateTripRequest: (state, action: PayloadAction<{ id: string; riderId: string }>) => {
      const index = state.requests.findIndex(request => request.id === action.payload.id);
      if (index !== -1) {
        if (!state.requests[index].riderRequests.includes(action.payload.riderId)) {
          state.requests[index].riderRequests.push(action.payload.riderId);
        }
        state.requests[index].updatedAt = new Date();
      }
    },
    deleteTripRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(request => request.id !== action.payload);
    },
  },
});

export const { setTripRequests, addTripRequest, updateTripRequest, deleteTripRequest } = tripRequestsSlice.actions;
export default tripRequestsSlice.reducer;

