import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './modalSlice';
import clientFormReducer from './clientFormSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    clientForm: clientFormReducer,
    auth: authReducer,
  },
});

export default store;