import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import './App.css'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [result, setResult] = useState(null)
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  const loginUser = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setResult('error')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleLike = async (likedBlog) => {
    try {
      blogService.setToken(user.token)
      const updatedBlog = {
        ...likedBlog,
        likes: likedBlog.likes + 1,
      }
      await blogService.update(updatedBlog, likedBlog.id)

      // Update the blogs state, then re-sort by likes in descending order
      const updatedBlogs = blogs.map(blog => (blog.id === likedBlog.id ? updatedBlog : blog))
      const sortedUpdatedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedUpdatedBlogs)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveBlog = async (blogToRemove) => {
    if (window.confirm(`Remove ${blogToRemove.title} by ${blogToRemove.author}`)) {
      try {
        blogService.setToken(user.token)
        await blogService.removeBlog(blogToRemove.id)
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogToRemove.id)
        setBlogs(updatedBlogs)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleCreateBlog = async (blogObject) => {
    blogService.setToken(user.token)
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setResult('success')
      setMessage(`${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setResult('error')
      setMessage(`Error adding blog: ${error}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Notification message={message} result={result}/>
      {!user && (
        <Togglable buttonLabel="show login form">
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleSubmit={loginUser}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              onCreateBlog={handleCreateBlog}
            >
            </BlogForm>
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} onLike={handleLike} onRemove={handleRemoveBlog}/>
          )}
        </div>
      )}
    </div>
  )
}

export default App