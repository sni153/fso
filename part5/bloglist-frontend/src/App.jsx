import loginService from './services/login'
import blogService from './services/blogs'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import "./App.css"
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [result, setResult] = useState(null)
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
      blogService.setToken(user.token);
      const updatedBlog = {
        ...likedBlog,
        likes: likedBlog.likes + 1,
      };
      await blogService.update(updatedBlog, likedBlog.id);
  
      // Update the blogs state, then re-sort by likes in descending order
      const updatedBlogs = blogs.map(blog => (blog.id === likedBlog.id ? updatedBlog : blog));
      const sortedUpdatedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedUpdatedBlogs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveBlog = async (blogToRemove) => {
    if (window.confirm(`Remove ${blogToRemove.title} by ${blogToRemove.author}`)) {
      try {
        blogService.setToken(user.token);
        await blogService.removeBlog(blogToRemove.id);
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogToRemove.id);
        setBlogs(updatedBlogs);
      } catch (error) {
        console.log(error);
      }
    }
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
      setResult('success');
      setMessage(`${blogObject.title} by ${blogObject.author} added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      blogFormRef.current.toggleVisibility()
    })
    .catch (error => {
      setResult('error')
      setMessage(`Error adding blog: ${error}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
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
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification message={message} result={result}/>
      {!user && loginForm()}
      {user && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm 
              title={title} 
              author={author} 
              url={url}
              handleSubmit={addBlog}
              setTitle={setTitle}
              setAuthor={setAuthor}
              setUrl={setUrl}>
            </BlogForm>
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} onClick={handleLike} onRemove={handleRemoveBlog}/>
          )}
        </div>
      )}
    </div>
  )
}

export default App