import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import Blog from "../components/Blog";

const BlogsView = ({ user, blogFormRef, handleCreateBlog, sortedBlogs, handleLikeBlog, handleDeleteBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
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