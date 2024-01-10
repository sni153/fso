import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient()
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

  const likeBlogMutation = useMutation({
    mutationFn: ({ newObject, blogId }) => blogService.update(newObject, blogId), 
    onSuccess: (data, variables, context) => {
      // On success, invalidate and refetch the 'blogs' query
      queryClient.invalidateQueries('blogs');
      dispatch({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `Blog ${context.title} liked!`,
        } 
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  })

  const handleLikeBlog = (likedBlog) => {
    try {
      blogService.setToken(user.token);
      const updatedBlog = {
        ...likedBlog,
        likes: likedBlog.likes + 1,
      };
      likeBlogMutation.mutate({ newObject: updatedBlog, blogId: likedBlog.id }, { context: updatedBlog });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlogMutation = useMutation({
    mutationFn: (blogId) => blogService.deleteBlog(blogId),
    onSuccess: () => {
      // On success, invalidate and refetch the 'blogs' query
      queryClient.invalidateQueries('blogs');
      dispatch({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: 'Blog deleted successfully!',
        } 
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const handleDeleteBlog = async (blogToDelete) => {
    if (
      window.confirm(`Delete ${blogToDelete.title} by ${blogToDelete.author}`)
    ) {
      try {
        blogService.setToken(user.token);
        deleteBlogMutation.mutate(blogToDelete.id);
        const response = await blogService.getAll();
      } catch (error) {
        console.log(error);
      }
    }
  };

   // Use useMutation for creating a new blog
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      // On success, invalidate and refetch the 'blogs' query
      queryClient.invalidateQueries('blogs');
      dispatch({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `${newBlog.title} by ${newBlog.author} added` 
        } 
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      blogFormRef.current.toggleVisibility();
    },
    onError: (error) => {
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
  });

  const handleCreateBlog = (blogObject) => {
    try {
      blogService.setToken(user.token);
      createBlogMutation.mutate(blogObject);
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

  const { data: blogs, isError, error, refetch } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

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
              onLike={handleLikeBlog}
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default App;
