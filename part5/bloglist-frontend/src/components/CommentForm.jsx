import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await axios.post(`/api/blogs/${blogId}/comments`, { comment: newComment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', blogId]);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>comments</h3>
      <input
        type="text"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button type="submit">add comment</button>
    </form>
  );
};

export default CommentForm;