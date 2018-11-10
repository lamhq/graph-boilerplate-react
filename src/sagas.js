import { all } from 'redux-saga/effects';

import commonSaga from './common/sagas';

export default function* rootSaga() {
  yield all([
    commonSaga(),
  ]);
}
