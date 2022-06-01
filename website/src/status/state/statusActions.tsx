import { createAsyncThunk } from "@reduxjs/toolkit";
import StatusApi from "../statusApi";

export const updateStatus = createAsyncThunk(
  "status/update",
  async (_,{rejectWithValue}) => {
    try {
      return await StatusApi.get();
    } catch (e){
      return rejectWithValue(e);
    }
  }
)