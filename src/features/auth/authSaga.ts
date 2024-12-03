import { takeLatest, put, call } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure } from './authSlice';
import { loginApi } from '../../api/auth';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const user = yield call(loginApi, action.payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
}

