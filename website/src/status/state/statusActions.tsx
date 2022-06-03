import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../errorUtils";
import StatusApi from "../statusApi";

export const updateStatus = createAsyncThunk(
  "status/update",
  async (_,{rejectWithValue}) => {
    try {
      return await StatusApi.get();
    } catch (e){
      return rejectWithValue(getErrorMessage(e));
    }
  }
)