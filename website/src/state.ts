import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { combineReducers } from "redux";
import { TemperatureState } from "./temperature/state/temperatureTypes";
import { initialTemperatureState, TemperatureReducer } from "./temperature/state/temperatureReducer";

const reducer = combineReducers({
  temperatureState: TemperatureReducer
});

export default function configureStore(preloadedState: any) {
  const middlewares = [ReduxThunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancer = composeWithDevTools(middlewareEnhancer);

  const store = createStore(reducer, preloadedState, enhancer);
  return store;
}

export interface AppState {
  temperatureState: TemperatureState;
}

export const initialAppState: AppState = {
  temperatureState: initialTemperatureState
};

export const store = configureStore(initialAppState);