import { all, fork, put, select, takeEvery } from 'redux-saga/effects';

export function* helloSaga() {
  yield takeEvery('hello', function* worker() {
    console.log('Hello World!');
    yield put({
      type: 'set-hello',
      payload: 'Hello World!',
    });
  });

  yield takeEvery('*', function* logger(action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  });
}

export default function* rootSaga() {
  yield all([fork(helloSaga)]);
}
