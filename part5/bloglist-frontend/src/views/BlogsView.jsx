import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import Blog from "../components/Blog";

const BlogsView = ({ user, handleLogout, blogFormRef, handleCreateBlog, sortedBlogs, handleLikeBlog, handleDeleteBlog }) => {
  return (
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
  );
};

export default BlogsView;