import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    filters: {
      status: "",
      category: "",
      userId: "",
      dueDate: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: "",
        category: "",
        userId: "",
        dueDate: "",
      };
    },
  },
});

export const { setFilters, clearFilters } = taskSlice.actions;
export default taskSlice.reducer;
