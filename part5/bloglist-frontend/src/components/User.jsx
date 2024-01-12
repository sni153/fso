import React from 'react';
import UserStatus from './UserStatus';
import { Link } from 'react-router-dom';

const User = ({ user, handleLogout }) => {
  if (!user) {
    return null;
  }

  return (
    <div>
      <UserStatus user={user} handleLogout={handleLogout} />
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;