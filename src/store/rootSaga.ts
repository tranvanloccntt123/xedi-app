import { all } from "redux-saga/effects";
import { watchAuthSaga } from "../features/auth/authSaga";
import { watchBookingsSaga } from "../features/bookings/bookingsSaga";

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchBookingsSaga(),
  ]);
}

