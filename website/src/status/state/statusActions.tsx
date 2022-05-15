import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import StatusApi from "../statusApi";
import { LOAD_STATUS_FAILURE, LOAD_STATUS_REQUEST, LOAD_STATUS_SUCCESS, StatusState } from "./statusTypes";

function expandNumber(value: number, precision: number, base = 10) : number {
  return value / (base ** precision);
}

export function updateStatus(): ThunkAction<void, StatusState, null, Action<string>>
{
  return async (dispatch: any) => {
    dispatch({type: LOAD_STATUS_REQUEST});
    try {
      let response = await StatusApi.get();
      response.oven = expandNumber(response.oven, response.precision);
      response.chip = expandNumber(response.chip, response.precision);
      return dispatch({
        type: LOAD_STATUS_SUCCESS,
        payload: response,
      });
    } catch (e){
      return dispatch({
        type: LOAD_STATUS_FAILURE,
        payload: e,
      });
    }
  }
}