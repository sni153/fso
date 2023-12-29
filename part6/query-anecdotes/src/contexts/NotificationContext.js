// Importing necessary libraries
import { createContext } from 'react';

// Creating a context for notifications
const NotificationContext = createContext();

// Reducer function for handling notification state
const notificationReducer = (state, action) => {
  switch (action.type) {
    // If the action is to set a notification, return the payload as the new state
    case 'SET_NOTIFICATION':
      return action.payload;
    // If the action is to clear the notification, return null as the new state
    case 'CLEAR_NOTIFICATION':
      return null;
    // If the action doesn't match any cases, return the current state
    default:
      return state;
  }
};

// Exporting the NotificationContext and notificationReducer for use in other components
export { NotificationContext, notificationReducer };