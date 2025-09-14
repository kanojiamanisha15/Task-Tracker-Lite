import { createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: authService.getUser(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
});

export const { clearError, clearAuth, setAuth } = authSlice.actions;
export default authSlice.reducer;
