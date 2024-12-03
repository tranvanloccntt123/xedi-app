import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  id: string;
  userId: string;
  pickup: string;
  dropoff: string;
  rideType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  isLoading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    createBookingRequest: (state, action: PayloadAction<Omit<Booking, 'id' | 'status'>>) => {
      state.isLoading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.isLoading = false;
      state.bookings.push(action.payload);
    },
    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchBookingsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.isLoading = false;
      state.bookings = action.payload;
    },
    fetchBookingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailure,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;

