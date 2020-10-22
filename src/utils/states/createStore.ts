import {
  applyMiddleware,
  combineReducers,
  createStore as reduxCreateStore,
  Reducer,
  AnyAction,
  PreloadedState,
  compose,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { composeWithDevTools } from 'redux-devtools-extension';
import { SliceObject, ReducerObject } from 'types/state';

const createRootReducer = <TSlices extends SlicesBase>(slices: TSlices) =>
  (combineReducers(
    Object.fromEntries(
      Object.entries(slices).map(([key, { reducer }]) => [key, reducer]),
    ),
  ) as unknown) as Reducer<RootState<TSlices>, AnyAction>;

const createRootState = <TSlices extends SlicesBase>(slices: TSlices) =>
  Object.fromEntries(
    Object.entries(slices).map(([key, { initialState }]) => [
      key,
      initialState,
    ]),
  ) as PreloadedState<RootState<TSlices>>;

const isSliceObject = (
  o: SliceObject<string, any, any> | ReducerObject<string, any>,
): o is SliceObject<string, any, any> =>
  o && !!(o as SliceObject<string, any, any>).saga;

const createRootSaga = <TSlices extends SlicesBase>(slices: TSlices) =>
  function* rootSaga() {
    yield all(
      Object.values(slices)
        .filter(isSliceObject)
        .map(({ saga }) => fork(saga)),
    );
  };

const createStore = <TSlices extends SlicesBase>(slices: TSlices) => {
  const rootReducer = createRootReducer(slices);
  const rootState = createRootState(slices);
  const rootSaga = createRootSaga(slices);

  // Middlewares
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const composeEnhancers =
    process.env.NODE_ENV === 'development'
      ? composeWithDevTools({ trace: true })
      : compose;
  const store = reduxCreateStore<RootState<TSlices>, AnyAction, {}, {}>(
    rootReducer,
    rootState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

export default createStore;

type SlicesBase = Record<
  string,
  SliceObject<string, any, any> | ReducerObject<string, any>
>;

type RootState<TSlices extends SlicesBase> = {
  [k in keyof TSlices]: TSlices[k]['initialState'];
};
