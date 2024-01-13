import React from 'react';
import { useQuery } from '@tanstack/react-query';
import commentService from '../services/comments'; 

const CommentList = ({ blogId }) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentService.getAll(blogId)
  });

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div>
      <h2>Comments</h2>
      <ul>
      {comments && comments.map((comment, index) => (
        <li key={index}>{comment}</li> 
      ))}
      </ul>
    </div>
  );
};

export default CommentList;