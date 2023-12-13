import loginService from './services/login'
import blogService from './services/blogs'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleLogin = async (event) => {
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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

const loginForm = () => (
  <form onSubmit={handleLogin}>
    <h1>log in to application</h1>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>      
)

const blogForm = () => (
  <>
  <h1>create new</h1>
  <form onSubmit={addBlog}>
    <div>
    <label>title:</label>
    <input
        type="text"
        value={title}
        name="title"
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      <label>author:</label>
      <input
        type="text"
        value={author}
        name="author"
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      <label>url:</label>
      <input
        type="text"
        value={url}
        name="url"
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>  
  </>
)

const addBlog = (event) => {
  blogService.setToken(user.token)
  event.preventDefault()
  const blogObject = {
    title,
    author,
    url
  }

  blogService
    .create(blogObject)
      .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setTitle('');
      setAuthor('');
      setUrl('');
    })
    .catch (error => {
      console.error('Error adding blog:', error);
    })
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
      blogService.setToken(user.setToken)
    }
  }, [])

  return (
    <div>
      <Notification message={errorMessage}/>
      {!user && loginForm()}
      {user && (
        <div>
          {blogForm()}
          <h1>blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App