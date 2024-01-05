// Import necessary hooks from React and Redux
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// Import the action creator for clearing notifications from the store module
import { clearNotification } from '../store'

// Define a functional component for displaying notifications
const Notification = () => {
  // Get the Redux dispatch function
  const dispatch = useDispatch()
  // Select the notification state from the Redux store
  const notification = useSelector(state => state.notification)

  // Use the useEffect hook to set up a side effect
  useEffect(() => {
    // If there is a notification and it has a duration
    if (notification && notification.duration) {
      // Set a timer to clear the notification after the specified duration
      const timer = setTimeout(() => {
        dispatch(clearNotification())
      }, notification.duration * 1000)

      // Return a cleanup function that clears the timer
      return () => clearTimeout(timer)
    }
  }, [notification, dispatch]) // This effect depends on the notification state and the dispatch function

  // If there is no notification, don't render anything
  if (!notification) {
    return null
  }

  // Extract the message and messageType from the notification state
  const { message, messageType } = notification

  // Render a div with the messageType as the class name and the message as the content
  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

// Export the Notification component as the default export of this module
export default Notification