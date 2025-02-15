import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import clientFormReducer from './clientFormSlice';
import authReducer from './authSlice';
import menuSlice from '../store/slices/menuSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    clientForm: clientFormReducer,
    auth: authReducer,
    menuSlice:menuSlice
  },
});

export default store;