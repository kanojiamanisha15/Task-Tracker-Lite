import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    // No state needed for categories as they're managed by React Query
  },
  reducers: {
    // No reducers needed for categories as they're managed by React Query
  },
});

export const {} = categorySlice.actions;
export default categorySlice.reducer;
