import { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, fetchBlogs, likeBlog, deleteBlog, setNotification } from './store';
import "./App.css";

const App = () => {
  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [result, setResult] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  const blogs = useSelector(state => state.blogs);

  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
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

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const handleLike = async (likedBlog) => {
    try {
      blogService.setToken(user.token);
      const updatedBlog = {
        ...likedBlog,
        likes: likedBlog.likes + 1,
      };
    dispatch(likeBlog(updatedBlog, likedBlog.id));
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

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
