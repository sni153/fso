// Import the configureStore function from Redux Toolkit
// This function is used to create a Redux store
import { configureStore } from '@reduxjs/toolkit'

// Import the blogService module, which contains functions for making HTTP requests related to blogs
import blogService from './services/blogs'
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null, // Initial state is null when no user is logged in
  reducers: {
    setUser: (state, action) => action.payload, // Set the user state to the payload of the action
    clearUser: () => null, // Clear the user state by setting it to null
  },
});

export const { setUser, clearUser } = userSlice.actions; // Export the action creators

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
  return async (dispatch, getState) => {
    const newBlog = await blogService.create(blog);
    // Manually set the user field of the new blog to the current user
    newBlog.user = getState().user;
    dispatch({
      type: 'CREATE_BLOG',
      data: newBlog,
    });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    const returnedBlog = await blogService.update(updatedBlog, blog.id);
    // Keep the original user object
    returnedBlog.user = blog.user;
    dispatch({
      type: 'LIKE_BLOG',
      data: returnedBlog,
    });
  };
};

export const deleteBlog = (blogId) => {
  return async dispatch => {
    await blogService.deleteBlog(blogId)
    dispatch({
      type: 'DELETE_BLOG',
      data: { id: blogId }
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
    case 'LIKE_BLOG':
      return state.map(blog => blog.id === action.data.id ? action.data : blog)
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data.id) 
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
    notification: notificationReducer,
    user: userSlice.reducer
  }
})

// Export the store as the default export of this module
// This allows other modules to import the store and interact with it
export default store