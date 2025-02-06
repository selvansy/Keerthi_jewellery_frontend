import { createSlice } from "@reduxjs/toolkit";
 
const initialState = {
  // status: false,
  info: localStorage.getItem('token') || null,
};
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.info = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.info = null;
    },
  },
});
 
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
 