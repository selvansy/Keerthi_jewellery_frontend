import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalType: null,
  header: '',
  formData: null,
  buttons: null,
  options: [],
  extraData:{}
};
 
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.header = action.payload.header;
      state.formData = action.payload.formData;
      state.buttons = action.payload.buttons;
      state.options = action.payload.options || [];
      state.extraData=action.payload.extraData || {};
    },
    closeModal: (state) => {
      return initialState;
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;