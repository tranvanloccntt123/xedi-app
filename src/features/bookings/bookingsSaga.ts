import { takeLatest, put, call } from 'redux-saga/effects';
import {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailure,
} from './bookingsSlice';
import { createBookingApi, fetchBookingsApi } from '../../api/bookings';

function* createBookingSaga(action: ReturnType<typeof createBookingRequest>) {
  try {
    const booking = yield call(createBookingApi, action.payload);
    yield put(createBookingSuccess(booking));
  } catch (error) {
    yield put(createBookingFailure(error.message));
  }
}

function* fetchBookingsSaga() {
  try {
    const bookings = yield call(fetchBookingsApi);
    yield put(fetchBookingsSuccess(bookings));
  } catch (error) {
    yield put(fetchBookingsFailure(error.message));
  }
}

export function* watchBookingsSaga() {
  yield takeLatest(createBookingRequest.type, createBookingSaga);
  yield takeLatest(fetchBookingsRequest.type, fetchBookingsSaga);
}

