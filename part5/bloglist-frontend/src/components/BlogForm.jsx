import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Typography } from '@mui/material';

const BlogForm = ({ onCreateBlog, onFormSubmit }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    onCreateBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  return (
    <>
      <Typography variant="h4" component="div" gutterBottom>
        Create New Blog
      </Typography>
      <form data-testid="blog-form" onSubmit={handleSubmit}>
        <div>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            margin="normal"
            size="small"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            id="author"
            label="Author"
            variant="outlined"
            margin="normal"
            size="small"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            id="url"
            label="URL"
            variant="outlined"
            margin="normal"
            size="small"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button id="createButton" type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </>
  );
};

BlogForm.propTypes = {
  onCreateBlog: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func,
};

export default BlogForm;