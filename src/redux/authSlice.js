import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // status: false,
  info: localStorage.getItem('token') || null,
  menu:[],
  subMenu:[],
  allowedRoute:[]
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
    allowedMenu:(state,action)=>{
      state.allowedRoute=action.payload.map(submenu => submenu.pathurl);
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
 
export const { login, logout,SetMenu ,SetsubMenu,allowedMenu } = authSlice.actions;
export default authSlice.reducer;
 