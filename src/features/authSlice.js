// features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Store user data
    role: null, // Store role if available
    isAuthenticated: false, // Track authentication status
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action?.payload?.user; // Store user data
      state.role = action?.payload?.role; // Store user data
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
