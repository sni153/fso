import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ onCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    onCreateBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h1>create new</h1>
      <form data-testid="blog-form" onSubmit={handleSubmit}>
        <div>
          <label>title:</label>
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label>author:</label>
          <input
            type="text"
            placeholder="Enter author..."
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label>url:</label>
          <input
            type="text"
            placeholder="Enter URL..."
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  onCreateBlog: PropTypes.func.isRequired,
}

export default BlogForm