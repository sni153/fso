import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onLike, onRemove, onView }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLike = () => {
    onLike(blog)
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    // Pass visibility status to onView prop, if needed
    if (onView) {
      onView(!visible)
    }
  }

  const RemoveBlogButton = () => {
    const isUserTheAuthor = user.username === blog.user.username
    return (
      isUserTheAuthor && (
        <button className="remove" onClick={() => onRemove(blog)}>remove</button>
      )
    )
  }

  return (
    <div style={blogStyle} data-testid="blog">
      <div>
        <div data-testid="title-author">
          {blog.title} {blog.author}
          <button className="button" onClick={toggleVisibility} data-testid="toggle-button">
            {visible ? 'hide' : 'view'}
          </button>
        </div>
        <div style={showWhenVisible} data-testid="blog-details">
          <p data-testid="blog-url">{blog.url}</p>
          <p data-testid="blog-likes">
            likes {blog.likes}
            <button className="button" onClick={handleLike}>like</button>
          </p>
          <div>{blog.user.username}</div>
          {user.username === blog.user.username && (
            <button className="remove" onClick={() => onRemove(blog)}>remove</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
