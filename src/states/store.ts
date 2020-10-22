import {
  combineReducers,
  createStore,
  applyMiddleware,
  Reducer,
  Action as ReduxAction,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

import sagas from './sagas';

type Action = ReduxAction<string>;
interface PayloadAction<TPayload = any> extends Action {
  payload?: TPayload;
}

const helloReducer: Reducer<string, PayloadAction> = (
  state = '',
  { type, payload },
) => {
  switch (type) {
    case 'set-hello':
      return `From payload: ${payload}`;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  hello: helloReducer,
});

const sagaMiddleware = createSagaMiddleware();
const enhancers = [sagaMiddleware];

const store = createStore(rootReducer, applyMiddleware(...enhancers));
sagaMiddleware.run(sagas);

export default store;
