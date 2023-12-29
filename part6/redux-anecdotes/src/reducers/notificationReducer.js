// Import the createSlice function from Redux Toolkit.
// This function automatically generates action creators and action types based on the reducers we provide.
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the notification slice of the Redux store.
// Initially, there is no notification message.
const initialState = {
  message: null
}

// Create a slice for the notification feature.
// This automatically generates action creators and action types that correspond to the reducers and state.
const notificationSlice = createSlice({
  name: 'notification', // The name of this slice. Used to generate action types.
  initialState, // The initial state for this slice.
  reducers: {
    // A reducer function that updates the notification message.
    // When an action of type 'notification/updateNotification' is dispatched, this reducer will be called.
    updateNotification(state, action) {
      state.message = action.payload; // Update the state with the new message.
    },
    // A reducer function that clears the notification message.
    // When an action of type 'notification/clearNotification' is dispatched, this reducer will be called.
    clearNotification(state) {
      state.message = null // Clear the message.
    }
  },
});

// Export the generated action creators for use in component files.
export const { updateNotification, clearNotification } = notificationSlice.actions;

// Define an asynchronous action creator that dispatches the updateNotification and clearNotification actions.
// This action creator takes two parameters: the notification message and the duration to display the notification (in seconds).
export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(updateNotification(message)); // Dispatch the updateNotification action with the provided message.
    setTimeout(() => {
      dispatch(clearNotification()); // Dispatch the clearNotification action after the specified duration.
    }, seconds * 1000); // Convert the duration from seconds to milliseconds.
  };
};

// Export the generated reducer for use in the Redux store.
// This reducer will handle all actions that are dispatched with a type that starts with 'notification/'.
export default notificationSlice.reducer;