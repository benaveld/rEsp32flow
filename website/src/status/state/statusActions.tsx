import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../errorUtils";
import HistoryApi from "../historyApi";
import StatusApi from "../statusApi";
import { StatusState } from "./statusTypes";

export const updateStatus = createAsyncThunk(
  "status/update",
  async (_, { rejectWithValue }) => {
    try {
      return await StatusApi.get();
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const loadTemperatureHistory = createAsyncThunk(
  "status/history",
  async (timeBack: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as StatusState;
      if (!state.loading) return await HistoryApi.get(timeBack);
      else return null;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);
