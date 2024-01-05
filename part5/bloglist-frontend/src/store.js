// Import the configureStore function from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit'

// Define an action creator for setting a notification. 
// This function returns an action object with a type of 'SET_NOTIFICATION' 
// and a payload containing the message, messageType, and duration.
export const setNotification = (message, messageType, duration) => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      message,
      messageType,
      duration
    }
  }
}

// Define an action creator for clearing a notification. 
// This function returns an action object with a type of 'CLEAR_NOTIFICATION'.
export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

// Define a reducer for handling notification-related actions. 
// This function takes the current state and an action, and returns the new state.
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      // If the action is 'SET_NOTIFICATION', return the data from the action as the new state.
      return action.data
    case 'CLEAR_NOTIFICATION':
      // If the action is 'CLEAR_NOTIFICATION', return null as the new state.
      return null
    default:
      // If the action is not recognized, return the current state unchanged.
      return state
  }
}

// Create a Redux store using the configureStore function from Redux Toolkit. 
// The store is configured with the notificationReducer to handle changes to the notification slice of the state.
const store = configureStore({
  reducer: {
    notification: notificationReducer
  }
})

// Export the store as the default export of this module.
export default store