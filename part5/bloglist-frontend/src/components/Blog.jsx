import { useState } from "react";

const Blog = ({ blog, user, onLike, onDelete, onView }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };

  const handleLike = () => {
    onLike(blog);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
    if (onView) {
      onView(!visible);
    }
  };

  return (
    <div style={blogStyle} data-testid="blog">
      <div className="blog">
        <div data-testid="titleAuthor">
          {blog.title} {blog.author}
          <button
            className="button"
            onClick={toggleVisibility}
            data-testid="toggle-button"
          >
            {visible ? "hide" : "view"}
          </button>
        </div>
        <div style={showWhenVisible} data-testid="blogDetails">
          <p data-testid="blogUrl">{blog.url}</p>
          <p data-testid="blogLikes">
            likes {blog.likes}
            <button className="button likeButton" onClick={handleLike}>
              like
            </button>
          </p>
          <div>{blog.user.username}</div>
          {user.username === blog.user.username && (
            <button className="delete" onClick={() => onDelete(blog)}>
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
