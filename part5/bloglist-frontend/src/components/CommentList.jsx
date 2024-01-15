import React from 'react';
import { useQuery } from '@tanstack/react-query';
import commentService from '../services/comments'; 
import { CircularProgress, List, ListItem, Typography } from '@mui/material';

const CommentList = ({ blogId }) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentService.getAll(blogId)
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments && comments.map((comment, index) => (
          <ListItem key={index}>
            <Typography variant="body1">{comment}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CommentList;