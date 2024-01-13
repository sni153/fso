// Import React and necessary hooks
import React, { useContext } from 'react';

// Import useParams from react-router-dom for accessing route parameters
import { useParams } from 'react-router-dom';

// Import useQuery from react-query for data fetching
import { useQuery } from '@tanstack/react-query';

// Import the service to fetch blog data
import blogService from '../services/blogs';

// Import UserContext for accessing user data
import { UserContext } from '../contexts/UserContext'; 

const BlogView = ({ handleLikeBlog }) => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getOne(id)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const likeBlog = () => {
    handleLikeBlog(blog);
  };

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      <p>{blog.likes} likes <button onClick={(likeBlog)}>Like</button></p>
      <p>added by {blog.author}</p>
    </div>
  );
};

export default BlogView;