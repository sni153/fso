// React and hooks
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Services
import loginService from "./services/login";
import blogService from "./services/blogs";
import userService from "./services/users";

// Contexts
import { NotificationContext, notificationReducer } from "./contexts/NotificationContext";
import { UserContext, userReducer } from "./contexts/UserContext";

// Components
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import User from './components/User';

// Views
import UsersView from './views/UsersView';
import BlogsView from './views/BlogsView';

// Router
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Styles
import "./App.css";

const App = () => {
  const blogFormRef = useRef();
  const queryClient = useQueryClient()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, dispatchNotification] = useReducer(notificationReducer, null);
  const [user, dispatchUser] = useReducer(userReducer, null);

  const UserRoute = () => {
    const { id } = useParams();
    const { data: user, isLoading, isError, error } = useQuery({
      queryKey: ['user', id], 
      queryFn: () => userService.get(id), 
      retry: false,
    });
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      return <div>Error: {error.message}</div>;
    }
  
    return <User user={user} />;
  };

  const loginUser = async (event) => {
    event.preventDefault();
  
    try {
      const user = await loginService.login({
        username,
        password,
      });
  
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatchUser({ type: 'SET_USER', payload: user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'error', 
          message: 'wrong username or password' 
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    dispatchUser({ type: 'CLEAR_USER' });
  };

  const likeBlogMutation = useMutation({
    mutationFn: ({ newObject, blogId }) => blogService.update(newObject, blogId), 
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('blogs');
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `Blog ${variables.newObject.title} liked!`,
        } 
      });
      setTimeout(() => {
          dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
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
      likeBlogMutation.mutate({ newObject: updatedBlog, blogId: likedBlog.id });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlogMutation = useMutation({
    mutationFn: (blogId) => blogService.deleteBlog(blogId),
    onSuccess: () => {
      // On success, invalidate and refetch the 'blogs' query
      queryClient.invalidateQueries('blogs');
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: 'Blog deleted successfully!',
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
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
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `${newBlog.title} by ${newBlog.author} added` 
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      blogFormRef.current.toggleVisibility();
    },
    onError: (error) => {
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'error', 
          message: `Error adding blog: ${error}` 
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  });

  const handleCreateBlog = (blogObject) => {
    try {
      blogService.setToken(user.token);
      createBlogMutation.mutate(blogObject);
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `${blogObject.title} by ${blogObject.author} added` 
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      dispatchNotification({ 
        type: 'SET_NOTIFICATION', 
        payload: { 
          type: 'error', 
          message: `Error adding blog: ${error}` 
        } 
      });
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
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
      dispatchUser({ type: 'SET_USER', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const sortedBlogs = blogs ? [...blogs].sort((a, b) => b.likes - a.likes) : [];

  return (
    <Router>
      <NotificationContext.Provider value={{ notification, dispatchNotification }}>
        <UserContext.Provider value={{ user, dispatchUser }}>
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
            <Routes>
              <Route path="/users/:id" element={<UserRoute />} />
              <Route path="/users" element={<UsersView handleLogout={handleLogout} user={user} />} />
              <Route path="/" element={<BlogsView
                user={user} 
                handleLogout={handleLogout} 
                blogFormRef={blogFormRef} 
                handleCreateBlog={handleCreateBlog} 
                sortedBlogs={sortedBlogs} 
                handleLikeBlog={handleLikeBlog} 
                handleDeleteBlog={handleDeleteBlog} 
              />} />
            </Routes>
          )}
        </UserContext.Provider>
      </NotificationContext.Provider>
    </Router>
  );
};

export default App;
