import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    menus: [],
    submenus: [],
    allowedRoutes: [],
    loading: false,
    error: null
  },
  reducers: {
    setMenus: (state, action) => {
      state.menus = action.payload;
    },
    setSubmenus: (state, action) => {      
      state.submenus = action.payload;
      // Create allowed routes array from submenus
      state.allowedRoutes = action.payload.map(submenu => submenu.pathurl);
    }
  }
});

export const { setMenus, setSubmenus } = menuSlice.actions;
export default menuSlice.reducer; 