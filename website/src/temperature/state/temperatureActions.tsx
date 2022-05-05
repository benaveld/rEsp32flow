import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import TemperatureApi from "../temperatureApi";
import {
  LOAD_TEMPERATURE_FAILURE,
  LOAD_TEMPERATURE_REQUEST,
  LOAD_TEMPERATURE_SUCCESS,
  TemperatureState,
} from "./temperatureTypes";

function expandNumber(value: number, precision: number, base = 10) : number {
  return value / (base ** precision);
}

export function loadTemperature(
  historySize: number
): ThunkAction<void, TemperatureState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_TEMPERATURE_REQUEST });
    try {
      let response: TemperatureState = await TemperatureApi.get(historySize);
      response.oven = expandNumber(response.oven, response.precision);
      response.chip = expandNumber(response.chip, response.precision);
      response.ovenHistory = response.ovenHistory.map(
        (value) => expandNumber(value, response.precision)
      );
      response.chipHistory = response.chipHistory.map(
        (value) => expandNumber(value, response.precision)
      );

      return dispatch({
        type: LOAD_TEMPERATURE_SUCCESS,
        payload: response,
      });
    } catch (e) {
      dispatch({ type: LOAD_TEMPERATURE_FAILURE, payload: e });
    }
  };
}
