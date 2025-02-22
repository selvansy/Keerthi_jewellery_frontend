import { createSlice } from "@reduxjs/toolkit";
 
const initialState = {
  // status: false,
  info: localStorage.getItem('token') || null,
  menu:[],
  subMenu:[],
};
 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetMenu:(state,action)=>{
      state.menu = action.payload;
    },
    SetsubMenu:(state,action)=>{
      state.subMenu = action.payload;
    },
    login: (state, action) => {
      state.info = action.payload;
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.info = null;
    },
  },
});
 
export const { login, logout,SetMenu ,SetsubMenu } = authSlice.actions;
export default authSlice.reducer;
 