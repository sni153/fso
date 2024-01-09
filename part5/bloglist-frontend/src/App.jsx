import { useState, useEffect, useRef } from "react";
import loginService from "./services/login";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import { useReducer } from "react";
import { NotificationContext, notificationReducer } from "./contexts/NotificationContext";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import "./App.css";

const App = () => {
  const blogFormRef = useRef();
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [result, setResult] = useState(null);
  const [notification, dispatch] = useReducer(notificationReducer, null);

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
      await blogService.update(updatedBlog, likedBlog.id);

      // Update the blogs state, then re-sort by likes in descending order
      const updatedBlogs = blogs.map((blog) =>
        blog.id === likedBlog.id ? updatedBlog : blog,
      );
      const sortedUpdatedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedUpdatedBlogs);
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
        await blogService.deleteBlog(blogToDelete.id);
        const response = await blogService.getAll();
        setBlogs(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCreateBlog = async (blogObject) => {
    blogService.setToken(user.token);
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      dispatch({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `${blogObject.title} by ${blogObject.author} added` 
        } 
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      dispatch({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'error', 
          message: `Error adding blog: ${error}` 
        } 
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

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
    <NotificationContext.Provider value={{ notification, dispatch }}>
      <Notification />
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
    </NotificationContext.Provider>
  );
};

export default App;
