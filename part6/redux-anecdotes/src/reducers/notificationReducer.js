import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(state, action) {
      state.message = action.payload;
    },
    clearNotification(state) {
      state.message = null
    }
  },
});

export const { updateNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
