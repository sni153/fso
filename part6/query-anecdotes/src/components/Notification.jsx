// External libraries
import React, { useContext } from 'react'

// Internal modules
import { NotificationContext } from '../contexts/NotificationContext'

const Notification = () => {
  // Using useContext to access the notification from the NotificationContext
  const { notification } = useContext(NotificationContext)

  // Defining the style for the notification
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  // If there's no notification, don't render anything
  if (!notification) return null

  // Rendering the notification
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification