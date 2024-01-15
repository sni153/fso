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

// CommentForm is used to submit new comments.
import CommentForm from '../components/CommentForm';

// CommentList is used to display the list of existing comments.
import CommentList from '../components/CommentList';

// Import Material UI components
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';

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
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2">
              {blog.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary">
              <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" component="p">
              {blog.likes} likes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary">
              added by {blog.author}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" startIcon={<ThumbUpIcon />} onClick={likeBlog}>
              Like
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Box p={2}>
        <CommentForm blogId={blog.id}/>
        <CommentList blogId={blog.id}/>
      </Box>
    </Card>
  );
};

export default BlogView;