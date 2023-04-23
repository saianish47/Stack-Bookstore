import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { staffItem } from "../models/types";
import axios from "axios";

const initialState = {
  staffList: [] as staffItem[],
};

export const fetchStaffList = createAsyncThunk("fetchStaffList", async () => {
  try {
    const response = await axios.get("/api/books/featured/all");
    return response.data;
  } catch (error) {
    console.log("An error occured while fetching staff list");
    console.error(`An error occured while fetching staff list: ${error}`);
  }
});

const staffSlice = createSlice({
  name: "staffbooks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStaffList.fulfilled, (state, action) => {
      state.staffList = action.payload;
    });
    builder.addCase(fetchStaffList.rejected, (state, action) => {
      console.log("Staff books rejected");
      console.log(action.error);
    });
  },
});

export default staffSlice.reducer;
