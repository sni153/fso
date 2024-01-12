import { useState } from "react";
import { Link } from 'react-router-dom';

const Blog = ({ blog, user, onLike, onDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = () => {
    onLike(blog);
  };

  return (
    <div style={blogStyle} data-testid="blog">
      <div className="blog">
        <div data-testid="titleAuthor">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;