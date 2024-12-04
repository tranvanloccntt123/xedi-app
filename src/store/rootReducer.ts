import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingsReducer,
});

export default rootReducer;

