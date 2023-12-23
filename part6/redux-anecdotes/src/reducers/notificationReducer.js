import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: 'Initial notification message'
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(state, action) {
      state.message = action.payload;
    },
  },
});

export const { updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
