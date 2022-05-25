import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import StatusApi from "../statusApi";
import { LOAD_STATUS_FAILURE, LOAD_STATUS_REQUEST, LOAD_STATUS_SUCCESS, StatusState } from "./statusTypes";

export function updateStatus(): ThunkAction<void, StatusState, null, Action<string>>
{
  return async (dispatch: any) => {
    dispatch({type: LOAD_STATUS_REQUEST});
    try {
      const response = await StatusApi.get();
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