import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, TextField, Typography, Grid } from '@mui/material';

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
      <Typography variant="h6">Add Your Comment</Typography>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={2}>
          <TextField
            variant="outlined"
            required
            id="comment"
            label="Comment"
            name="comment"
            autoComplete="comment"
            autoFocus
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add Comment
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CommentForm;