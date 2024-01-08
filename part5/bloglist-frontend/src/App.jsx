// Importing necessary libraries, services and components
import { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, fetchBlogs, likeBlog, deleteBlog, setNotification, setUser, clearUser } from './store';
import "./App.css";

const App = () => {
  // Local state for form inputs and messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [result, setResult] = useState(null);

  // Redux state and dispatch function
  const user = useSelector(state => state.user);
  const blogs = useSelector(state => state.blogs);
  const dispatch = useDispatch();

  // Reference for the blog form
  const blogFormRef = useRef();

  // Fetch blogs on component mount
  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  // Login user
  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatch(setUser(user))
      setUsername("");
      setPassword("");
    } catch (exception) {
      setResult("error");
      setMessage("wrong username or password");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  // Logout user
  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(clearUser());
  };

  // Like a blog
  const handleLike = (likedBlog) => {
    blogService.setToken(user.token);
    dispatch(likeBlog(likedBlog));
  };

  // Delete a blog
  const handleDeleteBlog = async (blogToDelete) => {
    if (
      window.confirm(`Delete ${blogToDelete.title} by ${blogToDelete.author}`)
    ) {
      try {
        blogService.setToken(user.token);
        dispatch(deleteBlog(blogToDelete.id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Create a new blog
  const handleCreateBlog = async (blogObject) => {
    blogService.setToken(user.token);
    try {
      dispatch(createBlog(blogObject));
      dispatch(setNotification(
        `${blogObject.title} by ${blogObject.author} added`,
        'success',
        5
      ));
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      dispatch(setNotification(
        `Error adding blog: ${error}`,
        'error',
        5
      ));
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user)); 
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  // Sort blogs by likes
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  // Render the component
  return (
    <div>
      <Notification message={message} result={result} />
      {!user && (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleSubmit={loginUser}
        />
      )}
      {user && (
        <div>
          <h1>blogs</h1>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm onCreateBlog={handleCreateBlog}></BlogForm>
          </Togglable>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onLike={handleLike}
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;