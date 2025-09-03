import type { CategoriesState, Category } from "@/interfaces/category";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./thunk";

export const initialState = {
  list: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
} as CategoriesState;

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {}, // Synchronous reducers can be added here if needed
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(getCategories.pending, (state: CategoriesState) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getCategories.fulfilled,
        (state: CategoriesState, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(
        getCategories.rejected,
        (state: CategoriesState, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch categories.";
        }
      );
  },
});

export default categorySlice.reducer;
