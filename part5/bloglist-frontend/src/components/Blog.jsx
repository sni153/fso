import { useState } from 'react';
import blogService from '../services/blogs'

const Blog = ({ blog: initialBlog, user, onRemove }) => {
  const [blog, setBlog] = useState(initialBlog);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const addLike = async () => {
    try {
      blogService.setToken(user.token);
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      await blogService.update(updatedBlog, updatedBlog.id); // Use updatedBlog.id
      setBlog(updatedBlog); // Update the local state with the updated blog object
    } catch (error) {
        console.log(error)
    }
  };

  const RemoveBlogButton = () => {
    const isUserTheAuthor = user.username === blog.user.username;
    return (
      isUserTheAuthor && (
        <button className="remove" onClick={() => onRemove(blog)}>remove</button>
      )
    );
  };

  return (
    <div style={blogStyle}>
      <div>
        <div style={hideWhenVisible}>
          {blog.title} {blog.author}
          <button className="button" onClick={toggleVisibility}>view</button>
        </div>
        <div style={showWhenVisible}>
          <div>
            {blog.title} {blog.author}           
            <button className="button" onClick={toggleVisibility}>hide</button>
          </div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button className="button" onClick={addLike}>like</button>
          </p>
          <p>{blog.author}</p>
          <RemoveBlogButton />
        </div>
      </div>
    </div>
  );
};

export default Blog;
