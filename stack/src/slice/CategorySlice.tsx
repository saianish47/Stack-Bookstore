import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryItem } from "../models/types";
import axios from "axios";

const initialState = {
  category: [] as CategoryItem[],
  selectedCategory: "Romance" as string,
};

export const getCategory = createAsyncThunk("getCategory", async () => {
  try {
    const category = await axios
      .get("/api/categories/")
      .then((Response) => Response.data);
    return category;
  } catch (error) {
    console.error(`an error occured inside the Category Provide ${error}`);
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.category = action.payload;
    });
    builder.addCase(getCategory.rejected, (state, action) => {
      console.log("Update books rejected");
      console.log(action.error);
    });
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
