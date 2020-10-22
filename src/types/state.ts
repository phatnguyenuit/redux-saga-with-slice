import { Reducer, Action } from 'redux';

export interface PayloadAction<TActionType = string, TPayload = any>
  extends Action<TActionType> {
  payload: TPayload;
}

export type ActionCreator<TActionType = string> = () => Action<TActionType>;

export type PayloadActionCreator<TActionType = string, TPayload = any> = (
  payload: TPayload,
) => PayloadAction<TActionType, TPayload>;

export type Actions<
  TState,
  TSliceReducers extends SliceReducersBase<TState>
> = {
  [k in keyof TSliceReducers]: Parameters<
    TSliceReducers[k]
  >[1] extends undefined
    ? ActionCreator<string> & { type: string }
    : PayloadActionCreator<string, Parameters<TSliceReducers[k]>[1]> & {
        type: string;
      };
};

export type ActionReducer<TState> = (state: TState) => TState;

export type PayloadActionReducer<TState, TPayload = any> = (
  state: TState,
  payload: TPayload,
) => TState;

export interface SliceReducersBase<TState> {
  [k: string]: ActionReducer<TState> | PayloadActionReducer<TState>;
}

export interface SliceObject<
  TName extends string,
  TState,
  TSliceReducers extends SliceReducersBase<TState>
> extends ReducerObject<TName, TState> {
  actions: Actions<TState, TSliceReducers>;
  saga: () => Generator;
}

export interface ReducerObject<TName extends string, TState> {
  initialState: TState;
  name: TName;
  reducer: Reducer<TState, PayloadAction>;
}
