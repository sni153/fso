// Import the configureStore function from Redux Toolkit
// This function is used to create a Redux store
import { configureStore } from '@reduxjs/toolkit'

// Import the blogService module, which contains functions for making HTTP requests related to blogs
import blogService from './services/blogs'

// Define an asynchronous action creator for fetching blogs
// This function dispatches an action with a type of 'FETCH_BLOGS' and a payload containing the fetched blogs
export const fetchBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'FETCH_BLOGS',
      data: blogs
    })
  }
}

// Define an asynchronous action creator for creating a blog
// This function dispatches an action with a type of 'CREATE_BLOG' and a payload containing the created blog
export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog
    })
  }
}

// Define an action creator for setting a notification
// This function returns an action object with a type of 'SET_NOTIFICATION' and a payload containing the message, messageType, and duration
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

// Define an action creator for clearing a notification
// This function returns an action object with a type of 'CLEAR_NOTIFICATION'
export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

// Define a reducer for handling notification-related actions
// This function takes the current state and an action, and returns the new state
const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      // If the action is 'SET_NOTIFICATION', return the data from the action as the new state
      return action.data
    case 'CLEAR_NOTIFICATION':
      // If the action is 'CLEAR_NOTIFICATION', return null as the new state
      return null
    default:
      // If the action is not recognized, return the current state unchanged
      return state
  }
}

// Define a reducer for handling blog-related actions
// This function takes the current state and an action, and returns the new state
const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_BLOGS':
      // If the action is 'FETCH_BLOGS', return the data from the action as the new state
      return action.data
    case 'CREATE_BLOG': 
      // If the action is 'CREATE_BLOG', add the data from the action to the current state and return the new state
      return [...state, action.data]
    default: 
      // If the action is not recognized, return the current state unchanged
      return state
  }
}

// Create a Redux store using the configureStore function from Redux Toolkit
// The store is configured with the blogReducer and notificationReducer to handle changes to the blogs and notification slices of the state, respectively
const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer
  }
})

// Export the store as the default export of this module
// This allows other modules to import the store and interact with it
export default store