import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";

const BlogsView = ({ blogFormRef, handleCreateBlog, sortedBlogs }) => {
  return (
    <div>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm onCreateBlog={handleCreateBlog}></BlogForm>
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogsView;