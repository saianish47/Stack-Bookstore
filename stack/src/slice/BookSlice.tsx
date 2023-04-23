import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BookItem } from "../models/types";
import axios from "axios";

const initialState = {
  books: [] as BookItem[],
};

export const updateBooks = createAsyncThunk(
  "updateBooks",
  async (categoryName: string) => {
    try {
      const books = await axios
        .get(`/api/categories/name/${categoryName}/books`)
        .then((Response) => Response.data);
      return books;
    } catch (error) {
      console.error(`an error occured ${error}`);
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateBooks.fulfilled, (state, action) => {
      state.books = action.payload;
    });
    builder.addCase(updateBooks.rejected, (state, action) => {
      console.log("Update books rejected");
      console.log(action.error); // log the error message
    });
  },
});

export default bookSlice.reducer;
